// Regras de negócio do painel: temperatura do lead, meta do mês e "Seu dia".

export const ETAPAS = ['Novo', 'Qualificando', 'Oferta enviada', 'Diagnóstico marcado', 'Cliente', 'Perdido']
export const VALOR_INTERESSE = { 'Mentoria': 2300, 'Série Clareza': 74, 'Ainda não definido': 0 }
const CHANCE_POR_ETAPA = { 'Qualificando': 0.1, 'Oferta enviada': 0.3, 'Diagnóstico marcado': 0.5 }

// Temperatura de 0 a 100, calculada só com sinais objetivos da conversa e do perfil.
export function calcularScore(conversa) {
  const p = conversa.perfil
  if (p.etapa === 'Cliente') return 100
  if (p.etapa === 'Perdido') return 5
  let s = 20
  s += { 'Ideia (ainda não vende)': 0, 'Começando (até R$ 5 mil)': 10, 'Crescendo (R$ 5 a 30 mil)': 25, 'Estruturado (acima de R$ 30 mil)': 30 }[p.faturamento] || 0
  s += { 'Qualificando': 5, 'Oferta enviada': 15, 'Diagnóstico marcado': 30 }[p.etapa] || 0
  if (p.interesse === 'Mentoria') s += 10
  if (p.interesse === 'Série Clareza') s += 5
  const textoCliente = (conversa.mensagens || []).filter(m => m.autor === 'cliente').map(m => m.texto.toLowerCase()).join(' ')
  if (/\b(quero|link|pre[cç]o|valor|quanto custa|como (compro|pago)|pix|parcel)/.test(textoCliente)) s += 15
  if (conversa.naoLidas > 0) s += 5
  if (conversa.ultimaClienteEm && Date.now() - conversa.ultimaClienteEm > 72 * 3600e3) s -= 15
  return Math.max(0, Math.min(99, s))
}

export function resumoMeta(conversas, meta, vendidoExtra = 0) {
  const valor = c => VALOR_INTERESSE[c.perfil.interesse] || 0
  const vendido = conversas.filter(c => c.perfil.etapa === 'Cliente').reduce((a, c) => a + valor(c), 0) + vendidoExtra
  const abertos = conversas.filter(c => CHANCE_POR_ETAPA[c.perfil.etapa])
  const emNegociacao = abertos.reduce((a, c) => a + valor(c), 0)
  const previsao = Math.round(abertos.reduce((a, c) => a + valor(c) * CHANCE_POR_ETAPA[c.perfil.etapa], 0))
  return { meta, vendido, emNegociacao, previsao, falta: Math.max(0, meta - vendido - previsao) }
}

export function valorPorEtapa(conversas) {
  return Object.fromEntries(ETAPAS.map(e => [e, conversas.filter(c => c.perfil.etapa === e).reduce((a, c) => a + (VALOR_INTERESSE[c.perfil.interesse] || 0), 0)]))
}

const primeiroNome = c => (c.nome || '').split(' ')[0]
const tempo = ms => { const h = (Date.now() - ms) / 3600e3; return h < 1 ? `${Math.max(1, Math.round(h * 60))} min` : h < 48 ? `${Math.round(h)} h` : `${Math.round(h / 24)} dias` }

export function tarefasDoDia(conversas, pendentesAprendizado) {
  const T = []
  const em24h = Date.now() + 24 * 3600e3
  for (const c of conversas) {
    if (c.perfil.diagnosticoEm && c.perfil.diagnosticoEm > Date.now() && c.perfil.diagnosticoEm < em24h + 24 * 3600e3) {
      const quando = new Date(c.perfil.diagnosticoEm).toLocaleString('pt-BR', { weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' })
      T.push({ prioridade: 1, titulo: `Diagnóstico com ${primeiroNome(c)}: ${quando}`, detalhe: `${c.perfil.empresa || c.phone}. O briefing está pronto.`, acao: 'briefing', phone: c.phone })
    }
  }
  for (const c of conversas.filter(c => c.naoLidas && c.perfil.score >= 75 && c.ultimaAutor === 'cliente')) {
    T.push({ prioridade: 1, titulo: `${primeiroNome(c)} está quente e esperando`, detalhe: `${c.perfil.empresa || c.phone}. Última mensagem: "${c.ultimaTexto.slice(0, 90)}"`, acao: 'abrir', phone: c.phone })
  }
  for (const c of conversas.filter(c => !c.ativa && c.etiquetas.includes('precisa-rafael') && c.ultimaAutor === 'cliente')) {
    T.push({ prioridade: 1, titulo: `${primeiroNome(c)} está esperando você`, detalhe: 'A Clara está pausada nesta conversa.', acao: 'abrir', phone: c.phone })
  }
  for (const c of conversas.filter(c => !c.janelaAberta && c.ultimaClienteEm && !['Cliente', 'Perdido'].includes(c.perfil.etapa))) {
    T.push({ prioridade: 2, titulo: `Resgatar ${primeiroNome(c)}: parada há ${tempo(c.ultimaClienteEm)}`, detalhe: `${c.perfil.empresa || c.phone}. Janela de 24h fechada: envie um modelo aprovado.`, acao: 'abrir', phone: c.phone })
  }
  for (const c of conversas.filter(c => c.naoLidas && c.perfil.score < 75)) {
    T.push({ prioridade: 2, titulo: `${primeiroNome(c)} mandou ${c.naoLidas} ${c.naoLidas === 1 ? 'mensagem' : 'mensagens'}`, detalhe: `${c.perfil.empresa || c.phone}. A Clara está conduzindo.`, acao: 'abrir', phone: c.phone })
  }
  if (pendentesAprendizado) T.push({ prioridade: 3, titulo: `${pendentesAprendizado} respostas da Clara para revisar`, detalhe: 'Aprovar ou corrigir ensina o seu jeito.', acao: 'aprendizado' })
  const vistos = new Set()
  return T.filter(t => { const k = t.acao + (t.phone || ''); if (vistos.has(k)) return false; vistos.add(k); return true }).sort((a, b) => a.prioridade - b.prioridade)
}
