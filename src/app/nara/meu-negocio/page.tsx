import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import NaraHeader from '@/components/layout/NaraHeader'
import MeuNegocioClient from '@/components/nara/MeuNegocioClient'

export default async function MeuNegocioPage() {
  const { user, profile } = await requireAuth()

  const supabase = await createServerSupabaseClient()
  const { data: businessProfile } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen" style={{ background: 'var(--nara-bg)' }}>
      <NaraHeader userName={profile?.name} />
      <main className="max-w-xl mx-auto px-4 pt-8 pb-20">
        <div className="mb-8 animate-fade-up">
          <h1
            className="text-xl font-semibold mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
          >
            Meu Negócio
          </h1>
          <p style={{ color: 'var(--nara-muted)', fontSize: '14px' }}>
            Preencha uma vez. A Nara usa isso para personalizar todas as respostas.
          </p>
        </div>

        <MeuNegocioClient initialProfile={businessProfile ?? null} />
      </main>
    </div>
  )
}
