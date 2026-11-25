# Loja Aline · Cutelaria Jonas

| Peça | Onde |
|---|---|
| Base de dados | Google Sheets "BASE GESTÃO 2026 · Cutelaria Jonas" (pasta Dashboard 2026 no Drive) |
| Painel de gestão | https://claude.ai/artifact/JgV496ktWEE3XdfAMqpyjU (lê a base ao vivo) |
| Proposta visual | `painel-da-aline.html` / `painel-aline-apresentacao.html` |

## Fontes
- Caixa mensal (Drive, pastas de caixa): vendas por vendedora, afiação, retiradas
- FINANCEIRO_2026.xlsx: receitas, contas, DRE
- PONTO | CUTELARIA JONAS - LJ2 (respostas): batidas de ponto

## Como regenerar a base
1. Baixar os caixas mensais para `caixa/01.xlsx … 11.xlsx`, o financeiro para `fin/financeiro.xlsx` e o ponto para `ponto/ponto.xlsx`.
2. `python3 etl/01_ler_caixas.py <pasta>/caixa`
3. `python3 etl/02_montar_base.py <pasta>` → gera `BASE_GESTAO_2026.xlsx`.

## Regras
- Jornada: seg–sex 08:30–18:00 com 1h30 de almoço; sábado 08:30–12:30. Tolerância de 10 min/dia (CLT art. 58 §1º).
- Poder de compra: meta × 45% − todos os boletos de fornecedor que vencem no mês.
- Meta oficial: aba VENDAS do financeiro (novembro = R$ 79.000).

## Pastas de entrada (Drive › Dashboard 2026 › ENTRADAS DA ALINE)
| Pasta | O que entra | Quando |
|---|---|---|
| 01 · XML DAS NOTAS DE COMPRA | XML de cada nota | a cada nota, mesmo dia |
| 02 · BOLETOS | boleto que não veio no XML | quando chegar |
| 03 · NOTAS DE ENTRADA | relatório do sistema | toda segunda |
| 04 · EXTRATO BANCÁRIO | extrato da semana | toda segunda |
| 05 · MAQUININHA REDE | vendas e recebimentos | toda segunda |
| 06 · RELATÓRIOS DO SISTEMA | vendas por vendedora/produto, estoque | toda segunda; estoque dia 1º |

A aba ROTINA da base guarda essas regras; a seção "Central da Aline" do painel mostra se cada pasta está em dia.
Instruções do assistente: Google Doc "INSTRUÇÕES DO ASSISTENTE DA ALINE" na pasta Dashboard 2026.

## IDs no Drive
- Base: 13-_lZHKaE7HQ_lArBHCxuV1bjt03EFuCMSNfoAvGLAQ · Dashboard 2026: 1oR4MRLu2PsglB9cp4jqj2uE23jaOQ_81 · ENTRADAS: 1OyzegMKwha2JEuEWZhjSruqSG0csUcHR
- Financeiro 2026: 1OWrVmwGII0FLdc53q1bCnxnpSi8K10jV · Ponto LJ2: 18FFxxkqn36tPYSxgC-_AgpkyQoPxwA-OEi-G35r_SIA
- Caixas 2026: 01=1cAznVmbvYcDfOXwy4LChWE0_qm155XNJ 02=1imJpK_D8SY6SjXIpkL67Cv_4EPjo58x2 03=1jvPXX9MIjgGBuTriNIBVb8svLGuBGQgu 04=1Vi3MDw-JTpedeTT90vQ0A43Zbmh5agye 05=1LvoODhdTwQ_T3pAZ-W0UEKdWR0kcR8et 06=1LdR0qQtbmrZmIs97OgXhdkhGnXb8FaWt 07=1VG_guG6GYHyCH-Or8rr-KZ0wjjA2jsDK 08=1rdgjJTGR5mhweYDlwKGD-44oIk5jCCJt 09=15vj8vOUwyGG0dfPfnFaaksTwRDldFaC3 10=1T4KJ5t6PLj6I_FBQlACB2k8qEz3x3uKR 11=1IKdETaY31uz2cjNzc7ac7et2dSTptLbL
- Meses novos: pastas de caixa 1PW_s4-qbKGi7VXMfuTzJrSuA0UHn-JnA e 1Qbv7mAjq7zVHlK4XfmyEC7LngjPA4Ddq (arquivo "<MÊS> 26" mais recente).

## Automação (tarefas agendadas, rodam nesta sessão do Claude)
- Seg–sáb 06:47 (Brasília): olha as pastas da Aline (só arquivos novos) e atualiza a base se caixa, ponto ou financeiro mudaram.
- Segunda 09:38: conferência semanal — o que escapou e o que faltou enviar.
- O que vem das pastas vai para abas próprias (CONTAS_XML, BAIXAS, RECEITAS_EXTRATO, CONCILIACAO, PROCESSADOS), que a rotina diária não apaga.

## Regra de operação: economia de tokens (sempre)
1. Verificar antes de agir: metadados primeiro (modifiedTime, lista de arquivos); abrir arquivo só se for novo ou mudou.
2. Nada mudou → responder "Sem novidades." e parar.
3. Processar só o delta; regravar só as abas afetadas.
4. Respostas curtas (até 5 linhas na rotina diária, 8 na semanal), sem reexplicar contexto.
- Pedidos da Aline chegam como comentário no painel; ela tem poder de decisão.

## Painéis
| Painel | Link | Quem vê | Conteúdo |
|---|---|---|---|
| Gestão (master) | https://claude.ai/artifact/JgV496ktWEE3XdfAMqpyjU | Rafael e Aline | Abas Geral (filtro de período), Saúde do mês, Compras (poder de compra + pedidos), Caixa diário (com afiação), Equipe (folha de ponto, cargos, ocorrências) |
| Mural da Equipe | https://claude.ai/artifact/Xbf5VrB1v8q7Y2yc6JZXJc | Funcionárias | Botão de ponto (formulário LJ2), metas do dia/semana/mês, vendas por vendedora, bônus, avisos, produtos da semana, promoções. Sem dado financeiro além de vendas × meta |

Registros feitos nos painéis (pedidos, cargos, ocorrências, itens do mural) ficam no próprio painel; só editores gravam.
Regra de ouro: as planilhas da Cutelaria (financeiro, caixa, ponto) são só lidas; tudo é escrito na BASE e nos painéis.
