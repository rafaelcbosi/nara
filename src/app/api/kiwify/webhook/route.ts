import { NextRequest } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase-server'
import { resolvePlan } from '@/lib/plans'
import crypto from 'crypto'

function verifyKiwifySignature(body: string, signature: string | null): boolean {
  if (!process.env.KIWIFY_WEBHOOK_SECRET || !signature) return false
  const expected = crypto
    .createHmac('sha256', process.env.KIWIFY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-kiwify-signature')

  if (!verifyKiwifySignature(rawBody, signature)) {
    return Response.json({ error: 'Assinatura inválida.' }, { status: 401 })
  }

  let payload: {
    event: string
    data: {
      customer: { name: string; email: string }
      subscription?: { id: string; status: string }
      product?: { id: string; name?: string }
    }
  }
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return Response.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const { event, data } = payload
  const { customer, subscription, product } = data
  const supabase = await createServiceSupabaseClient()

  const activeEvents = ['order_approved', 'subscription_reactivated']
  const inactiveEvents = ['order_refunded', 'subscription_canceled']

  if (activeEvents.includes(event)) {
    await supabase.from('users').upsert({
      email: customer.email,
      name: customer.name,
      kiwify_subscription_id: subscription?.id,
      subscription_status: 'active',
      plan: resolvePlan(product?.id),
    }, { onConflict: 'email' })
  } else if (inactiveEvents.includes(event)) {
    await supabase
      .from('users')
      .update({ subscription_status: event === 'order_refunded' ? 'refunded' : 'canceled' })
      .eq('email', customer.email)
  }

  return Response.json({ ok: true })
}
