// Acesso ao banco D1 do Painel da Clara.

// ── ADAPTADOR ────────────────────────────────────────────────────────────────
// Único lugar a ajustar para bater com as tabelas que já existem na Clara.
// Valores abaixo seguem seed/dev-schema.sql (ambiente local).
export const ADAPTADOR = {
  mensagens: {
    tabela: 'messages',
    telefone: 'phone',
    papel: 'role',
    texto: 'content',
    data: 'created_at', // epoch em ms
    papeis: { cliente: 'user', clara: 'assistant', rafael: 'admin' },
  },
  contatos: {
    tabela: 'contacts',
    telefone: 'phone',
    nome: 'name',
    pausadoAte: 'paused_until', // epoch em ms; null = Clara ativa
  },
}
// ─────────────────────────────────────────────────────────────────────────────

const M = ADAPTADOR.mensagens
const K = ADAPTADOR.contatos
const PAPEL_PARA_AUTOR = Object.fromEntries(Object.entries(M.papeis).map(([autor, papel]) => [papel, autor]))

export const agora = () => Date.now()

export async function listarConversas(db) {
  const { results } = await db.prepare(`
    SELECT c.${K.telefone} AS phone, c.${K.nome} AS nome, c.${K.pausadoAte} AS pausado_ate,
      p.*,
      (SELECT MAX(${M.data}) FROM ${M.tabela} m WHERE m.${M.telefone} = c.${K.telefone}) AS ultima_em,
      (SELECT MAX(${M.data}) FROM ${M.tabela} m WHERE m.${M.telefone} = c.${K.telefone} AND m.${M.papel} = ?1) AS ultima_cliente_em,
      (SELECT ${M.texto} FROM ${M.tabela} m WHERE m.${M.telefone} = c.${K.telefone} ORDER BY ${M.data} DESC LIMIT 1) AS ultima_texto,
      (SELECT ${M.papel} FROM ${M.tabela} m WHERE m.${M.telefone} = c.${K.telefone} ORDER BY ${M.data} DESC LIMIT 1) AS ultima_papel,
      (SELECT COUNT(*) FROM ${M.tabela} m WHERE m.${M.telefone} = c.${K.telefone} AND m.${M.papel} = ?1 AND m.${M.data} > COALESCE(p.lido_ate, 0)) AS nao_lidas,
      (SELECT COUNT(*) FROM ${M.tabela} m WHERE m.${M.telefone} = c.${K.telefone} AND m.${M.papel} = ?2) AS respostas_clara,
      (SELECT GROUP_CONCAT(etiqueta) FROM painel_etiquetas e WHERE e.phone = c.${K.telefone}) AS etiquetas
    FROM ${K.tabela} c
    LEFT JOIN painel_perfis p ON p.phone = c.${K.telefone}
    ORDER BY ultima_em DESC
  `).bind(M.papeis.cliente, M.papeis.clara).all()
  return results.map(normalizarConversa)
}

export async function obterConversa(db, phone) {
  const lista = await listarConversas(db)
  const conversa = lista.find(c => c.phone === phone)
  if (!conversa) return null
  const { results } = await db.prepare(
    `SELECT ${M.papel} AS papel, ${M.texto} AS texto, ${M.data} AS em FROM ${M.tabela} WHERE ${M.telefone} = ? ORDER BY ${M.data} ASC LIMIT 500`
  ).bind(phone).all()
  conversa.mensagens = results.map(r => ({ autor: PAPEL_PARA_AUTOR[r.papel] || 'clara', texto: r.texto, em: r.em }))
  return conversa
}

function normalizarConversa(r) {
  const pausado = r.pausado_ate && r.pausado_ate > agora()
  return {
    phone: r.phone,
    nome: r.nome || r.phone,
    ativa: !pausado,
    pausadoAte: pausado ? r.pausado_ate : null,
    ultimaEm: r.ultima_em,
    ultimaClienteEm: r.ultima_cliente_em,
    janelaAberta: !!r.ultima_cliente_em && agora() - r.ultima_cliente_em < 24 * 3600e3,
    ultimaTexto: r.ultima_texto || '',
    ultimaAutor: PAPEL_PARA_AUTOR[r.ultima_papel] || 'clara',
    naoLidas: r.nao_lidas || 0,
    respostasClara: r.respostas_clara || 0,
    etiquetas: r.etiquetas ? r.etiquetas.split(',') : [],
    perfil: {
      empresa: r.empresa || '',
      segmento: r.segmento || '',
      tipo: r.tipo || '',
      faturamento: r.faturamento || '',
      etapa: r.etapa || 'Novo',
      interesse: r.interesse || 'Ainda não definido',
      cidade: r.cidade || '',
      uf: r.uf || '',
      oQueVende: r.o_que_vende || '',
      origem: r.origem || '',
      resumo: r.resumo || '',
      dores: r.dores ? safeJson(r.dores, []) : [],
      score: r.score || 0,
      notas: r.notas || '',
      diagnosticoEm: r.diagnostico_em || null,
    },
  }
}

