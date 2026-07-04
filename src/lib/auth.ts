import { createServerSupabaseClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/nara/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.subscription_status !== 'active') {
    redirect('/nara/acesso-bloqueado')
  }

  return { user, profile }
}
