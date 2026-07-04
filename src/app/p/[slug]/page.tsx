import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import BioChat from '@/components/bio/BioChat'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('bio_pages').select('title').eq('slug', slug).eq('published', true).single()
  if (!data) return {}
  return {
    title: data.title,
    description: `Conheça os produtos e serviços de ${data.title}`,
  }
}

export default async function BioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: bioPage } = await supabase
    .from('bio_pages')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!bioPage) notFound()

  const { data: items } = await supabase
    .from('bio_items')
    .select('*')
    .eq('page_id', bioPage.id)
    .order('position', { ascending: true })

  const cardStyle: React.CSSProperties = {
    background: 'var(--nara-surface)',
    border: '1px solid var(--nara-border)',
    borderRadius: '1rem',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    transition: 'opacity 0.15s',
    textDecoration: 'none',
    color: 'inherit',
  }

  return (
    <div style={{ maxWidth: '384px', margin: '0 auto', padding: '2.5rem 1rem 4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--nara-accent)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 0.75rem',
        }}>
          {bioPage.title?.[0]?.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--nara-soft)', fontSize: '1.25rem', margin: '0 0 0.25rem' }}>
          {bioPage.title}
        </h1>
        <a href="/nara/login" style={{ color: 'var(--nara-muted)', fontSize: '0.75rem', textDecoration: 'none' }}>
          Powered by Nara
        </a>
      </div>

      {/* WhatsApp global */}
      {bioPage.whatsapp && (
        <a href={`https://wa.me/${bioPage.whatsapp}`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', background: '#25D366', color: 'white', borderRadius: '1rem', padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginBottom: '1.5rem' }}>
          💬 Falar no WhatsApp
        </a>
      )}

      {/* Items */}
      {(items ?? []).map((item: Record<string, string>) => {
        if (item.type === 'whatsapp') {
          return (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', background: '#25D366', color: 'white', borderRadius: '1rem', padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginBottom: '0.75rem' }}>
              💬 {item.label}
            </a>
          )
        }
        if (item.type === 'product') {
          return (
            <a key={item.id} href={item.url || '#'} style={cardStyle}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--nara-text)' }}>{item.label}</div>
                {item.price && <div style={{ color: 'var(--nara-muted)', fontSize: '0.875rem', marginTop: '0.125rem' }}>{item.price}</div>}
              </div>
              <span style={{ color: 'var(--nara-muted)' }}>→</span>
            </a>
          )
        }
        return (
          <a key={item.id} href={item.url || '#'} style={{ ...cardStyle, justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--nara-text)' }}>{item.label}</span>
            <span style={{ color: 'var(--nara-muted)' }}>→</span>
          </a>
        )
      })}

      <BioChat pageId={bioPage.id} businessName={bioPage.title ?? slug} />
    </div>
  )
}
