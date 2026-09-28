// Rotas do Painel da Clara: /painel (tela) e /painel/api/* (dados).
import UI from './ui.js'
import * as db from './db.js'
import { calcularScore, resumoMeta, tarefasDoDia, valorPorEtapa, ETAPAS } from './negocio.js'
import { enviarTexto, enviarModelo, MODELOS } from './whatsapp.js'
import { extrairPerfil, sugerirRespostas, gerarBriefing, OPCOES } from './ai.js'

const PAUSA_RESPOSTA_MS = 12 * 3600e3
const SESSAO_MS = 30 * 24 * 3600e3
const LINK_DIAGNOSTICO = 'rafaelbosi.com/30-min'
const BOAS_VINDAS_MENTORIA = 'Seja muito bem-vindo(a) à Mentoria! 🎉 São 4 encontros de 1h30 com o Rafael, em até 45 dias. Agenda o primeiro aqui: rafaelbosi.com/agendamento-mentoria. Já deixa os próximos marcados também, fica mais fácil manter o ritmo.'

const json = (dados, status = 200, extra = {}) => new Response(JSON.stringify(dados), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } })
const erro = (mensagem, status = 400) => json({ erro: mensagem }, status)

// ── Sessão por senha (cookie assinado com HMAC) ─────────────────────────────
async function assinar(segredo, texto) {
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(segredo), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(texto))
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c]))
}
const iguais = (a, b) => { if (a.length !== b.length) return false; let x = 0; for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i); return x === 0 }

async function autenticado(request, env) {
  if (env.PAINEL_DEV === '1' && !env.PAINEL_SENHA) return true
  if (!env.PAINEL_SENHA) return false
  const cookie = (request.headers.get('Cookie') || '').split(/;\s*/).find(c => c.startsWith('painel='))
  if (!cookie) return false
  const [expira, sig] = cookie.slice(7).split('.')
  if (!expira || !sig || Number(expira) < Date.now()) return false
  return iguais(sig, await assinar(env.PAINEL_SENHA, expira))
}

async function login(request, env) {
  const { senha } = await request.json().catch(() => ({}))
  if (!env.PAINEL_SENHA || typeof senha !== 'string' || !iguais(senha, env.PAINEL_SENHA)) {
    await new Promise(r => setTimeout(r, 1500)) // atrasa tentativas de adivinhar a senha
    return erro('Senha incorreta.', 401)
  }
  const expira = String(Date.now() + SESSAO_MS)
  const valor = `${expira}.${await assinar(env.PAINEL_SENHA, expira)}`
  return json({ ok: true }, 200, { 'Set-Cookie': `painel=${valor}; Path=/painel; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSAO_MS / 1000}` })
}
// ─────────────────────────────────────────────────────────────────────────────

async function conversasComScore(env) {
  const lista = await db.listarConversas(env.DB)
  for (const c of lista) if (!c.perfil.score) c.perfil.score = calcularScore({ ...c, mensagens: [] })
  return lista
}

