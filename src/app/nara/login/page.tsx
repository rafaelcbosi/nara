'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-mail ou senha incorretos. Verifique e tente novamente.')
      setLoading(false)
      return
    }

    router.push('/nara/dashboard')
    router.refresh()
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/nara/nova-senha`,
    })

    if (error) {
      setError('Não foi possível enviar o e-mail. Verifique o endereço.')
    } else {
      setResetSent(true)
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--nara-bg)' }}
    >
      <div className="w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold tracking-tight mb-2"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
          >
            Nara
          </h1>
          <p style={{ color: 'var(--nara-muted)', fontSize: '14px' }}>
            Consultora de Negócios IA
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}
        >
          {!showReset ? (
            <>
              <h2
                className="text-lg font-semibold mb-6"
                style={{ color: 'var(--nara-text)' }}
              >
                Entrar na sua conta
              </h2>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--nara-muted)' }}>
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'var(--nara-surface2)',
                      border: '1px solid var(--nara-border)',
                      color: 'var(--nara-text)',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--nara-accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--nara-border)')}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--nara-muted)' }}>
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'var(--nara-surface2)',
                      border: '1px solid var(--nara-border)',
                      color: 'var(--nara-text)',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--nara-accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--nara-border)')}
                  />
                </div>

                {error && (
                  <p className="text-sm" style={{ color: 'var(--nara-error)' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all mt-2"
                  style={{
                    background: loading ? 'var(--nara-border)' : 'var(--nara-accent)',
                    color: loading ? 'var(--nara-muted)' : '#0F0E0D',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <button
                onClick={() => setShowReset(true)}
                className="w-full text-center text-sm mt-4 transition-opacity hover:opacity-80"
                style={{ color: 'var(--nara-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Esqueci minha senha
              </button>
            </>
          ) : (
            <>
              <h2
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--nara-text)' }}
              >
                Recuperar senha
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--nara-muted)' }}>
                Informe seu e-mail e enviaremos um link para criar uma nova senha.
              </p>

              {resetSent ? (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: 'rgba(109,175,122,0.12)', color: 'var(--nara-success)' }}
                >
                  E-mail enviado! Verifique sua caixa de entrada.
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: 'var(--nara-surface2)',
                      border: '1px solid var(--nara-border)',
                      color: 'var(--nara-text)',
                    }}
                  />
                  {error && <p className="text-sm" style={{ color: 'var(--nara-error)' }}>{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'var(--nara-accent)', color: '#0F0E0D', cursor: 'pointer' }}
                  >
                    {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                  </button>
                </form>
              )}

              <button
                onClick={() => { setShowReset(false); setResetSent(false); setError('') }}
                className="w-full text-center text-sm mt-4 transition-opacity hover:opacity-80"
                style={{ color: 'var(--nara-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Voltar para o login
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--nara-muted)' }}>
          Acesso exclusivo para assinantes Nara
        </p>
      </div>
    </div>
  )
}
