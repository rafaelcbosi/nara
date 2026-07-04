import { requireAuth } from '@/lib/auth'
import { categorias } from '@/data/categorias'
import NaraHeader from '@/components/layout/NaraHeader'
import Link from 'next/link'

export default async function DashboardPage() {
  const { profile } = await requireAuth()
  const firstName = profile?.name?.split(' ')[0] || 'você'

  return (
    <div className="min-h-screen" style={{ background: 'var(--nara-bg)' }}>
      <NaraHeader userName={profile?.name} />

      <main className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        {/* Greeting */}
        <div className="mb-8 animate-fade-up">
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
          >
            Oi {firstName},
          </h1>
          <p style={{ color: 'var(--nara-muted)', fontSize: '15px' }}>
            o que vamos resolver hoje?
          </p>
        </div>

        {/* Category grid */}
        <div className="flex flex-col gap-3">
          {categorias.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/nara/categoria/${cat.slug}`}
              className="group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all"
              style={{
                background: 'var(--nara-surface)',
                border: '1px solid var(--nara-border)',
                animationDelay: `${i * 60}ms`,
              }}
            >
              <span className="text-2xl flex-shrink-0">{cat.icone}</span>
              <div className="flex-1 min-w-0">
                <div
                  className="font-semibold text-sm mb-0.5 group-hover:opacity-90"
                  style={{ color: 'var(--nara-text)' }}
                >
                  {cat.nome}
                </div>
                <div className="text-xs truncate" style={{ color: 'var(--nara-muted)' }}>
                  {cat.descricao}
                </div>
              </div>
              <span className="text-lg flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: 'var(--nara-accent)' }}>
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-10" style={{ color: 'var(--nara-muted)' }}>
          25 ferramentas disponíveis · respostas em segundos
        </p>
      </main>
    </div>
  )
}
