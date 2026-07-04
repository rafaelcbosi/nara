import { requireAuth } from '@/lib/auth'
import { getCategoriaBySlug } from '@/data/categorias'
import NaraHeader from '@/components/layout/NaraHeader'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params
  const { profile } = await requireAuth()
  const categoria = getCategoriaBySlug(slug)

  if (!categoria) notFound()

  return (
    <div className="min-h-screen" style={{ background: 'var(--nara-bg)' }}>
      <NaraHeader userName={profile?.name} />

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--nara-muted)' }}>
          <Link href="/nara/dashboard" className="hover:opacity-80 transition-opacity">
            Início
          </Link>
          <span>›</span>
          <span style={{ color: 'var(--nara-text)' }}>{categoria.nome}</span>
        </div>

        {/* Category header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{categoria.icone}</span>
            <h1
              className="text-2xl font-semibold"
              style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
            >
              {categoria.nome}
            </h1>
          </div>
          <p style={{ color: 'var(--nara-muted)', fontSize: '14px' }}>
            {categoria.descricao}
          </p>
        </div>

        {/* Tools list */}
        <div className="flex flex-col gap-3">
          {categoria.ferramentas.map((ferramenta, i) => (
            <Link
              key={ferramenta.slug}
              href={`/nara/ferramenta/${ferramenta.slug}`}
              className="group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all"
              style={{
                background: 'var(--nara-surface)',
                border: '1px solid var(--nara-border)',
                animationDelay: `${i * 50}ms`,
              }}
            >
              <div className="flex-1 min-w-0">
                <div
                  className="font-semibold text-sm mb-0.5"
                  style={{ color: 'var(--nara-text)' }}
                >
                  {ferramenta.nome}
                </div>
                <div className="text-xs" style={{ color: 'var(--nara-muted)' }}>
                  {ferramenta.descricao}
                </div>
              </div>
              <span
                className="text-lg flex-shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: 'var(--nara-accent)' }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
