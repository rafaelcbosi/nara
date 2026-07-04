import { NextRequest } from 'next/server'
import { createServerSupabaseClient, createBearerSupabaseClient } from '@/lib/supabase-server'

async function getAuthClient(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const client = await createBearerSupabaseClient(token)
    const { data } = await client.auth.getUser()
    return { client, user: data.user }
  }
  const client = await createServerSupabaseClient()
  const { data } = await client.auth.getUser()
  return { client, user: data.user }
}

export async function GET(req: NextRequest) {
  const { client, user } = await getAuthClient(req)
  if (!user) return Response.json({ error: 'Não autorizado.' }, { status: 401 })

  const { data } = await client
    .from('business_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return Response.json({ profile: data ?? null })
}

export async function POST(req: NextRequest) {
  const { client, user } = await getAuthClient(req)
  if (!user) return Response.json({ error: 'Não autorizado.' }, { status: 401 })

  const body = await req.json()
  const { niche, product, audience, avg_ticket, voice_tone } = body

  const { data, error } = await client
    .from('business_profiles')
    .upsert(
      { user_id: user.id, niche, product, audience, avg_ticket, voice_tone, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ profile: data })
}
