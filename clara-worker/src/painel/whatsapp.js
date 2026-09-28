// Envio pelo WhatsApp Cloud API (mesmas variáveis que a Clara já usa).
const versao = env => env.GRAPH_VERSION || 'v23.0'

async function enviar(env, corpo) {
  if (env.PAINEL_DEV === '1') return { ok: true, simulado: true }
  const r = await fetch(`https://graph.facebook.com/${versao(env)}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', ...corpo }),
  })
  const dados = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(dados?.error?.message || `WhatsApp respondeu ${r.status}`)
  return dados
}

export const enviarTexto = (env, para, texto) => enviar(env, { to: para, type: 'text', text: { body: texto } })

export const enviarModelo = (env, para, nome, primeiroNome) => enviar(env, {
  to: para,
  type: 'template',
  template: { name: nome, language: { code: 'pt_BR' }, components: [{ type: 'body', parameters: [{ type: 'text', text: primeiroNome }] }] },
})

export const MODELOS = [
  { nome: 'retomada_diagnostico', texto: 'Oi, {{1}}! O Rafael abriu 2 horários pro Diagnóstico Estratégico essa semana. Quer que eu reserve um pra você?' },
  { nome: 'retomada_serie', texto: 'Oi, {{1}}! Lembrei de você. A Série Clareza Digital tem garantia de 7 dias, dá pra testar sem risco. Quer o link?' },
  { nome: 'retomada_pergunta', texto: 'Oi, {{1}}! Tudo certo por aí? Ficou alguma dúvida da nossa conversa?' },
]
