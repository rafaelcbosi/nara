# Como a Clara e o Painel são montados

- Código-fonte: `src/index.js` (Clara, a partir do backup `worker-atual.js`, com correções), `src/painel/*` (painel), `src/cerebro.js` (cérebro + 105 respostas).
- Arquivo único para produção: `dist/clara-worker.js`, gerado por `npm run build`. É esse arquivo que vai para o editor do Cloudflare.
- As tabelas do painel (`painel_*`) são criadas sozinhas pelo Worker. Nada muda nas tabelas `messages` e `contacts`.
- Secret novo: `PAINEL_SENHA`.
- Teste local: `npm install`, `npm run db:local`, `npm run dev` e abrir http://127.0.0.1:8787/painel (o arquivo `.dev.vars` com `PAINEL_DEV=1` simula os envios).

## Mudanças em relação ao código que estava no ar
1. **Correção crítica:** o laço de `statuses` estava fora do bloco onde `value` existe. Toda mensagem gerava `ReferenceError: value is not defined` e a Clara não respondia ninguém.
2. Cérebro: além da base fixa, cada resposta recebe as 3 respostas do Rafael mais parecidas com a pergunta (105 no total).
3. Contexto informa quantas mensagens a Clara já enviou, para respeitar o limite de 2 perguntas.
4. Comandos novos: `/cliente NUMERO` e `/perguntas [dias]`.
5. Escalonamento e "falar com o Rafael" marcam a etiqueta `precisa-rafael`.
6. Perguntas dos clientes vão para a aba Aprendizado; a cada 3 mensagens a IA atualiza o perfil do cliente.
7. Painel em `/painel`.

Para publicar: seguir `INSTRUCOES-CHROME.md`.
