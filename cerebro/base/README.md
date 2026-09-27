# Base de Respostas do Rafael (meta: 10.000 respostas)

A base que a Clara (e depois a Nara) consulta para responder cada cliente como o Rafael responderia,
de acordo com o tema, o nível da empresa, o tipo de negócio e o prazo da solução.

## A conta dos 10.000

**500 perguntas-base × 4 níveis de empresa × 5 tipos de negócio = 10.000 respostas**

- 500 perguntas-base = 21 temas × cerca de 24 perguntas cada.
- Cada resposta traz **3 horizontes de solução** (rápida, média e longa), então a base tem 30.000 soluções.

## Dimensões

### Nível da empresa
| Código | Nível | Sinal |
|---|---|---|
| N0 | Ideia | Ainda não vendeu |
| N1 | Começando | Vende, até R$ 5 mil por mês |
| N2 | Crescendo | R$ 5 mil a R$ 30 mil por mês |
| N3 | Estruturado | Acima de R$ 30 mil por mês ou com equipe |

### Tipo de negócio
| Código | Tipo |
|---|---|
| T1 | Serviço local (salão, clínica, confeitaria, reforma) |
| T2 | Serviço online ou consultoria (mentor, designer, social media) |
| T3 | Produto físico (loja, artesanato, moda) |
| T4 | Produto digital (curso, ebook, comunidade) |
| T5 | Comércio ou negócio com ponto físico (restaurante, loja de bairro) |

### Complexidade da pergunta
| Código | Complexidade | Como a Clara responde |
|---|---|---|
| C1 | Simples | Responde direto e mostra algo pronto |
| C2 | Média | Faz 1 ou 2 perguntas de diagnóstico, depois mostra |
| C3 | Complexa | Mostra a solução rápida e indica a Mentoria para o plano completo |

### Horizonte da solução
| Horizonte | Prazo | Onde é entregue |
|---|---|---|
| Rápida | Esta semana | **No WhatsApp, grátis** (o "mostrar") |
| Média | 30 a 90 dias | A Clara resume em 1 linha como gancho |
| Longa | 6 a 12 meses | A Clara cita como visão; o plano completo é trabalho da Mentoria |

Essa divisão já é a escada de venda: a solução rápida prova o valor, a média gera desejo e a longa justifica a Mentoria.

## Os 21 temas
1. Clareza e foco
2. Validação de ideia
3. Nicho e público
4. Oferta e posicionamento
5. Preço
6. Primeiros clientes
7. Vendas pelo WhatsApp
8. Follow-up e objeções
9. Indicação e relacionamento
10. Instagram e conteúdo
11. Marca pessoal
12. Site e página de vendas
13. Anúncios
14. Produto digital
15. Lançamento
16. Atendimento e pós-venda
17. Organização e rotina
18. Finanças básicas do negócio
19. Equipe e delegação
20. IA e automação
21. Mentalidade e desânimo

## Formato de cada resposta
Arquivos em `respostas/<tema>.jsonl`, uma resposta por linha. Exemplo completo em `exemplo.json`.

## Como a base é construída (sem o Rafael escrever 10.000 respostas)
1. **Respostas de ouro:** 5 por tema (cerca de 100), aprovadas pelo Rafael. Elas calibram a voz e o raciocínio.
2. **Geração em escala:** a IA gera as combinações seguindo o cérebro e as respostas de ouro.
3. **Checagem automática:** cada resposta passa por um checklist: tem algo pronto para copiar, não promete resultado, não oferece produto indisponível, não usa travessão, está no tom do Rafael.
4. **Amostragem:** o Rafael revisa uma amostra pequena por tema. Uma correção dele vale para todas as respostas parecidas.
5. **Perguntas reais:** tudo que chega pela Clara entra na base, e as respostas que mais geram venda sobem de prioridade.

## Como a Clara usa a base
A pergunta do cliente é comparada por significado com a base (busca semântica). A Clara recebe as 3 respostas mais parecidas para o nível e o tipo de negócio da pessoa, e adapta ao caso real. Assim o custo por mensagem continua baixo, mesmo com 10.000 respostas.
