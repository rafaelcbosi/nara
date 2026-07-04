import { requireAuth } from '@/lib/auth'
import NaraHeader from '@/components/layout/NaraHeader'
import Link from 'next/link'

export default async function PerfilPage() {
  const { user, profile } = await requireAuth()
  const kiwifyUrl = process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL || '#'

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="min-h-screen" style={{ background: 'var(--nara-bg)' }}>
      <NaraHeader userName={profile?.name} />

      <main className="max-w-xl mx-auto px-4 pt-6 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--nara-muted)' }}>
          <Link href="/nara/dashboard" className="hover:opacity-80">Início</Link>
          <span>›</span>
          <span style={{ color: 'var(--nara-text)' }}>Perfil</span>
        </div>

        <h1
          className="text-xl font-semibold mb-6"
          style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
        >
          Minha conta
        </h1>

        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--nara-muted)' }}>Nome</div>
              <div className="text-sm" style={{ color: 'var(--nara-text)' }}>{profile?.name || '—'}</div>
            </div>
            <div style={{ borderTop: '1px solid var(--nara-border)', paddingTop: '1rem' }}>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--nara-muted)' }}>E-mail</div>
              <div className="text-sm" style={{ color: 'var(--nara-text)' }}>{user.email}</div>
            </div>
            <div style={{ borderTop: '1px solid var(--nara-border)', paddingTop: '1rem' }}>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--nara-muted)' }}>Assinante desde</div>
              <div className="text-sm" style={{ color: 'var(--nara-text)' }}>{memberSince}</div>
            </div>
            <div style={{ borderTop: '1px solid var(--nara-border)', paddingTop: '1rem' }}>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--nara-muted)' }}>Status</div>
              <div
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(109,175,122,0.15)', color: 'var(--nara-success)' }}
              >
                <span>●</span> Ativo
              </div>
            </div>
          </div>
        </div>

        <a
          href={kiwifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-5 py-4 rounded-2xl transition-all hover:opacity-80"
          style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}
        >
          <span className="text-sm" style={{ color: 'var(--nara-text)' }}>Gerenciar assinatura</span>
          <span style={{ color: 'var(--nara-accent)' }}>→</span>
        </a>
      </main>
    </div>
  )
}
