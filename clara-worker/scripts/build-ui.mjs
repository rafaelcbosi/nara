// Gera src/painel/ui.js a partir de ui.html (o editor do Cloudflare aceita um arquivo único).
import { readFileSync, writeFileSync } from 'node:fs'
const html = readFileSync(new URL('../src/painel/ui.html', import.meta.url), 'utf8')
writeFileSync(new URL('../src/painel/ui.js', import.meta.url), `// ARQUIVO GERADO a partir de ui.html por scripts/build-ui.mjs. Não edite à mão.\nexport default ${JSON.stringify(html)}\n`)
console.log('ui.js gerado')
