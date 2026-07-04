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

const SLUG_RE = /^[a-z0-9-]{3,30}$/

export async function GET(req: NextRequest) {
  const { client, user } = await getAuthClient(req)
  if (!user) return Response.json({ error: 'Não autorizado.' }, { status: 401 })

  const { data } = await client
    .from('bio_pages')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return Response.json({ bio: data ?? null })
}

export async function POST(req: NextRequest) {
  const { client, user } = await getAuthClient(req)
  if (!user) return Response.json({ error: 'Não autorizado.' }, { status: 401 })

  const body = await req.json()
  const { slug, title, whatsapp, published } = body

  if (!SLUG_RE.test(slug)) {
    return Response.json(
      { error: 'Endereço inválido. Use letras minúsculas, números e hífens (3–30 caracteres).' },
      { status: 400 }
    )
  }

  // Check slug conflict with another user
  const { data: existing } = await client
    .from('bio_pages')
    .select('user_id')
    .eq('slug', slug)
    .single()

  if (existing && existing.user_id !== user.id) {
    return Response.json({ error: 'Esse endereço já está em uso.' }, { status: 409 })
  }

  const { data, error } = await client
    .from('bio_pages')
    .upsert(
      { user_id: user.id, slug, title, whatsapp, published, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ bio: data })
}
