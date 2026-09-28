// Acesso ao banco D1 do Painel da Clara.
// Usa as tabelas que a Clara já tem (messages, contacts) e cria só tabelas novas "painel_*".
//
// Estrutura existente (worker da Clara):
//   messages (id TEXT PK, phone, role 'user'|'assistant', content, ts ms)
//   contacts (phone PK, name, tags CSV, paused_until ms, wix_id, created ms)
// Mensagens do Rafael ficam como role 'assistant' com o prefixo abaixo (igual ao comando /r).

export const PREFIXO_RAFAEL = '[Rafael respondeu pessoalmente] '
export const agora = () => Date.now()

const TABELAS_PAINEL = [
  `CREATE TABLE IF NOT EXISTS painel_perfis (
    phone TEXT PRIMARY KEY, empresa TEXT, segmento TEXT, tipo TEXT, faturamento TEXT,
    etapa TEXT DEFAULT 'Novo', interesse TEXT DEFAULT 'Ainda não definido', cidade TEXT, uf TEXT,
    o_que_vende TEXT, origem TEXT, resumo TEXT, dores TEXT, score INTEGER DEFAULT 0, notas TEXT DEFAULT '',
    lido_ate INTEGER DEFAULT 0, diagnostico_em INTEGER, perfil_ia_em INTEGER, atualizado_em INTEGER)`,
  `CREATE TABLE IF NOT EXISTS painel_eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT, phone TEXT, tipo TEXT NOT NULL, descricao TEXT, criado_em INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS painel_aprendizado (
    id INTEGER PRIMARY KEY AUTOINCREMENT, phone TEXT, pergunta TEXT NOT NULL, resposta TEXT NOT NULL,
    status TEXT DEFAULT 'pendente', resposta_final TEXT, criado_em INTEGER NOT NULL, revisado_em INTEGER)`,
  `CREATE TABLE IF NOT EXISTS painel_config (chave TEXT PRIMARY KEY, valor TEXT)`,
  `INSERT OR IGNORE INTO painel_config (chave, valor) VALUES ('meta_mensal', '8333')`,
]

let tabelasProntas = false
export async function garantirTabelasPainel(db) {
  if (tabelasProntas) return
  await db.batch(TABELAS_PAINEL.map(sql => db.prepare(sql)))
  tabelasProntas = true
}

function autorDe(role, content) {
  if (role === 'user') return { autor: 'cliente', texto: content }
  if (content.startsWith(PREFIXO_RAFAEL)) return { autor: 'rafael', texto: content.slice(PREFIXO_RAFAEL.length) }
  return { autor: 'clara', texto: content }
}

export async function listarConversas(db) {
  const { results } = await db.prepare(`
    SELECT c.phone, c.name AS nome, c.paused_until AS pausado_ate, c.tags, p.*,
      (SELECT MAX(ts) FROM messages m WHERE m.phone = c.phone AND m.content != '') AS ultima_em,
      (SELECT MAX(ts) FROM messages m WHERE m.phone = c.phone AND m.role = 'user') AS ultima_cliente_em,
      (SELECT content FROM messages m WHERE m.phone = c.phone AND m.content != '' ORDER BY ts DESC LIMIT 1) AS ultima_texto,
      (SELECT role FROM messages m WHERE m.phone = c.phone AND m.content != '' ORDER BY ts DESC LIMIT 1) AS ultima_papel,
      (SELECT COUNT(*) FROM messages m WHERE m.phone = c.phone AND m.role = 'user' AND m.ts > COALESCE(p.lido_ate, 0)) AS nao_lidas,
      (SELECT COUNT(*) FROM messages m WHERE m.phone = c.phone AND m.role = 'assistant') AS respostas_clara
    FROM contacts c
    LEFT JOIN painel_perfis p ON p.phone = c.phone
    WHERE EXISTS (SELECT 1 FROM messages m WHERE m.phone = c.phone)
    ORDER BY ultima_em DESC
  `).all()
  return results.map(normalizarConversa)
}

