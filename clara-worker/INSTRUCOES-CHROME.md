# Instruções para o Claude no Chrome: inserir o cérebro na Clara

Objetivo: ligar o Cérebro do Rafael no Worker `clara-whatsapp` da Cloudflare, sem quebrar nada que já funciona.

Regras:
- Não apague nenhuma funcionalidade existente (comandos /r, /pausar, /retomar, /contatos, /leads, /resumo, /ajuda, transcrição de áudio, etiquetas do Wix, pausa de 12h, resumo de segunda, verificação do webhook).
- Não altere variáveis, secrets nem o banco D1.
- **Antes de clicar em Deploy, peça confirmação ao Rafael.**
- Nunca use o caractere travessão em textos da Clara.

## Passo 1: backup
1. Abra https://dash.cloudflare.com/d0636230eaab6b1372cc071fac1f0510/workers/services/view/clara-whatsapp/production e clique em "Edit code".
2. Copie o código atual de todos os arquivos.
3. No GitHub, crie o arquivo `clara-worker/worker-atual.js` no branch `claude/brave-mayer-f0zhf9` do repositório `rafaelcbosi/nara` com esse código (Add file → Create new file → Commit direto no branch).

## Passo 2: adicionar o cérebro como arquivo novo
1. Abra https://github.com/rafaelcbosi/nara/blob/claude/brave-mayer-f0zhf9/cerebro/dist/cerebro.js e clique em "Raw". Copie todo o conteúdo.
2. No editor do Worker, crie um arquivo novo chamado `cerebro.js` ao lado do arquivo principal e cole o conteúdo.
3. No arquivo principal, adicione no topo:
   `import { montarContextoCerebro } from './cerebro.js'`
   Se o editor não aceitar vários arquivos, cole o conteúdo de `cerebro.js` no final do arquivo principal, removendo a palavra `export` das declarações.

## Passo 3: usar o cérebro no prompt da Clara
1. Encontre onde o Worker monta o system prompt enviado ao OpenRouter (procure por `system`, `role: "system"` ou pelo texto da persona da Clara).
2. Mantenha as partes dinâmicas que já existem (dados do contato, histórico, estado de pausa).
3. Substitua o texto fixo da persona/base de conhecimento por:
   `montarContextoCerebro(textoDoCliente)`
   onde `textoDoCliente` é a última mensagem recebida (ou a transcrição do áudio).
4. Se o texto antigo tiver informações que não estão no cérebro (ex.: regras dos comandos), mantenha essas partes junto.
5. Confirme que o modelo continua `anthropic/claude-haiku-4.5`.

## Passo 4: limite de 2 perguntas
Antes de chamar a IA, conte quantas mensagens de pergunta estratégica o contato já recebeu resposta (use a tabela `messages` do D1 para contar as respostas da Clara a esse número). Adicione ao system prompt uma linha com o número:
`Respostas de estratégia já dadas a esta pessoa: N. Se N for 2 ou mais, não responda nova pergunta de estratégia: faça a ponte para os produtos, conforme a seção 7 do cérebro.`
Se contar exatamente for complicado, use o total de respostas da Clara para esse contato como aproximação.

## Passo 5: comando /cliente (só do número do Rafael, ADMIN_PHONE)
`/cliente NUMERO`
1. Adiciona a etiqueta `custom.clara-cliente-ativo-JJ8jy` ao contato (reaproveite a função de etiqueta que já existe).
2. Envia para o NUMERO:
   "Seja muito bem-vindo(a) à Mentoria! 🎉 São 4 encontros de 1h30 com o Rafael, em até 45 dias. Agenda o primeiro aqui: rafaelbosi.com/agendamento-mentoria. Já deixa os próximos marcados também, fica mais fácil manter o ritmo."
3. Responde ao Rafael: "Pronto! Boas-vindas enviadas para NUMERO."
4. Inclua `/cliente NUMERO` no texto do /ajuda.

## Passo 6: comando /perguntas [dias] (só do Rafael)
Lista as últimas mensagens recebidas de clientes nos últimos N dias (padrão 7) que parecem perguntas (terminam com "?" ou têm mais de 8 palavras), no formato:
`• NOME (NUMERO): texto`
Máximo de 20 itens. Inclua no /ajuda.

## Passo 7: revisar e publicar
1. Verifique se o editor não mostra erros.
2. **Peça ao Rafael para confirmar o Deploy.**
3. Depois do Deploy, peça ao Rafael para mandar "oi" de outro celular para +55 11 91086-6616 e depois "Quanto eu cobro pelo meu serviço?". A resposta deve ser curta, direta, no estilo do Rafael, terminando com uma pergunta.
4. Salve o código final no GitHub como `clara-worker/worker.js` no mesmo branch.
