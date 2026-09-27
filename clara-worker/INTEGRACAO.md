# Como ligar o Painel na Clara (Worker clara-whatsapp)

O painel foi construído e testado localmente (`npm run db:local` e `npm run dev`).
Para rodar em produção, ele entra no mesmo Worker da Clara. Passos:

## 1. Arquivos
Copiar para o Worker de produção:
- `src/painel/handler.js`, `db.js`, `negocio.js`, `whatsapp.js`, `ai.js`, `ui.html`
- `src/cerebro.js` (gerado por `npm run build:cerebro`)

No `wrangler.toml` de produção, garantir a regra para importar HTML como texto:
```toml
[[rules]]
type = "Text"
globs = ["**/*.html"]
fallthrough = true
```

## 2. Rota
No `fetch` do Worker principal, antes do webhook:
```js
import { handlePainel } from './painel/handler.js'
// ...
if (url.pathname.startsWith('/painel')) return handlePainel(request, env, ctx)
```

## 3. Banco (D1 "clara")
Rodar `migrations/0001_painel.sql` uma vez (só cria tabelas novas `painel_*`; não mexe nas existentes).

## 4. Adaptador
Em `src/painel/db.js`, ajustar o bloco `ADAPTADOR` com os nomes reais das tabelas e colunas de mensagens e contatos
(e onde a pausa de 12h é guardada). É o único ponto que depende do código atual.

## 5. Ganchos no fluxo da Clara
Depois que a Clara responder uma mensagem de cliente:
```js
import { registrarPerguntaParaRevisao, atualizarPerfil } from './painel/db.js'
import { extrairPerfil } from './painel/ai.js'
ctx.waitUntil(registrarPerguntaParaRevisao(env.DB, phone, textoCliente, respostaClara))
// A cada 3 mensagens do cliente, atualizar o perfil com IA:
ctx.waitUntil(extrairPerfil(env, conversa).then(d => atualizarPerfil(env.DB, phone, d)))
```
Etiquetas: expor a função de etiqueta do Wix que já existe como `env.__sincronizarEtiquetaWix(phone, etiqueta, adicionar)`.

## 6. Segredos
- `PAINEL_SENHA` (Secret): senha de acesso ao painel. Recomendado também proteger `/painel*` com Cloudflare Access (login por e-mail).
- Já existentes e reutilizados: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `OPENROUTER_API_KEY`, `DB`.

## 7. Modelos da Meta
Cadastrar e aprovar os modelos de `templates-meta.md` antes de usar "Reabrir conversa".

## Endereço
https://clara-whatsapp.rafael-d06.workers.dev/painel
