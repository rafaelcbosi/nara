// Inteligência do painel: perfil automático, sugestões no estilo do Rafael e briefing do Diagnóstico.
import { CEREBRO } from '../cerebro.js'

const MODELO = 'anthropic/claude-haiku-4.5'

async function perguntarIA(env, sistema, usuario, maxTokens = 800) {
  if (!env.OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY não configurada')
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODELO, max_tokens: maxTokens, messages: [{ role: 'system', content: sistema }, { role: 'user', content: usuario }] }),
  })
  const d = await r.json()
  if (!r.ok) throw new Error(d?.error?.message || `OpenRouter respondeu ${r.status}`)
  return d.choices?.[0]?.message?.content || ''
}

const transcricao = c => c.mensagens.slice(-40).map(m => `${m.autor === 'cliente' ? c.nome : m.autor === 'clara' ? 'Clara' : 'Rafael'}: ${m.texto}`).join('\n')

function extrairJson(texto) {
  const i = texto.indexOf('{'), f = texto.lastIndexOf('}')
  return JSON.parse(texto.slice(i, f + 1))
}

export const OPCOES = {
  segmento: ['Beleza e estética', 'Alimentação', 'Educação e mentoria', 'Finanças e contabilidade', 'Moda e varejo', 'Saúde e bem-estar', 'Serviços profissionais', 'Tecnologia', 'Outro'],
  tipo: ['Serviço local', 'Serviço online / consultoria', 'Produto físico', 'Produto digital', 'Comércio / ponto físico'],
  faturamento: ['Ideia (ainda não vende)', 'Começando (até R$ 5 mil)', 'Crescendo (R$ 5 a 30 mil)', 'Estruturado (acima de R$ 30 mil)'],
  etapa: ['Novo', 'Qualificando', 'Oferta enviada', 'Diagnóstico marcado', 'Cliente', 'Perdido'],
  interesse: ['Ainda não definido', 'Série Clareza', 'Mentoria'],
}

// Lê a conversa e preenche o perfil. Só devolve campos que a pessoa realmente informou.
export async function extrairPerfil(env, conversa) {
  const sistema = `Você extrai dados de clientes a partir de conversas de WhatsApp. Responda SOMENTE com JSON válido.
Campos (omita o que não foi dito, nunca invente):
empresa (texto), oQueVende (texto curto), cidade (texto), uf (sigla), segmento (${OPCOES.segmento.join(' | ')}),
tipo (${OPCOES.tipo.join(' | ')}), faturamento (${OPCOES.faturamento.join(' | ')}),
interesse (${OPCOES.interesse.join(' | ')}), resumo (2 frases sobre o negócio e o momento), dores (lista de até 3 frases curtas).`
  const texto = await perguntarIA(env, sistema, transcricao(conversa), 500)
  const dados = extrairJson(texto)
  for (const k of ['segmento', 'tipo', 'faturamento', 'interesse']) if (dados[k] && !OPCOES[k].includes(dados[k])) delete dados[k]
  return dados
}

export async function sugerirRespostas(env, conversa) {
  const sistema = `${CEREBRO}

Você está ajudando o próprio Rafael a responder esta conversa pelo painel. Escreva 3 opções de resposta curtas, na voz do Rafael, em primeira pessoa (ele é o Rafael, não a Clara), cada uma com uma abordagem diferente. Nunca use travessão. Responda SOMENTE com JSON: {"sugestoes": ["...", "...", "..."]}`
  const texto = await perguntarIA(env, sistema, transcricao(conversa), 600)
  return extrairJson(texto).sugestoes.slice(0, 3)
}

export async function gerarBriefing(env, conversa) {
  const sistema = `${CEREBRO}

Prepare o Rafael para um Diagnóstico Estratégico de 30 minutos com este lead. Responda SOMENTE com JSON:
{"resumo": "2 a 3 frases", "dores": ["..."], "perguntas": ["perguntas que o lead fez"], "objecoes": ["objeções prováveis"], "oferta": "oferta indicada e o ângulo", "abertura": "frase de abertura da call na voz do Rafael"}
Nunca use travessão. Não invente fatos que não estão na conversa.`
  const perfil = JSON.stringify(conversa.perfil)
  const texto = await perguntarIA(env, sistema, `Perfil: ${perfil}\n\nConversa:\n${transcricao(conversa)}`, 900)
  return extrairJson(texto)
}
