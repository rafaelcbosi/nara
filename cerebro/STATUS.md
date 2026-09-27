# Projeto Clara: status

Atualizado em 27/09/2026.

## Feito
- Token permanente do usuário Admin novo gerado e colocado em `WHATSAPP_TOKEN`.
- Número real da Clara: **+55 11 91086-6616** (VoIP YourBusinessNumber), instalado e funcionando.
- Cérebro do Rafael v2 (`cerebro/cerebro-rafael.md`): regra "Não vim te ensinar, vim te mostrar", método, voz, objeções, escada de ofertas, limites e as lições das correções do Rafael.
- Regra comercial: a Clara responde até 2 perguntas e depois vende só os produtos disponíveis (Série Clareza R$ 74 e Mentoria R$ 2.300).
- Base de respostas (`cerebro/base/`): estrutura para 10.000 respostas e 105 respostas de ouro em 21 temas (30 aprovadas pelo Rafael, 75 no estilo aprovado).
- Wix Bookings verificado: só existe o serviço antigo "Clareza em Movimento" (oculto).

- Painel da Clara construído e testado localmente (`clara-worker/`): Seu dia, conversas, perfil com IA, filtros, funil com meta, briefing, sugestões, modelos da Meta, pagamento manual, aprendizado. Falta ligar no Worker de produção (`clara-worker/INTEGRACAO.md`).
- Modelos de mensagem para a Meta prontos (`clara-worker/templates-meta.md`).

## Em aberto
| # | Tarefa | Quem |
|---|---|---|
| 1 | Colar o código do Worker para ligar cérebro, base, limite de 2 perguntas e /perguntas na Clara | Rafael cola, Claude ajusta |
| 2 | Links de agendamento: feito (rafaelbosi.com/30-min para o Diagnóstico Estratégico e rafaelbosi.com/agendamento-mentoria só para quem pagou) | Feito |
| 3 | Link de pagamento da Mentoria | Rafael informa |
| 4 | Conteúdo para a Clara: 4 guias da Série, formato da Mentoria, depoimentos, história do Rafael | Rafael manda (pode ser áudio) |
| 5 | Confirmar com a YourBusinessNumber o uso na Cloud API | Rafael envia mensagem pronta |
| 6 | WIX_API_KEY no Cloudflare | Rafael |
| 7 | Verificação da empresa na Meta | Rafael + Claude |
| 8 | Foto e descrição do perfil da Clara no WhatsApp | Claude prepara |
| 9 | Serviço em grupo | Rafael define |
| 10 | Campanha "Pergunte ao Rafael" (anúncio para WhatsApp) e fluxo Instagram para Clara | Claude prepara |
| 11 | Apagar o usuário do sistema antigo "Clara Bot" | Rafael, após confirmação |

## Regras de aquecimento do número (primeira semana)
- Não conectar WhatsApp Web ou outros aparelhos.
- Não entrar em grupos.
- Pedir para 5 conhecidos mandarem mensagem antes de qualquer envio ativo.
- Sem disparo frio.
