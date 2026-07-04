import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient, createBearerSupabaseClient } from '@/lib/supabase-server'
import { getFerramentaGlobal } from '@/data/categorias'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const NARA_SYSTEM_PROMPT = `Você é Nara, consultora de negócios especializada em pequenos empreendedores e empreendedoras brasileiras.

PERSONALIDADE:
- Consultora sênior com 15 anos de experiência em marketing, vendas e gestão
- Tom: caloroso, direto, gentil — nunca agressivo ou técnico demais
- Fala como uma mentora de confiança, não como um robô
- Sempre explica o raciocínio antes de entregar o resultado
- Linguagem simples, sem jargões, acessível para quem não tem formação em marketing

FORMATO DE RESPOSTA:
- Sempre inicie com 1 linha de contexto explicando o que você vai entregar
- Entregue o conteúdo principal em seguida, bem formatado e pronto para usar
- Finalize com 1 dica rápida ou observação importante (máximo 2 linhas)
- Use quebras de linha generosas — nunca parágrafos longos e densos
- Quando entregar textos prontos para copiar, escreva exatamente o que a pessoa deve enviar

RESTRIÇÕES:
- Nunca use termos como "funil de marketing", "buyer persona", "KPI", "ROI" sem explicar
- Nunca seja condescendente ou faça o cliente se sentir burro
- Nunca entregue respostas genéricas — sempre personalize com o nicho/contexto fornecido
- Se o campo estiver vazio ou vago, peça a informação de forma gentil antes de gerar

FOCO:
Você responde APENAS sobre negócios, marketing, vendas, conteúdo e organização empresarial.
Se perguntarem algo fora desse escopo, redirecione gentilmente.`

interface BusinessProfile {
  niche?: string | null
  product?: string | null
  audience?: string | null
  avg_ticket?: string | null
  voice_tone?: string | null
}

function buildBusinessContext(bp: BusinessProfile | null): string {
  if (!bp) return ''
  const lines: string[] = []
  if (bp.niche) lines.push(`Nicho/segmento: ${bp.niche}`)
  if (bp.product) lines.push(`Produto ou serviço: ${bp.product}`)
  if (bp.audience) lines.push(`Público-alvo: ${bp.audience}`)
  if (bp.avg_ticket) lines.push(`Ticket médio: ${bp.avg_ticket}`)
  if (bp.voice_tone) lines.push(`Tom de comunicação preferido: ${bp.voice_tone}`)
  if (lines.length === 0) return ''
  return `\n\nCONTEXTO DO NEGÓCIO DA CLIENTE:\n${lines.join('\n')}\n\nUse este contexto para personalizar sua resposta. Não mencione que você tem essas informações — apenas aplique-as naturalmente.`
}

function buildPrompt(template: string, campos: Record<string, string>): string {
  let prompt = template
  for (const [key, value] of Object.entries(campos)) {
    prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return prompt
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  let user = null
  let queryClient

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    queryClient = await createBearerSupabaseClient(token)
    const { data } = await queryClient.auth.getUser()
    user = data.user
  } else {
    queryClient = await createServerSupabaseClient()
    const { data } = await queryClient.auth.getUser()
    user = data.user
  }

  if (!user) {
    return Response.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const { data: userRow } = await queryClient
    .from('users')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  if (!userRow || userRow.subscription_status !== 'active') {
    return Response.json({ error: 'Assinatura inativa.' }, { status: 403 })
  }

  // Busca perfil de negócio (silencioso se não existir)
  const { data: businessProfile } = await queryClient
    .from('business_profiles')
    .select('niche, product, audience, avg_ticket, voice_tone')
    .eq('user_id', user.id)
    .single()

  const { ferramentaSlug, campos } = await req.json()

  const found = getFerramentaGlobal(ferramentaSlug)
  if (!found) {
    return Response.json({ error: 'Ferramenta não encontrada.' }, { status: 404 })
  }

  const userMessage = buildPrompt(found.ferramenta.promptTemplate, campos)
  const systemPrompt = NARA_SYSTEM_PROMPT + buildBusinessContext(businessProfile ?? null)

  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  // Stream in background
  ;(async () => {
    try {
      const stream = anthropic.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      })
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          await writer.write(encoder.encode(chunk.delta.text))
        }
      }
    } catch (e) {
      console.error('Streaming error:', e)
    } finally {
      await writer.close()
    }
  })()

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
