'use client'

import { useEffect, useRef, useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface BioChatProps {
  pageId: string
  businessName: string
}

export default function BioChat({ pageId, businessName }: BioChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionToken, setSessionToken] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get or create sessionToken from localStorage
  useEffect(() => {
    const key = `nara-bio-chat-${pageId}`
    let token = localStorage.getItem(key)
    if (!token) {
      token = crypto.randomUUID()
      localStorage.setItem(key, token)
    }
    setSessionToken(token)
  }, [pageId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Show initial greeting when chat opens for the first time
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Olá! Sou a assistente de ${businessName}. Como posso te ajudar hoje?`,
        },
      ])
    }
  }, [open, messages.length, businessName])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/bio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, sessionToken, message: text }),
      })

      if (res.status === 429) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Você atingiu o limite de mensagens desta sessão.',
          },
        ])
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao obter resposta.')
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('Sem resposta do servidor.')

      // Add empty assistant message to fill progressively
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: result }
          return updated
        })
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: e instanceof Error ? e.message : 'Algo deu errado. Tente novamente.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating button — always visible */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            backgroundColor: 'var(--nara-accent)',
            color: '#0F0E0D',
            borderRadius: '9999px',
            padding: '0.625rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 50,
          }}
        >
          💬 Assistente
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '70vh',
            backgroundColor: 'var(--nara-bg)',
            borderTop: '1px solid var(--nara-border)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--nara-border)',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: 'var(--nara-soft)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Assistente de {businessName}
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                color: 'var(--nara-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.125rem',
                lineHeight: 1,
                padding: '0.25rem',
              }}
              aria-label="Fechar chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    borderRadius: '1rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.4',
                    backgroundColor:
                      msg.role === 'user'
                        ? 'var(--nara-accent)'
                        : 'var(--nara-surface)',
                    color:
                      msg.role === 'user' ? '#0F0E0D' : 'var(--nara-text)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    backgroundColor: 'var(--nara-surface)',
                    color: 'var(--nara-muted)',
                    borderRadius: '1rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                  }}
                >
                  ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--nara-border)',
              flexShrink: 0,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Digite sua mensagem..."
              style={{
                flex: 1,
                backgroundColor: 'var(--nara-surface2)',
                border: '1px solid var(--nara-border)',
                borderRadius: '0.75rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: 'var(--nara-text)',
                outline: 'none',
                opacity: loading ? 0.6 : 1,
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: 'var(--nara-accent)',
                color: '#0F0E0D',
                borderRadius: '0.75rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