const safeJson = (s, fallback) => { try { return JSON.parse(s) } catch { return fallback } }

export async function garantirPerfil(db, phone) {
  await db.prepare('INSERT OR IGNORE INTO painel_perfis (phone, atualizado_em) VALUES (?, ?)').bind(phone, agora()).run()
}

const CAMPOS_PERFIL = {
  empresa: 'empresa', segmento: 'segmento', tipo: 'tipo', faturamento: 'faturamento', etapa: 'etapa',
  interesse: 'interesse', cidade: 'cidade', uf: 'uf', oQueVende: 'o_que_vende', origem: 'origem',
  resumo: 'resumo', dores: 'dores', score: 'score', notas: 'notas', diagnosticoEm: 'diagnostico_em',
}

export async function atualizarPerfil(db, phone, campos) {
  await garantirPerfil(db, phone)
  const sets = [], valores = []
  for (const [chave, valor] of Object.entries(campos)) {
    const coluna = CAMPOS_PERFIL[chave]
    if (!coluna) continue
    sets.push(`${coluna} = ?`)
    valores.push(chave === 'dores' ? JSON.stringify(valor || []) : valor)
  }
  if (!sets.length) return
  sets.push('atualizado_em = ?')
  valores.push(agora(), phone)
  await db.prepare(`UPDATE painel_perfis SET ${sets.join(', ')} WHERE phone = ?`).bind(...valores).run()
}

export async function marcarLida(db, phone) {
  await garantirPerfil(db, phone)
  await db.prepare('UPDATE painel_perfis SET lido_ate = ? WHERE phone = ?').bind(agora(), phone).run()
}

export async function salvarMensagem(db, phone, autor, texto) {
  await db.prepare(`INSERT INTO ${M.tabela} (${M.telefone}, ${M.papel}, ${M.texto}, ${M.data}) VALUES (?, ?, ?, ?)`)
    .bind(phone, M.papeis[autor], texto, agora()).run()
}

export async function definirPausa(db, phone, ate) {
  await db.prepare(`UPDATE ${K.tabela} SET ${K.pausadoAte} = ? WHERE ${K.telefone} = ?`).bind(ate, phone).run()
}

export async function adicionarEtiqueta(db, phone, etiqueta) {
  await db.prepare('INSERT OR IGNORE INTO painel_etiquetas (phone, etiqueta, criado_em) VALUES (?, ?, ?)').bind(phone, etiqueta, agora()).run()
}

export async function removerEtiqueta(db, phone, etiqueta) {
  await db.prepare('DELETE FROM painel_etiquetas WHERE phone = ? AND etiqueta = ?').bind(phone, etiqueta).run()
}

export async function registrarEvento(db, phone, tipo, descricao) {
  await db.prepare('INSERT INTO painel_eventos (phone, tipo, descricao, criado_em) VALUES (?, ?, ?, ?)').bind(phone, tipo, descricao, agora()).run()
}

export async function eventosRecentes(db, horas = 24) {
  const { results } = await db.prepare('SELECT * FROM painel_eventos WHERE criado_em > ? ORDER BY criado_em DESC LIMIT 20').bind(agora() - horas * 3600e3).all()
  return results
}

export async function contarMensagensClara(db, horas = 24) {
  const r = await db.prepare(`SELECT COUNT(*) AS n FROM ${M.tabela} WHERE ${M.papel} = ? AND ${M.data} > ?`).bind(M.papeis.clara, agora() - horas * 3600e3).first()
  return r?.n || 0
}

export async function listarAprendizado(db) {
  const { results } = await db.prepare("SELECT * FROM painel_aprendizado WHERE status = 'pendente' ORDER BY criado_em DESC LIMIT 50").all()
  return results
}

export async function revisarAprendizado(db, id, respostaFinal) {
  const status = respostaFinal ? 'corrigida' : 'aprovada'
  await db.prepare('UPDATE painel_aprendizado SET status = ?, resposta_final = COALESCE(?, resposta), revisado_em = ? WHERE id = ?')
    .bind(status, respostaFinal || null, agora(), id).run()
}

export async function registrarPerguntaParaRevisao(db, phone, pergunta, resposta) {
  await db.prepare('INSERT INTO painel_aprendizado (phone, pergunta, resposta, criado_em) VALUES (?, ?, ?, ?)').bind(phone, pergunta, resposta, agora()).run()
}

export async function lerConfig(db, chave, padrao) {
  const r = await db.prepare('SELECT valor FROM painel_config WHERE chave = ?').bind(chave).first()
  return r ? r.valor : padrao
}

export async function salvarConfig(db, chave, valor) {
  await db.prepare('INSERT INTO painel_config (chave, valor) VALUES (?, ?) ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor').bind(chave, String(valor)).run()
}
