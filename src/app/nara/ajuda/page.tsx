import { requireAuth } from '@/lib/auth'
import NaraHeader from '@/components/layout/NaraHeader'
import Link from 'next/link'

export default async function AjudaPage() {
  const { profile } = await requireAuth()

  return (
    <div className="min-h-screen" style={{ background: 'var(--nara-bg)' }}>
      <NaraHeader userName={profile?.name} />

      <main className="max-w-xl mx-auto px-4 pt-8 pb-16">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <h1
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--nara-soft)' }}
          >
            Como usar a Nara
          </h1>
          <p style={{ color: 'var(--nara-muted)', fontSize: '15px' }}>
            Tudo que você precisa saber para aproveitar ao máximo
          </p>
        </div>

        {/* Section 1 — Como funciona */}
        <section className="mb-10 animate-fade-up">
          <p
            className="uppercase tracking-wider mb-3"
            style={{ fontSize: '12px', color: 'var(--nara-muted)' }}
          >
            Como funciona
          </p>

          <div className="flex flex-col gap-3">
            {[
              {
                num: 1,
                title: 'Escolha uma ferramenta',
                desc: 'Navegue pelas 7 categorias e clique na ferramenta que resolve seu problema agora.',
              },
              {
                num: 2,
                title: 'Preencha os campos',
                desc: 'Responda as perguntas curtas. Quanto mais específica você for, melhor a Nara responde.',
              },
              {
                num: 3,
                title: 'Copie e use',
                desc: 'A resposta aparece em segundos. Copie com um clique e use direto no WhatsApp, Instagram ou onde precisar.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-4 rounded-2xl p-5"
                style={{
                  background: 'var(--nara-surface)',
                  border: '1px solid var(--nara-border)',
                }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold"
                  style={{ background: 'var(--nara-accent)', color: '#0F0E0D' }}
                >
                  {step.num}
                </span>
                <div>
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: 'var(--nara-text)' }}
                  >
                    {step.title}
                  </p>
                  <p
                    className="leading-relaxed"
                    style={{ fontSize: '14px', color: 'var(--nara-muted)' }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — Dica importante */}
        <section className="mb-10 animate-fade-up">
          <p
            className="uppercase tracking-wider mb-3"
            style={{ fontSize: '12px', color: 'var(--nara-muted)' }}
          >
            Dica importante
          </p>

          <div
            className="rounded-2xl p-5"
            style={{
              background: 'var(--nara-surface)',
              border: '2px solid var(--nara-accent)',
            }}
          >
            <p
              className="leading-relaxed mb-4"
              style={{ fontSize: '14px', color: 'var(--nara-text)' }}
            >
              Complete seu perfil em &ldquo;Meu Negócio&rdquo;. Com seu nicho e produto salvo, a Nara
              personaliza <strong>TODAS</strong> as respostas automaticamente — sem você precisar
              repetir isso toda vez.
            </p>
            <Link
              href="/nara/meu-negocio"
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'var(--nara-accent)' }}
            >
              Ir para Meu Negócio →
            </Link>
          </div>
        </section>

        {/* Section 3 — Perguntas frequentes */}
        <section className="mb-10 animate-fade-up">
          <p
            className="uppercase tracking-wider mb-3"
            style={{ fontSize: '12px', color: 'var(--nara-muted)' }}
          >
            Perguntas frequentes
          </p>

          <div className="flex flex-col gap-3">
            {[
              {
                q: 'Posso usar a mesma ferramenta mais de uma vez?',
                a: 'Sim! Cada vez que você gera, a Nara cria uma resposta diferente. Use o botão "Gerar novamente" para variações.',
              },
              {
                q: 'As respostas ficam salvas?',
                a: 'Por enquanto não. Copie o texto antes de fechar a página.',
              },
              {
                q: 'Posso editar a resposta da Nara?',
                a: 'Claro. A resposta é um ponto de partida — ajuste o que quiser antes de enviar.',
              },
              {
                q: 'A Nara entende meu tipo de negócio?',
                a: 'Sim, se você preencher o perfil em "Meu Negócio". Quanto mais contexto ela tiver, mais precisa ela fica.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{
                  background: 'var(--nara-surface)',
                  border: '1px solid var(--nara-border)',
                }}
              >
                <p
                  className="font-semibold text-sm mb-2"
                  style={{ color: 'var(--nara-text)' }}
                >
                  {faq.q}
                </p>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: '14px', color: 'var(--nara-muted)' }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 — Precisa de ajuda? */}
        <section className="animate-fade-up">
          <p
            className="uppercase tracking-wider mb-3"
            style={{ fontSize: '12px', color: 'var(--nara-muted)' }}
          >
            Precisa de ajuda?
          </p>

          <div
            className="rounded-2xl p-5"
            style={{
              background: 'var(--nara-surface)',
              border: '1px solid var(--nara-border)',
            }}
          >
            <p
              className="font-semibold text-sm mb-2"
              style={{ color: 'var(--nara-text)' }}
            >
              Fale com a gente pelo WhatsApp
            </p>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'var(--nara-accent)' }}
            >
              Abrir WhatsApp →
            </a>
            <p
              className="mt-3"
              style={{ fontSize: '12px', color: 'var(--nara-muted)' }}
            >
              Respondemos em até 24 horas nos dias úteis.
            </p>
          </div>
        </section>

      </main>
    </div>
  )
}
