export default function AcessoBloqueadoPage() {
  const kiwifyUrl = process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL || '#'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--nara-bg)' }}
    >
      <div className="w-full max-w-sm text-center animate-fade-up">
        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
        >
          Nara
        </h1>

        <div
          className="rounded-2xl p-8 mb-6"
          style={{ background: 'var(--nara-surface)', border: '1px solid var(--nara-border)' }}
        >
          <div className="text-3xl mb-4">🔒</div>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: 'var(--nara-text)' }}
          >
            Acesso suspenso
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--nara-muted)' }}>
            Sua assinatura está inativa. Para voltar a usar a Nara, renove sua assinatura abaixo.
          </p>
        </div>

        <a
          href={kiwifyUrl}
          className="block w-full py-3.5 rounded-xl text-sm font-semibold text-center transition-all hover:opacity-90"
          style={{ background: 'var(--nara-accent)', color: '#0F0E0D' }}
        >
          Renovar assinatura
        </a>

        <a
          href="/nara/login"
          className="block text-xs mt-4 transition-opacity hover:opacity-80"
          style={{ color: 'var(--nara-muted)' }}
        >
          Voltar ao login
        </a>
      </div>
    </div>
  )
}
