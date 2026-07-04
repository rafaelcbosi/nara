'use client'

import { useState } from 'react'
import type { Ferramenta, Categoria } from '@/data/categorias'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface Props {
  ferramenta: Ferramenta
  categoria: Categoria
}

export default function FerramentaClient({ ferramenta, categoria }: Props) {
  const [campos, setCampos] = useState<Record<string, string>>({})
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function handleChange(id: string, value: string) {
    setCampos(prev => ({ ...prev, [id]: value }))
  }

  async function handleGenerate() {
    setError('')
    setOutput('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ferramentaSlug: ferramenta.slug, campos }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao gerar resposta.')
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('Sem resposta do servidor.')

      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value, { stream: true })
        setOutput(result)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Algo deu errado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const allFilled = ferramenta.campos.every(c => (campos[c.id] || '').trim().length > 0)

  return (
    <div className="min-h-screen" style={{ background: 'var(--nara-bg)' }}>
      <main className="max-w-xl mx-auto px-4 pt-6 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--nara-muted)' }}>
          <Link href="/nara/dashboard" className="hover:opacity-80">Início</Link>
          <span>›</span>
          <Link href={`/nara/categoria/${categoria.slug}`} className="hover:opacity-80">{categoria.nome}</Link>
          <span>›</span>
          <span style={{ color: 'var(--nara-text)' }}>{ferramenta.nome}</span>
        </div>

        {/* Header */}
        <div className="mb-7 animate-fade-up">
          <h1
            className="text-xl font-semibold mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
          >
            {ferramenta.nome}
          </h1>
          <p style={{ color: 'var(--nara-muted)', fontSize: '13px' }}>
            {ferramenta.descricao}
          </p>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}
        >
          <div className="flex flex-col gap-5">
            {ferramenta.campos.map(campo => (
              <div key={campo.id}>
                <label
                  className="block text-xs mb-2 uppercase tracking-wider"
                  style={{ color: 'var(--nara-muted)' }}
                >
                  {campo.label}
                </label>

                {campo.tipo === 'select' ? (
                  <select
                    value={campos[campo.id] || ''}
                    onChange={e => handleChange(campo.id, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none"
                    style={{
                      background: 'var(--nara-surface2)',
                      border: '1px solid var(--nara-border)',
                      color: campos[campo.id] ? 'var(--nara-text)' : 'var(--nara-muted)',
                    }}
                  >
                    <option value="">Selecione...</option>
                    {campo.opcoes?.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                ) : campo.tipo === 'textarea' ? (
                  <textarea
                    value={campos[campo.id] || ''}
                    onChange={e => handleChange(campo.id, e.target.value)}
                    placeholder={campo.placeholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    style={{
                      background: 'var(--nara-surface2)',
                      border: '1px solid var(--nara-border)',
                      color: 'var(--nara-text)',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--nara-accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--nara-border)')}
                  />
                ) : (
                  <input
                    type="text"
                    value={campos[campo.id] || ''}
                    onChange={e => handleChange(campo.id, e.target.value)}
                    placeholder={campo.placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: 'var(--nara-surface2)',
                      border: '1px solid var(--nara-border)',
                      color: 'var(--nara-text)',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--nara-accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--nara-border)')}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !allFilled}
            className="w-full py-3.5 rounded-xl text-sm font-semibold mt-5 transition-all"
            style={{
              background: loading || !allFilled ? 'var(--nara-border)' : 'var(--nara-accent)',
              color: loading || !allFilled ? 'var(--nara-muted)' : '#0F0E0D',
              cursor: loading || !allFilled ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Nara está gerando...' : 'Gerar com Nara'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm mb-4"
            style={{ background: 'rgba(217,112,102,0.12)', color: 'var(--nara-error)' }}
          >
            {error}
          </div>
        )}

        {/* Output */}
        {(output || loading) && (
          <div
            className="rounded-2xl p-5 animate-fade-up"
            style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}
          >
            <div
              className="flex items-center gap-2 mb-4 pb-3"
              style={{ borderBottom: '1px solid var(--nara-border)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--nara-accent)', color: '#0F0E0D' }}
              >
                N
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--nara-accent)' }}>
                Nara
              </span>
            </div>

            <div
              className={`text-sm leading-relaxed whitespace-pre-wrap font-mono ${loading && !output ? 'cursor-blink' : ''}`}
              style={{
                color: 'var(--nara-text)',
                fontFamily: 'DM Mono, monospace',
                fontSize: '13px',
              }}
            >
              {output || ' '}
              {loading && output && <span className="cursor-blink" />}
            </div>

            {!loading && output && (
              <div className="flex gap-2 mt-5 pt-4" style={{ borderTop: '1px solid var(--nara-border)' }}>
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: copied ? 'rgba(109,175,122,0.15)' : 'var(--nara-surface2)',
                    border: '1px solid var(--nara-border)',
                    color: copied ? 'var(--nara-success)' : 'var(--nara-text)',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? '✓ Copiado!' : 'Copiar texto'}
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--nara-border)',
                    color: 'var(--nara-muted)',
                    cursor: 'pointer',
                  }}
                >
                  Gerar novamente
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