export async function handlePainel(request, env, ctx) {
  const url = new URL(request.url)
  const caminho = url.pathname.replace(/\/+$/, '') || '/painel'
  const metodo = request.method

  if (caminho === '/painel' && metodo === 'GET') return new Response(UI, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
  if (caminho === '/painel/api/login' && metodo === 'POST') return login(request, env)
  if (!caminho.startsWith('/painel/api/')) return new Response('Não encontrado', { status: 404 })
  if (!(await autenticado(request, env))) return erro('Faça login para continuar.', 401)

  try {
    const partes = caminho.slice('/painel/api/'.length).split('/')
    const corpo = ['POST', 'PUT'].includes(metodo) ? await request.json().catch(() => ({})) : {}

    if (partes[0] === 'eu') return json({ ok: true, dev: env.PAINEL_DEV === '1' })

    if (partes[0] === 'opcoes') return json({ ...OPCOES, modelos: MODELOS })

    if (partes[0] === 'dia' && metodo === 'GET') {
      const conversas = await conversasComScore(env)
      const pendentes = (await db.listarAprendizado(env.DB)).length
      const meta = Number(await db.lerConfig(env.DB, 'meta_mensal', '8333'))
      return json({
        tarefas: tarefasDoDia(conversas, pendentes),
        meta: resumoMeta(conversas, meta),
        eventos: await db.eventosRecentes(env.DB, 48),
        mensagensClara24h: await db.contarMensagensClara(env.DB, 24),
      })
    }

    if (partes[0] === 'funil' && metodo === 'GET') {
      const conversas = await conversasComScore(env)
      const meta = Number(await db.lerConfig(env.DB, 'meta_mensal', '8333'))
      return json({ etapas: ETAPAS, valores: valorPorEtapa(conversas), meta: resumoMeta(conversas, meta), conversas })
    }

    if (partes[0] === 'config' && metodo === 'PUT') {
      if (corpo.metaMensal !== undefined) await db.salvarConfig(env.DB, 'meta_mensal', Math.max(0, Number(corpo.metaMensal) || 0))
      return json({ ok: true })
    }

    if (partes[0] === 'aprendizado') {
      if (metodo === 'GET') return json({ itens: await db.listarAprendizado(env.DB) })
      if (metodo === 'POST' && partes[1]) { await db.revisarAprendizado(env.DB, Number(partes[1]), corpo.respostaFinal); return json({ ok: true }) }
    }

    if (partes[0] === 'conversas') {
      if (!partes[1]) return json({ conversas: await conversasComScore(env) })
      const phone = decodeURIComponent(partes[1])
      const acao = partes[2]
      const conversa = await db.obterConversa(env.DB, phone)
      if (!conversa) return erro('Conversa não encontrada.', 404)
      const primeiroNome = conversa.nome.split(' ')[0]

      if (!acao && metodo === 'GET') {
        await db.marcarLida(env.DB, phone)
        conversa.perfil.score = calcularScore(conversa)
        await db.atualizarPerfil(env.DB, phone, { score: conversa.perfil.score })
        return json(conversa)
      }

      if (acao === 'enviar' && metodo === 'POST') {
        const texto = String(corpo.texto || '').trim()
        if (!texto) return erro('Escreva a mensagem antes de enviar.')
        if (!conversa.janelaAberta) return erro('A janela de 24h está fechada. Use um modelo aprovado.', 409)
        await enviarTexto(env, phone, `*Rafael:* ${texto}`)
        await db.salvarMensagem(env.DB, phone, 'rafael', texto)
        await db.definirPausa(env.DB, phone, Date.now() + PAUSA_RESPOSTA_MS)
        return json({ ok: true, pausadaAte: Date.now() + PAUSA_RESPOSTA_MS })
      }

      if (acao === 'pausa' && metodo === 'POST') {
        const ate = corpo.ativa ? null : Date.now() + (Number(corpo.horas) || 12) * 3600e3
        await db.definirPausa(env.DB, phone, ate)
        return json({ ok: true, ativa: !!corpo.ativa })
      }

      if (acao === 'etiquetas' && metodo === 'POST') {
        const etiqueta = String(corpo.etiqueta || '')
        if (!etiqueta) return erro('Etiqueta inválida.')
        if (corpo.remover) await db.removerEtiqueta(env.DB, phone, etiqueta)
        else await db.adicionarEtiqueta(env.DB, phone, etiqueta)
        // Sincronização com o Wix: ligada na integração (ver INTEGRACAO.md).
        if (typeof env.__sincronizarEtiquetaWix === 'function') ctx?.waitUntil?.(env.__sincronizarEtiquetaWix(phone, etiqueta, !corpo.remover))
        return json({ ok: true })
      }

      if (acao === 'perfil' && metodo === 'PUT') {
        await db.atualizarPerfil(env.DB, phone, corpo)
        if (corpo.etapa === 'Cliente') await db.adicionarEtiqueta(env.DB, phone, 'cliente-ativo')
        if (corpo.etapa) await db.registrarEvento(env.DB, phone, 'etapa', `${conversa.nome} foi para "${corpo.etapa}".`)
        return json({ ok: true })
      }

      if (acao === 'perfil-ia' && metodo === 'POST') {
        const dados = await extrairPerfil(env, conversa)
        await db.atualizarPerfil(env.DB, phone, dados)
        return json({ ok: true, perfil: dados })
      }

      if (acao === 'sugestoes' && metodo === 'GET') return json({ sugestoes: await sugerirRespostas(env, conversa) })

      if (acao === 'briefing' && metodo === 'GET') return json({ conversa: { nome: conversa.nome, perfil: conversa.perfil }, briefing: await gerarBriefing(env, conversa) })

      if (acao === 'modelo' && metodo === 'POST') {
        const modelo = MODELOS.find(m => m.nome === corpo.nome)
        if (!modelo) return erro('Modelo desconhecido.')
        await enviarModelo(env, phone, modelo.nome, primeiroNome)
        await db.salvarMensagem(env.DB, phone, 'clara', `📨 Modelo ${modelo.nome}: ${modelo.texto.replace('{{1}}', primeiroNome)}`)
        await db.registrarEvento(env.DB, phone, 'modelo_enviado', `Modelo ${modelo.nome} enviado para ${conversa.nome}.`)
        return json({ ok: true })
      }

      if (acao === 'diagnostico' && metodo === 'POST') {
        const texto = `Pelo que você me contou, vale uma conversa com o Rafael. Ele tem um Diagnóstico Estratégico de 30 minutos pra olhar seu caso e te dizer o melhor caminho. Escolhe o horário aqui: ${LINK_DIAGNOSTICO}`
        if (!conversa.janelaAberta) return erro('A janela de 24h está fechada. Use o modelo "retomada_diagnostico".', 409)
        await enviarTexto(env, phone, texto)
        await db.salvarMensagem(env.DB, phone, 'clara', texto)
        await db.adicionarEtiqueta(env.DB, phone, 'lead-quente')
        if (['Novo', 'Qualificando'].includes(conversa.perfil.etapa)) await db.atualizarPerfil(env.DB, phone, { etapa: 'Oferta enviada' })
        return json({ ok: true })
      }

      if (acao === 'pagamento' && metodo === 'POST') {
        await db.atualizarPerfil(env.DB, phone, { etapa: 'Cliente', interesse: 'Mentoria' })
        await db.adicionarEtiqueta(env.DB, phone, 'cliente-ativo')
        await db.removerEtiqueta(env.DB, phone, 'lead-quente')
        if (typeof env.__sincronizarEtiquetaWix === 'function') ctx?.waitUntil?.(env.__sincronizarEtiquetaWix(phone, 'cliente-ativo', true))
        if (conversa.janelaAberta) {
          await enviarTexto(env, phone, BOAS_VINDAS_MENTORIA)
          await db.salvarMensagem(env.DB, phone, 'clara', BOAS_VINDAS_MENTORIA)
        }
        await db.registrarEvento(env.DB, phone, 'pagamento', `Pagamento da Mentoria de ${conversa.nome} confirmado manualmente.${conversa.janelaAberta ? ' Boas-vindas enviadas.' : ' Janela fechada: envie o modelo de boas-vindas.'}`)
        return json({ ok: true, boasVindasEnviadas: conversa.janelaAberta })
      }
    }

    return erro('Rota não encontrada.', 404)
  } catch (e) {
    return erro(e.message || 'Erro inesperado.', 500)
  }
}
