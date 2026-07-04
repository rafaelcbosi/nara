import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import NaraHeader from '@/components/layout/NaraHeader'
import BioEditorClient from '@/components/nara/BioEditorClient'

export default async function BioPage() {
  const { user, profile } = await requireAuth()

  const supabase = await createServerSupabaseClient()

  const { data: bioPage } = await supabase
    .from('bio_pages')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: bioItems } = bioPage
    ? await supabase
        .from('bio_items')
        .select('*')
        .eq('page_id', bioPage.id)
        .order('position', { ascending: true })
    : { data: [] }

  return (
    <div className="min-h-screen" style={{ background: 'var(--nara-bg)' }}>
      <NaraHeader userName={profile?.name} />
      <main className="max-w-xl mx-auto px-4 pt-8 pb-20">
        <div className="mb-8 animate-fade-up">
          <h1
            className="text-xl font-semibold mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
          >
            Minha Página Bio
          </h1>
          <p style={{ color: 'var(--nara-muted)', fontSize: '14px' }}>
            Crie sua página com links, produtos e botão de WhatsApp.
          </p>
        </div>

        <BioEditorClient initialBio={bioPage ?? null} initialItems={bioItems ?? []} />
      </main>
    </div>
  )
}
