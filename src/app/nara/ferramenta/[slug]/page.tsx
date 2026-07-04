import { requireAuth } from '@/lib/auth'
import { getFerramentaGlobal } from '@/data/categorias'
import NaraHeader from '@/components/layout/NaraHeader'
import FerramentaClient from '@/components/nara/FerramentaClient'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function FerramentaPage({ params }: Props) {
  const { slug } = await params
  const { profile } = await requireAuth()
  const found = getFerramentaGlobal(slug)

  if (!found) notFound()

  return (
    <div style={{ background: 'var(--nara-bg)' }}>
      <NaraHeader userName={profile?.name} />
      <FerramentaClient ferramenta={found.ferramenta} categoria={found.categoria} />
    </div>
  )
}
