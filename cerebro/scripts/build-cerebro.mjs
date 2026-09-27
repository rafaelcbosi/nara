// Gera cerebro/dist/cerebro.js: módulo único para colar no Worker da Clara.
// Uso: node cerebro/scripts/build-cerebro.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const brain = readFileSync(join(root, 'cerebro-rafael.md'), 'utf8')
  // o banco de respostas vai separado (busca), então fica fora do prompt fixo
  .split('## 12. Banco de respostas do Rafael')[0]
  .trim()

const dir = join(root, 'base', 'respostas')
const respostas = readdirSync(dir)
  .filter(f => f.endsWith('.jsonl'))
  .sort()
  .flatMap(f => readFileSync(join(dir, f), 'utf8').trim().split('\n').map(l => JSON.parse(l)))
  .map(r => ({
    id: r.id,
    tema: r.tema,
    pergunta: r.pergunta,
    variacoes: r.variacoes || [],
    nivel: r.nivel,
    pensa: r.como_o_rafael_pensa,
    rapida: r.solucao_rapida?.acao,
    media: r.solucao_media?.resumo,
    longa: r.solucao_longa?.resumo,
    oferta: r.oferta_recomendada,
    resposta: r.resposta_whatsapp,
  }))

const runtime = `
const STOP = new Set('a o e de da do das dos em no na nos nas um uma uns umas pra para por com que se eu meu minha meus minhas voce vc tu te me mais muito ja nao sim como qual quais isso esse essa este esta ta tá é ao aos as os'.split(' '))

function tokens(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9\\s]/g, ' ')
    .split(/\\s+/)
    .filter(w => w.length > 2 && !STOP.has(w))
}

// Busca as respostas do Rafael mais parecidas com a pergunta do cliente.
export function buscarRespostas(pergunta, limite = 3) {
  const q = new Set(tokens(pergunta))
  if (q.size === 0) return []
  return RESPOSTAS
    .map(r => {
      const alvo = tokens([r.pergunta, ...r.variacoes, r.tema].join(' '))
      let score = 0
      for (const w of alvo) if (q.has(w)) score++
      return { r, score: score / Math.sqrt(alvo.length || 1) }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map(x => x.r)
}

// Monta o bloco de conhecimento que vai no system prompt da Clara.
export function montarContextoCerebro(perguntaCliente) {
  const exemplos = buscarRespostas(perguntaCliente)
  const bloco = exemplos.length
    ? exemplos.map((r, i) => \`Exemplo \${i + 1} (tema: \${r.tema})
Pergunta: \${r.pergunta}
Como o Rafael pensa: \${r.pensa}
Solução rápida: \${r.rapida}
Médio prazo: \${r.media}
Longo prazo: \${r.longa}
Oferta indicada: \${r.oferta}
Resposta modelo no WhatsApp:
\${r.resposta}\`).join('\\n\\n')
    : '(nenhuma resposta parecida na base; responda seguindo o cérebro)'
  return \`\${CEREBRO}

## Respostas do Rafael parecidas com a pergunta atual
Use como referência de raciocínio e tom. Adapte ao caso real da pessoa, nunca copie de forma genérica.

\${bloco}\`
}
`

const out = `// ARQUIVO GERADO por cerebro/scripts/build-cerebro.mjs. Não edite à mão.
// Fonte: cerebro/cerebro-rafael.md e cerebro/base/respostas/*.jsonl

export const CEREBRO = ${JSON.stringify(brain)}

export const RESPOSTAS = ${JSON.stringify(respostas)}
${runtime}`

writeFileSync(join(root, 'dist', 'cerebro.js'), out)
console.log(`cerebro.js gerado: ${respostas.length} respostas, ${Math.round(out.length / 1024)} KB`)