export async function obterConversa(db, phone) {
  const lista = await listarConversas(db)
  const conversa = lista.find(c => c.phone === phone)
  if (!conversa) return null
  const { results } = await db.prepare(
    "SELECT role, content, ts FROM messages WHERE phone = ? AND content != '' ORDER BY ts ASC, rowid ASC LIMIT 500"
  ).bind(phone).all()
  conversa.mensagens = results.map(r => ({ ...autorDe(r.role, r.content), em: r.ts }))
  return conversa
}

const safeJson = (s, fallback) => { try { return JSON.parse(s) } catch { return fallback } }

function normalizarConversa(r) {
  const pausado = Number(r.pausado_ate) > agora()
  const ultima = autorDe(r.ultima_papel, r.ultima_texto || '')
  return {
    phone: r.phone,
    nome: r.nome || r.phone,
    ativa: !pausado,
    pausadoAte: pausado ? Number(r.pausado_ate) : null,
    ultimaEm: r.ultima_em,
    ultimaClienteEm: r.ultima_cliente_em,
    janelaAberta: !!r.ultima_cliente_em && agora() - r.ultima_cliente_em < 24 * 3600e3,
    ultimaTexto: ultima.texto,
    ultimaAutor: ultima.autor,
    naoLidas: r.nao_lidas || 0,
    respostasClara: r.respostas_clara || 0,
    etiquetas: (r.tags || '').split(',').filter(Boolean),
    perfil: {
      empresa: r.empresa || '', segmento: r.segmento || '', tipo: r.tipo || '', faturamento: r.faturamento || '',
      etapa: r.etapa || 'Novo', interesse: r.interesse || 'Ainda não definido', cidade: r.cidade || '', uf: r.uf || '',
      oQueVende: r.o_que_vende || '', origem: r.origem || '', resumo: r.resumo || '',
      dores: r.dores ? safeJson(r.dores, []) : [], score: r.score || 0, notas: r.notas || '',
      diagnosticoEm: r.diagnostico_em || null,
    },
  }
}

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
  for (const [chave, valor] of Object.entries(campos || {})) {
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
  const conteudo = autor === 'rafael' ? PREFIXO_RAFAEL + texto : texto
  await db.prepare('INSERT INTO messages (id, phone, role, content, ts) VALUES (?, ?, ?, ?, ?)')
    .bind(`p:${agora()}:${Math.random().toString(36).slice(2, 8)}`, phone, autor === 'cliente' ? 'user' : 'assistant', conteudo, agora()).run()
}

export async function definirPausa(db, phone, ate) {
  await db.prepare('UPDATE contacts SET paused_until = ? WHERE phone = ?').bind(ate || 0, phone).run()
}

async function lerEtiquetas(db, phone) {
  const r = await db.prepare('SELECT tags FROM contacts WHERE phone = ?').bind(phone).first()
  return new Set((r?.tags || '').split(',').filter(Boolean))
}

export async function adicionarEtiqueta(db, phone, etiqueta) {
  const tags = await lerEtiquetas(db, phone)
  tags.add(etiqueta)
  await db.prepare('UPDATE contacts SET tags = ? WHERE phone = ?').bind([...tags].join(','), phone).run()
}

export async function removerEtiqueta(db, phone, etiqueta) {
  const tags = await lerEtiquetas(db, phone)
  tags.delete(etiqueta)
  await db.prepare('UPDATE contacts SET tags = ? WHERE phone = ?').bind([...tags].join(','), phone).run()
}

export async function registrarEvento(db, phone, tipo, descricao) {
  await db.prepare('INSERT INTO painel_eventos (phone, tipo, descricao, criado_em) VALUES (?, ?, ?, ?)').bind(phone, tipo, descricao, agora()).run()
}

export async function eventosRecentes(db, horas = 24) {
  const { results } = await db.prepare('SELECT * FROM painel_eventos WHERE criado_em > ? ORDER BY criado_em DESC LIMIT 20').bind(agora() - horas * 3600e3).all()
  return results
}

export async function contarMensagensClara(db, horas = 24) {
  const r = await db.prepare("SELECT COUNT(*) AS n FROM messages WHERE role = 'assistant' AND ts > ?").bind(agora() - horas * 3600e3).first()
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
