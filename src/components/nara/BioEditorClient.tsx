'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface BioPage {
  slug?: string | null
  title?: string | null
  whatsapp?: string | null
  published?: boolean | null
}

interface BioItem {
  id: string
  type: 'product' | 'link' | 'whatsapp'
  label?: string | null
  url?: string | null
  price?: string | null
}

interface Props {
  initialBio: BioPage | null
  initialItems: BioItem[]
}

async function getToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

function authHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const TYPE_LABELS: Record<string, string> = { product: 'Produto', link: 'Link', whatsapp: 'WhatsApp' }

export default function BioEditorClient({ initialBio, initialItems }: Props) {
  const [tab, setTab] = useState<'config' | 'items'>('config')
  const [bio, setBio] = useState<BioPage>({
    slug: initialBio?.slug ?? '',
    title: initialBio?.title ?? '',
    whatsapp: initialBio?.whatsapp ?? '',
    published: initialBio?.published ?? false,
  })
  const [items, setItems] = useState<BioItem[]>(initialItems)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [newItem, setNewItem] = useState({ type: 'link', label: '', url: '', price: '' })
  const [addingItem, setAddingItem] = useState(false)

  function handleBioChange(field: keyof BioPage, value: string | boolean) {
    setBio(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSaveConfig() {
    setSaving(true)
    setError('')
    try {
      const token = await getToken()
      const res = await fetch('/api/bio', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(bio),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar.')
      setSaved(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Algo deu errado.')
    } finally {
      setSaving(false)
    }
  }

  async function handleAddItem() {
    setAddingItem(true)
    setError('')
    try {
      const token = await getToken()
      const res = await fetch('/api/bio/items', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ ...newItem, position: items.length }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao adicionar.')
      setItems(prev => [...prev, data.item])
      setNewItem({ type: 'link', label: '', url: '', price: '' })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Algo deu errado.')
    } finally {
      setAddingItem(false)
    }
  }

  async function handleDeleteItem(id: string) {
    const token = await getToken()
    const res = await fetch('/api/bio/items', {
      method: 'DELETE',
      headers: authHeaders(token),
      body: JSON.stringify({ id }),
    })
    if (res.ok) setItems(prev => prev.filter(i => i.id !== id))
  }

  const inputStyle = {
    background: 'var(--nara-surface2)',
    border: '1px solid var(--nara-border)',
    color: 'var(--nara-text)',
  }

  const tabActive = { background: 'var(--nara-accent)', color: '#0F0E0D' }
  const tabInactive = { background: 'var(--nara-surface2)', color: 'var(--nara-muted)', border: '1px solid var(--nara-border)' }

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Tabs */}
      <div className="flex gap-2">
        {(['config', 'items'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={tab === t ? tabActive : tabInactive}
          >
            {t === 'config' ? 'Configurações' : 'Itens'}
          </button>
        ))}
      </div>

      {tab === 'config' && (
        <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}>
          {/* Slug */}
          <div>
            <label className="block text-xs mb-1 uppercase tracking-wider" style={{ color: 'var(--nara-muted)' }}>
              Endereço da sua página
            </label>
            <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--nara-border)' }}>
              <span className="px-3 py-3 text-xs whitespace-nowrap" style={{ background: 'var(--nara-bg)', color: 'var(--nara-muted)', borderRight: '1px solid var(--nara-border)' }}>
                rafaelbosi.com/p/
              </span>
              <input
                type="text"
                value={bio.slug ?? ''}
                onChange={e => handleBioChange('slug', e.target.value.toLowerCase())}
                placeholder="minha-loja"
                className="flex-1 px-3 py-3 text-sm outline-none"
                style={{ background: 'var(--nara-surface2)', color: 'var(--nara-text)' }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--nara-muted)' }}>Use letras minúsculas e hífens. Ex: carol-atelie</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs mb-1 uppercase tracking-wider" style={{ color: 'var(--nara-muted)' }}>Nome da página</label>
            <input type="text" value={bio.title ?? ''} onChange={e => handleBioChange('title', e.target.value)}
              placeholder="Ex: Ateliê da Carol" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs mb-1 uppercase tracking-wider" style={{ color: 'var(--nara-muted)' }}>WhatsApp</label>
            <input type="text" value={bio.whatsapp ?? ''} onChange={e => handleBioChange('whatsapp', e.target.value)}
              placeholder="Ex: 5511999999999 (só números, com DDI)" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--nara-text)' }}>Página publicada</span>
            <button
              onClick={() => handleBioChange('published', !bio.published)}
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ background: bio.published ? 'var(--nara-accent)' : 'var(--nara-surface2)', border: '1px solid var(--nara-border)' }}
            >
              <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ background: bio.published ? '#0F0E0D' : 'var(--nara-muted)', left: bio.published ? '24px' : '2px' }} />
            </button>
          </div>

          {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(217,112,102,0.12)', color: 'var(--nara-error)' }}>{error}</div>}

          <button onClick={handleSaveConfig} disabled={saving} className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: saved ? 'rgba(109,175,122,0.2)' : saving ? 'var(--nara-border)' : 'var(--nara-accent)', color: saved ? 'var(--nara-success)' : saving ? 'var(--nara-muted)' : '#0F0E0D', cursor: saving ? 'not-allowed' : 'pointer', border: saved ? '1px solid var(--nara-success)' : 'none' }}>
            {saved ? '✓ Configurações salvas!' : saving ? 'Salvando...' : 'Salvar configurações'}
          </button>
        </div>
      )}

      {tab === 'items' && (
        <div className="flex flex-col gap-3">
          {items.length > 0 && (
            <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}>
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2 py-2" style={{ borderBottom: '1px solid var(--nara-border)' }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded text-xs font-medium shrink-0" style={
                      item.type === 'product' ? { background: 'rgba(200,146,74,0.15)', color: 'var(--nara-accent)' }
                      : item.type === 'whatsapp' ? { background: 'rgba(109,175,122,0.15)', color: 'var(--nara-success)' }
                      : { background: 'var(--nara-surface2)', color: 'var(--nara-muted)', border: '1px solid var(--nara-border)' }
                    }>{TYPE_LABELS[item.type]}</span>
                    <span className="text-sm truncate" style={{ color: 'var(--nara-text)' }}>{item.label}</span>
                  </div>
                  <button onClick={() => handleDeleteItem(item.id)} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--nara-error)', background: 'rgba(217,112,102,0.08)' }}>Remover</button>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}>
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--nara-muted)' }}>Adicionar item</p>
            <select value={newItem.type} onChange={e => setNewItem(p => ({ ...p, type: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="link">Link</option>
              <option value="product">Produto</option>
              <option value="whatsapp">Botão WhatsApp</option>
            </select>
            <input type="text" value={newItem.label} onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))}
              placeholder="Nome exibido na página" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
            {newItem.type !== 'whatsapp' && (
              <input type="text" value={newItem.url} onChange={e => setNewItem(p => ({ ...p, url: e.target.value }))}
                placeholder="URL do link" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
            )}
            {newItem.type === 'product' && (
              <input type="text" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))}
                placeholder="Preço (opcional, ex: R$150)" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
            )}
            {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(217,112,102,0.12)', color: 'var(--nara-error)' }}>{error}</div>}
            <button onClick={handleAddItem} disabled={addingItem || !newItem.label}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: addingItem ? 'var(--nara-border)' : 'var(--nara-accent)', color: addingItem ? 'var(--nara-muted)' : '#0F0E0D', cursor: (addingItem || !newItem.label) ? 'not-allowed' : 'pointer' }}>
              {addingItem ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </div>
      )}

      {bio.slug && bio.published && (
        <a href={`/p/${bio.slug}`} target="_blank" rel="noreferrer"
          className="text-sm text-center py-2"
          style={{ color: 'var(--nara-accent)' }}>
          → Ver minha página
        </a>
      )}
    </div>
  )
}
