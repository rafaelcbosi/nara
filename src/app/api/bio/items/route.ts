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

const VALID_TYPES = ['product', 'link', 'whatsapp']

export async function GET(req: NextRequest) {
  const { client, user } = await getAuthClient(req)
  if (!user) return Response.json({ error: 'Não autorizado.' }, { status: 401 })

  const { data: page } = await client
    .from('bio_pages')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!page) return Response.json({ items: [] })

  const { data } = await client
    .from('bio_items')
    .select('*')
    .eq('page_id', page.id)
    .order('position', { ascending: true })

  return Response.json({ items: data ?? [] })
}

export async function POST(req: NextRequest) {
  const { client, user } = await getAuthClient(req)
  if (!user) return Response.json({ error: 'Não autorizado.' }, { status: 401 })

  const body = await req.json()
  const { type, label, url, image_url, price, position } = body

  if (!VALID_TYPES.includes(type)) {
    return Response.json({ error: 'Tipo inválido.' }, { status: 400 })
  }

  const { data: page } = await client
    .from('bio_pages')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!page) return Response.json({ error: 'Página não encontrada. Salve as configurações primeiro.' }, { status: 404 })

  const { data, error } = await client
    .from('bio_items')
    .insert({ page_id: page.id, type, label, url, image_url, price, position })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ item: data })
}

export async function DELETE(req: NextRequest) {
  const { client, user } = await getAuthClient(req)
  if (!user) return Response.json({ error: 'Não autorizado.' }, { status: 401 })

  const body = await req.json()
  const { id } = body

  const { data: page } = await client
    .from('bio_pages')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!page) return Response.json({ error: 'Página não encontrada.' }, { status: 404 })

  // Verify item belongs to this user's page
  const { data: item } = await client
    .from('bio_items')
    .select('id')
    .eq('id', id)
    .eq('page_id', page.id)
    .single()

  if (!item) return Response.json({ error: 'Item não encontrado.' }, { status: 404 })

  const { error } = await client.from('bio_items').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true })
}
