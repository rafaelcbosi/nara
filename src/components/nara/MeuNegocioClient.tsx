'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface BusinessProfile {
  niche?: string | null
  product?: string | null
  audience?: string | null
  avg_ticket?: string | null
  voice_tone?: string | null
}

interface Props {
  initialProfile: BusinessProfile | null
}

const VOICE_TONES = [
  'Próximo e acolhedor',
  'Profissional e direto',
  'Descontraído e divertido',
  'Elegante e sofisticado',
  'Inspirador e motivacional',
]

export default function MeuNegocioClient({ initialProfile }: Props) {
  const [form, setForm] = useState<BusinessProfile>({
    niche: initialProfile?.niche ?? '',
    product: initialProfile?.product ?? '',
    audience: initialProfile?.audience ?? '',
    avg_ticket: initialProfile?.avg_ticket ?? '',
    voice_tone: initialProfile?.voice_tone ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleChange(field: keyof BusinessProfile, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao salvar.')
      }

      setSaved(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Algo deu errado.')
    } finally {
      setSaving(false)
    }
  }

  const isEmpty = !initialProfile

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {isEmpty && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(200,146,74,0.1)', border: '1px solid rgba(200,146,74,0.25)', color: 'var(--nara-soft)' }}
        >
          Você ainda não preencheu seu perfil. Pode pular e completar depois — mas quanto mais a Nara souber, melhor ela responde.
        </div>
      )}

      <div
        className="rounded-2xl p-5 flex flex-col gap-5"
        style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}
      >
        <Field
          label="Qual é o seu negócio?"
          hint="Ex: vendo bolos artesanais, sou consultora de imagem, tenho uma loja virtual de roupas"
          value={form.niche ?? ''}
          onChange={v => handleChange('niche', v)}
        />
        <Field
          label="O que você vende?"
          hint="Ex: bolos personalizados, assessoria presencial, camisetas femininas tamanho único"
          value={form.product ?? ''}
          onChange={v => handleChange('product', v)}
        />
        <Field
          label="Para quem você vende?"
          hint="Ex: mães de 30-45 anos, empresas de médio porte, estudantes universitárias"
          value={form.audience ?? ''}
          onChange={v => handleChange('audience', v)}
        />
        <Field
          label="Qual o seu preço médio?"
          hint="Ex: R$150, R$80 a R$300, R$1.200 por projeto"
          value={form.avg_ticket ?? ''}
          onChange={v => handleChange('avg_ticket', v)}
        />

        <div>
          <label className="block text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--nara-muted)' }}>
            Tom de comunicação
          </label>
          <div className="flex flex-wrap gap-2">
            {VOICE_TONES.map(tone => {
              const active = form.voice_tone === tone
              return (
                <button
                  key={tone}
                  onClick={() => handleChange('voice_tone', active ? '' : tone)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: active ? 'var(--nara-accent)' : 'var(--nara-surface2)',
                    border: `1px solid ${active ? 'var(--nara-accent)' : 'var(--nara-border)'}`,
                    color: active ? '#0F0E0D' : 'var(--nara-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {tone}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(217,112,102,0.12)', color: 'var(--nara-error)' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: saved ? 'rgba(109,175,122,0.2)' : saving ? 'var(--nara-border)' : 'var(--nara-accent)',
          color: saved ? 'var(--nara-success)' : saving ? 'var(--nara-muted)' : '#0F0E0D',
          cursor: saving ? 'not-allowed' : 'pointer',
          border: saved ? '1px solid var(--nara-success)' : 'none',
        }}
      >
        {saved ? '✓ Perfil salvo!' : saving ? 'Salvando...' : 'Salvar perfil'}
      </button>

      <p className="text-xs text-center" style={{ color: 'var(--nara-muted)' }}>
        Você pode editar isso a qualquer momento. Nenhum campo é obrigatório.
      </p>
    </div>
  )
}

function Field({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs mb-1 uppercase tracking-wider" style={{ color: 'var(--nara-muted)' }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={hint}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
        style={{
          background: 'var(--nara-surface2)',
          border: '1px solid var(--nara-border)',
          color: 'var(--nara-text)',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--nara-accent)')}
        onBlur={e => (e.target.style.borderColor = 'var(--nara-border)')}
      />
    </div>
  )
}
