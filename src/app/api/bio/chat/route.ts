import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceSupabaseClient } from '@/lib/supabase-server'
import { getPlanConfig } from '@/lib/plans'

function currentMonthKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface BioItem {
  type: string
  label: string
  price?: string | null
  url?: string | null
}

interface BioPage {
  id: string
  title: string
  whatsapp?: string | null
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function buildSystemPrompt(bioPage: BioPage, items: BioItem[]): string {
  const products = items.filter(i => i.type === 'product')
  const links = items.filter(i => i.type === 'link')

  const productLines = products.length
    ? products.map(i => `- ${i.label}${i.price ? ` — ${i.price}` : ''}`).join('\n')
    : '(nenhum produto cadastrado)'

  const linkLines = links.length
    ? links.map(i => `- ${i.label}: ${i.url}`).join('\n')
    : '(nenhum link cadastrado)'

  return `Você é uma assistente virtual de ${bioPage.title}.
Seu papel é ajudar visitantes a encontrar o produto ou serviço ideal.

PRODUTOS E SERVIÇOS DISPONÍVEIS:
${productLines}

LINKS E RECURSOS:
${linkLines}

INSTRUÇÕES:
- Responda SEMPRE em português brasileiro
- Seja calorosa, objetiva e útil
- Recomende o produto mais adequado para a necessidade do visitante
- Se o visitante quiser comprar, direcione para o WhatsApp: ${bioPage.whatsapp || 'não disponível'}
- Não invente produtos ou preços que não estão listados acima
- Máximo 3 parágrafos por resposta`
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { pageId, sessionToken, message } = body

  if (!pageId || !sessionToken) {
    return Response.json({ error: 'pageId e sessionToken são obrigatórios.' }, { status: 400 })
  }

  if (!message || typeof message !== 'string') {
    return Response.json({ error: 'Mensagem inválida.' }, { status: 400 })
  }

  const trimmedMessage = message.trim().slice(0, 500)

  const supabase = await createServiceSupabaseClient()

  // Load bio page
  const { data: bioPage, error: pageError } = await supabase
    .from('bio_pages')
    .select('*')
    .eq('id', pageId)
    .eq('published', true)
    .single()

  if (pageError || !bioPage) {
    return Response.json({ error: 'Página não encontrada.' }, { status: 404 })
  }

  // Load bio items ordered by position
  const { data: items } = await supabase
    .from('bio_items')
    .select('*')
    .eq('page_id', pageId)
    .order('position', { ascending: true })

  const bioItems: BioItem[] = items ?? []

  // Resolve plan limit from the bio page owner
  const { data: ownerUser } = await supabase
    .from('users')
    .select('plan')
    .eq('id', bioPage.user_id)
    .single()
  const planConfig = getPlanConfig(ownerUser?.plan)

  if (planConfig.bioChatLimitMonth === 0) {
    return Response.json(
      { error: 'O chat de recomendação não está disponível no seu plano atual.' },
      { status: 403 }
    )
  }

  const monthKey = currentMonthKey()

  // Load or create bio_chat row
  let { data: bioChat } = await supabase
    .from('bio_chats')
    .select('*')
    .eq('page_id', pageId)
    .eq('session_token', sessionToken)
    .single()

  if (!bioChat) {
    const { data: newChat } = await supabase
      .from('bio_chats')
      .insert({ page_id: pageId, session_token: sessionToken, messages: [], msg_count: 0, month_key: monthKey })
      .select()
      .single()
    bioChat = newChat
  } else if (bioChat.month_key !== monthKey) {
    // New billing month — reset counter
    const { data: resetChat } = await supabase
      .from('bio_chats')
      .update({ msg_count: 0, month_key: monthKey, messages: [] })
      .eq('id', bioChat.id)
      .select()
      .single()
    bioChat = resetChat
  }

  // Rate limit (plan-based, resets monthly)
  if (bioChat && bioChat.msg_count >= planConfig.bioChatLimitMonth) {
    return Response.json(
      { error: 'Limite de mensagens do mês atingido. Volte no próximo mês ou peça para a empreendedora fazer upgrade de plano.' },
      { status: 429 }
    )
  }

  const storedMessages: ChatMessage[] = bioChat?.messages ?? []

  // Take last 10 messages for context window
  const contextMessages = storedMessages.slice(-10)

  // Append new user message
  const conversationMessages: ChatMessage[] = [
    ...contextMessages,
    { role: 'user', content: trimmedMessage },
  ]

  const systemPrompt = buildSystemPrompt(bioPage as BioPage, bioItems)

  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  // Stream in background
  ;(async () => {
    let assistantReply = ''
    try {
      const stream = anthropic.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: systemPrompt,
        messages: conversationMessages,
      })
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          assistantReply += chunk.delta.text
          await writer.write(encoder.encode(chunk.delta.text))
        }
      }
    } catch (e) {
      console.error('Bio chat streaming error:', e)
    } finally {
      await writer.close()
    }

    // Fire-and-forget: save updated messages + increment msg_count
    ;(async () => {
      try {
        const updatedMessages: ChatMessage[] = [
          ...storedMessages,
          { role: 'user', content: trimmedMessage },
          { role: 'assistant', content: assistantReply },
        ]
        await supabase
          .from('bio_chats')
          .update({
            messages: updatedMessages,
            msg_count: (bioChat?.msg_count ?? 0) + 1,
          })
          .eq('page_id', pageId)
          .eq('session_token', sessionToken)
      } catch (e) {
        console.error('Bio chat save error:', e)
      }
    })()
  })()

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
