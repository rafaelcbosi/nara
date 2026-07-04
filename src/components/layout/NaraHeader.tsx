'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

interface NaraHeaderProps {
  userName?: string
}

export default function NaraHeader({ userName }: NaraHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/nara/login')
    router.refresh()
  }

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
      style={{
        background: 'rgba(15,14,13,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--nara-border)',
      }}
    >
      <Link
        href="/nara/dashboard"
        className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
        style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
      >
        Nara
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/nara/meu-negocio"
          className="text-xs transition-opacity hover:opacity-80 hidden sm:block"
          style={{ color: 'var(--nara-muted)' }}
        >
          Meu Negócio
        </Link>
        <Link
          href="/nara/bio"
          className="text-xs transition-opacity hover:opacity-80 hidden sm:block"
          style={{ color: 'var(--nara-muted)' }}
        >
          Minha Bio
        </Link>
        <Link
          href="/nara/ajuda"
          className="text-xs transition-opacity hover:opacity-80 hidden sm:block"
          style={{ color: 'var(--nara-muted)' }}
        >
          Ajuda
        </Link>
        {userName && (
          <Link
            href="/nara/perfil"
            className="text-sm transition-opacity hover:opacity-80 hidden sm:block"
            style={{ color: 'var(--nara-muted)' }}
          >
            {userName}
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{
            background: 'var(--nara-surface)',
            border: '1px solid var(--nara-border)',
            color: 'var(--nara-muted)',
            cursor: 'pointer',
          }}
        >
          Sair
        </button>
      </div>
    </header>
  )
}
