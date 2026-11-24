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
