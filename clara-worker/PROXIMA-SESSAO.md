# Mensagem para abrir a próxima sessão

Cole o texto abaixo numa sessão nova do Claude Code, no repositório `rafaelcbosi/nara`, branch `claude/brave-mayer-f0zhf9`:

---

Você vai continuar o projeto CLARA (meu agente de WhatsApp) de onde paramos. Leia primeiro, no branch `claude/brave-mayer-f0zhf9`:
- `cerebro/STATUS.md` (onde estamos)
- `clara-worker/INTEGRACAO.md` (como ligar cérebro e painel no Worker)
- `clara-worker/worker-atual.js` (backup do código atual da Clara, se existir)

O ambiente já tem `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` e acesso a api.cloudflare.com. Worker: `clara-whatsapp`. Banco D1: `clara`.

Tarefas, nesta ordem:
1. Baixar o código atual do Worker pela API (se o backup não estiver no GitHub) e salvar em `clara-worker/worker-atual.js`.
2. Ligar o cérebro (`src/cerebro.js`) no prompt da Clara, com o limite de 2 perguntas, os links de agendamento e os comandos /cliente e /perguntas, sem quebrar nada que já funciona.
3. Ligar o painel seguindo `INTEGRACAO.md`: ajustar o ADAPTADOR em `src/painel/db.js` para as tabelas reais e rodar a migração `migrations/0001_painel.sql` no D1 de produção.
4. Testar localmente, me mostrar o resumo das mudanças e **pedir minha confirmação antes do deploy**.
5. Depois do deploy, me guiar no teste: "oi" de outro celular para +55 11 91086-6616 e login em /painel.

Regras: respostas objetivas em português, nunca use travessão, me peça confirmação antes de ações irreversíveis ou que publicam algo, e nunca me peça para colar tokens no chat.
