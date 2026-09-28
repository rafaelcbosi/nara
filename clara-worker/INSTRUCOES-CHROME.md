# Instruções para o Claude no Chrome: publicar a nova versão da Clara

Esta versão corrige o erro que impedia a Clara de responder, liga o cérebro com as 105 respostas do Rafael,
adiciona os comandos /cliente e /perguntas e coloca o Painel em /painel.

Regras:
- **Antes de clicar em Deploy, peça confirmação ao Rafael.**
- Não altere variáveis nem secrets existentes. O único secret novo é `PAINEL_SENHA`, e quem digita a senha é o Rafael.
- Nunca use o caractere travessão em textos.

## Passo 1: senha do painel (o Rafael digita)
1. Abra https://dash.cloudflare.com/d0636230eaab6b1372cc071fac1f0510/workers/services/view/clara-whatsapp/production/settings
2. Em "Variables and Secrets", clique em "Add", tipo "Secret", nome `PAINEL_SENHA`.
3. Peça ao Rafael para digitar a senha no campo de valor. Não leia nem repita a senha.
4. Salve.

## Passo 2: trocar o código
1. Abra https://github.com/rafaelcbosi/nara/blob/claude/brave-mayer-f0zhf9/clara-worker/dist/clara-worker.js e clique em "Raw". Copie todo o conteúdo (Ctrl+A, Ctrl+C).
2. Abra https://dash.cloudflare.com/d0636230eaab6b1372cc071fac1f0510/workers/services/view/clara-whatsapp/production e clique em "Edit code".
3. No arquivo principal (worker.js), selecione tudo (Ctrl+A) e cole o código novo (Ctrl+V). Deve ficar um único arquivo.
4. Confira se o editor não mostra erro.
5. **Peça confirmação ao Rafael** e clique em "Deploy".

## Passo 3: testar com o Rafael
1. Abra https://clara-whatsapp.rafael-d06.workers.dev/ e confirme que aparece "Clara online ✅".
2. Peça ao Rafael para mandar "oi" de um celular que não seja o pessoal para +55 11 91086-6616 e depois "Quanto eu cobro pelo meu serviço?". A Clara deve responder em poucos segundos.
3. Abra https://clara-whatsapp.rafael-d06.workers.dev/painel e peça ao Rafael para entrar com a senha. A conversa do teste deve aparecer em "Conversas".
4. Peça ao Rafael para mandar `/ajuda` do número pessoal para a Clara e confirmar que aparecem /cliente e /perguntas.

## Se algo der errado
Volte a versão anterior: na página do Worker, aba "Deployments", escolha a versão anterior e clique em "Rollback".
O backup do código anterior também está em `clara-worker/worker-atual.js` no GitHub.
