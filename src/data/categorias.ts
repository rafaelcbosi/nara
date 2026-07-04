export type TipoCampo = 'text' | 'textarea' | 'select'

export interface Campo {
  id: string
  label: string
  tipo: TipoCampo
  placeholder?: string
  opcoes?: string[]
}

export interface Ferramenta {
  slug: string
  nome: string
  descricao: string
  campos: Campo[]
  promptTemplate: string
}

export interface Categoria {
  slug: string
  nome: string
  icone: string
  descricao: string
  ferramentas: Ferramenta[]
}

export const categorias: Categoria[] = [
  {
    slug: 'whatsapp-vendas',
    nome: 'WhatsApp & Vendas',
    icone: '💬',
    descricao: 'Mensagens prontas para vender, reativar e fechar clientes',
    ferramentas: [
      {
        slug: 'reativar-cliente',
        nome: 'Reativar cliente sumido',
        descricao: 'Mensagem natural para clientes que sumiram',
        campos: [
          { id: 'nicho', label: 'Qual é o seu negócio?', tipo: 'text', placeholder: 'Ex: vendo bolos artesanais' },
          { id: 'tempo', label: 'Há quanto tempo sumiu?', tipo: 'select', opcoes: ['1 semana', '1 mês', '3 meses', 'mais de 6 meses'] },
          { id: 'tom', label: 'Tom da mensagem', tipo: 'select', opcoes: ['Amigável e casual', 'Profissional e direto', 'Carinhoso e próximo'] },
        ],
        promptTemplate: 'Crie uma mensagem de WhatsApp para reativar um cliente sumido. Negócio: {nicho}. Tempo sem contato: {tempo}. Tom desejado: {tom}. A mensagem deve ser natural, não desesperada, e incluir um motivo para entrar em contato + uma pergunta aberta ou oferta sutil.',
      },
      {
        slug: 'fechar-venda',
        nome: 'Fechar venda no WhatsApp',
        descricao: 'Resposta certeira para transformar interesse em compra',
        campos: [
          { id: 'produto', label: 'O que você vende?', tipo: 'text', placeholder: 'Ex: curso de confeitaria online' },
          { id: 'preco', label: 'Qual o preço?', tipo: 'text', placeholder: 'Ex: R$ 197' },
          { id: 'objecao', label: 'O que o cliente disse?', tipo: 'textarea', placeholder: 'Ex: "Deixa eu pensar e te falo amanhã"' },
        ],
        promptTemplate: 'Crie uma resposta de WhatsApp para fechar uma venda. Produto: {produto}. Preço: {preco}. O que o cliente disse: {objecao}. A resposta deve ser empática, criar senso de oportunidade sem pressionar, e terminar com uma chamada para ação clara.',
      },
      {
        slug: 'follow-up-proposta',
        nome: 'Follow-up pós-proposta',
        descricao: 'Mensagem para retomar contato sem parecer insistente',
        campos: [
          { id: 'produto', label: 'O que você ofereceu?', tipo: 'text', placeholder: 'Ex: serviço de design de logo' },
          { id: 'dias', label: 'Há quantos dias sem resposta?', tipo: 'select', opcoes: ['2 dias', '3 dias', '5 dias', '1 semana', 'mais de 1 semana'] },
        ],
        promptTemplate: 'Crie uma mensagem de follow-up de WhatsApp após envio de proposta sem resposta. Produto/serviço oferecido: {produto}. Tempo sem resposta: {dias}. A mensagem deve ser leve, mostrar interesse genuíno, e abrir espaço para o cliente se pronunciar sem pressão.',
      },
      {
        slug: 'responder-objecao-preco',
        nome: 'Responder objeção de preço',
        descricao: 'Resposta empática que reposiciona o valor do produto',
        campos: [
          { id: 'produto', label: 'O que você vende?', tipo: 'text', placeholder: 'Ex: mentoria de negócios' },
          { id: 'preco', label: 'Qual o preço?', tipo: 'text', placeholder: 'Ex: R$ 800' },
          { id: 'objecao', label: 'O que o cliente disse sobre o preço?', tipo: 'textarea', placeholder: 'Ex: "Está muito caro para mim agora"' },
        ],
        promptTemplate: 'Crie uma resposta empática para a objeção de preço no WhatsApp. Produto: {produto}. Preço: {preco}. O que o cliente disse: {objecao}. A resposta deve reconhecer a preocupação do cliente, reposicionar o valor (não justificar o preço), e oferecer uma alternativa se aplicável.',
      },
      {
        slug: 'funil-vendas-completo',
        nome: 'Funil de vendas completo',
        descricao: 'Sequência de 5 mensagens do primeiro contato ao fechamento',
        campos: [
          { id: 'nicho', label: 'Qual é o seu negócio?', tipo: 'text', placeholder: 'Ex: personal trainer online' },
          { id: 'produto', label: 'O que você vende?', tipo: 'text', placeholder: 'Ex: programa de emagrecimento 90 dias' },
          { id: 'canal', label: 'Canal principal de captação', tipo: 'select', opcoes: ['Instagram', 'WhatsApp', 'Indicação', 'Anúncio pago', 'TikTok'] },
        ],
        promptTemplate: 'Crie uma sequência completa de 5 mensagens de WhatsApp para um funil de vendas. Negócio: {nicho}. Produto: {produto}. Canal de captação: {canal}. As mensagens devem cobrir: 1) Primeiro contato/boas-vindas, 2) Qualificação e diagnóstico, 3) Apresentação da solução, 4) Quebra de objeções, 5) Fechamento com CTA. Cada mensagem deve ser numerada e ter um objetivo claro.',
      },
    ],
  },
  {
    slug: 'conteudo-instagram',
    nome: 'Conteúdo & Instagram',
    icone: '📸',
    descricao: 'Legendas, bio, stories e roteiros prontos para postar',
    ferramentas: [
      {
        slug: 'legenda-post',
        nome: 'Legenda de post',
        descricao: 'Legenda com CTA para qualquer tipo de post',
        campos: [
          { id: 'nicho', label: 'Qual é o seu negócio?', tipo: 'text', placeholder: 'Ex: consultora de imagem' },
          { id: 'tema', label: 'Tema do post', tipo: 'text', placeholder: 'Ex: como usar cores no trabalho' },
          { id: 'tom', label: 'Tom da legenda', tipo: 'select', opcoes: ['Educativo e informativo', 'Leve e divertido', 'Motivacional', 'Profissional e sério'] },
        ],
        promptTemplate: 'Crie uma legenda de Instagram para um post. Negócio: {nicho}. Tema: {tema}. Tom: {tom}. A legenda deve ter: gancho forte na primeira linha, desenvolvimento do tema, e CTA claro no final. Inclua sugestões de 5 hashtags relevantes ao final.',
      },
      {
        slug: 'bio-perfil',
        nome: 'Bio do perfil',
        descricao: 'Bio otimizada e impactante em até 150 caracteres',
        campos: [
          { id: 'nome', label: 'Seu nome ou nome do negócio', tipo: 'text', placeholder: 'Ex: Ana Lima' },
          { id: 'oque_faz', label: 'O que você faz?', tipo: 'text', placeholder: 'Ex: ajudo mulheres a encontrar seu estilo' },
          { id: 'publico', label: 'Para quem?', tipo: 'text', placeholder: 'Ex: mulheres executivas 30+' },
        ],
        promptTemplate: 'Crie 3 opções de bio para Instagram. Nome/negócio: {nome}. O que faz: {oque_faz}. Para quem: {publico}. Cada bio deve ter no máximo 150 caracteres, ser clara, direta, e incluir o resultado que a pessoa entrega. Apresente as 3 opções numeradas.',
      },
      {
        slug: 'stories-oferta',
        nome: 'Stories de oferta',
        descricao: 'Sequência de 3 stories para vender pelo Instagram',
        campos: [
          { id: 'produto', label: 'O que você está vendendo?', tipo: 'text', placeholder: 'Ex: workshop de finanças pessoais' },
          { id: 'preco', label: 'Qual o preço ou condição especial?', tipo: 'text', placeholder: 'Ex: R$ 97 ou 3x R$ 37' },
          { id: 'urgencia', label: 'Qual a urgência ou escassez?', tipo: 'text', placeholder: 'Ex: somente até domingo, 20 vagas' },
        ],
        promptTemplate: 'Crie uma sequência de 3 stories para vender no Instagram. Produto: {produto}. Preço/condição: {preco}. Urgência: {urgencia}. Para cada story, descreva: o visual sugerido, o texto principal, e o elemento interativo (enquete, pergunta, swipe up). O tom deve ser animado mas sem desespero.',
      },
      {
        slug: 'roteiro-video',
        nome: 'Roteiro de vídeo',
        descricao: 'Gancho + desenvolvimento + CTA para Reels ou TikTok',
        campos: [
          { id: 'tema', label: 'Tema do vídeo', tipo: 'text', placeholder: 'Ex: 3 erros que te impedem de vender mais' },
          { id: 'duracao', label: 'Duração', tipo: 'select', opcoes: ['30 segundos', '60 segundos', '3 minutos'] },
          { id: 'nicho', label: 'Seu negócio', tipo: 'text', placeholder: 'Ex: coach de produtividade' },
        ],
        promptTemplate: 'Crie um roteiro de vídeo para Reels/TikTok. Tema: {tema}. Duração: {duracao}. Negócio: {nicho}. O roteiro deve ter: GANCHO (primeiros 3 segundos — irresistível), DESENVOLVIMENTO (conteúdo principal em blocos), CTA final (o que a pessoa deve fazer). Formate com os marcadores de tempo aproximados.',
      },
      {
        slug: 'funil-conteudo',
        nome: 'Funil de conteúdo',
        descricao: 'Plano de 7 posts estratégicos do topo ao fundo do funil',
        campos: [
          { id: 'nicho', label: 'Seu negócio', tipo: 'text', placeholder: 'Ex: nutricionista especialista em emagrecimento' },
          { id: 'produto', label: 'O que você vende?', tipo: 'text', placeholder: 'Ex: acompanhamento nutricional online' },
          { id: 'objetivo', label: 'Objetivo do funil', tipo: 'select', opcoes: ['Vender um produto', 'Gerar leads', 'Crescer seguidores', 'Lançar algo novo'] },
        ],
        promptTemplate: 'Crie um plano de 7 posts para Instagram com estratégia de funil. Negócio: {nicho}. Produto: {produto}. Objetivo: {objetivo}. Os posts devem ser distribuídos em: 3 posts de topo de funil (atrair), 2 de meio (engajar/educar), 2 de fundo (converter). Para cada post: tema, formato sugerido (carrossel/reels/foto), e ideia da legenda.',
      },
    ],
  },
  {
    slug: 'estrategia-negocio',
    nome: 'Estratégia de Negócio',
    icone: '🧠',
    descricao: 'Clareza, direção e decisões estratégicas para o seu negócio',
    ferramentas: [
      {
        slug: 'proximos-3-passos',
        nome: 'Próximos 3 passos',
        descricao: 'Lista priorizada com a ação mais importante agora',
        campos: [
          { id: 'situacao', label: 'Como está seu negócio hoje?', tipo: 'textarea', placeholder: 'Ex: tenho 10 clientes, faturando R$ 3k/mês, quero dobrar em 3 meses' },
          { id: 'objetivo', label: 'Qual é o seu objetivo deste mês?', tipo: 'text', placeholder: 'Ex: fechar 5 novos clientes' },
        ],
        promptTemplate: 'Atue como consultora de negócios e defina os 3 próximos passos mais importantes. Situação atual: {situacao}. Objetivo do mês: {objetivo}. Liste os 3 passos em ordem de prioridade, explicando brevemente o porquê de cada um e qual é a primeira ação concreta para cada passo.',
      },
      {
        slug: 'diagnostico-rapido',
        nome: 'Diagnóstico rápido',
        descricao: 'Análise do maior problema com causa raiz e solução prática',
        campos: [
          { id: 'problema', label: 'Qual é o maior problema do seu negócio agora?', tipo: 'textarea', placeholder: 'Ex: estou postando todo dia mas não consigo vender, não sei o que está errado' },
          { id: 'nicho', label: 'Seu negócio (opcional)', tipo: 'text', placeholder: 'Ex: vendo roupas femininas online' },
        ],
        promptTemplate: 'Faça um diagnóstico de negócio. Problema relatado: {problema}. Negócio: {nicho}. Identifique: 1) A causa raiz provável (não apenas o sintoma), 2) Os 2-3 fatores que estão contribuindo para o problema, 3) A solução mais direta e aplicável. Seja específica e prática — não dê conselhos genéricos.',
      },
      {
        slug: 'como-cobrar-mais',
        nome: 'Como cobrar mais',
        descricao: 'Estratégia de reposicionamento para aumentar seus preços',
        campos: [
          { id: 'servico', label: 'O que você oferece?', tipo: 'text', placeholder: 'Ex: aulas de inglês particulares' },
          { id: 'preco_atual', label: 'Quanto você cobra hoje?', tipo: 'text', placeholder: 'Ex: R$ 80 por hora' },
          { id: 'quanto_quer', label: 'Quanto você quer cobrar?', tipo: 'text', placeholder: 'Ex: R$ 150 por hora' },
        ],
        promptTemplate: 'Crie uma estratégia para cobrar mais pelo serviço. Serviço: {servico}. Preço atual: {preco_atual}. Preço desejado: {quanto_quer}. Inclua: como reposicionar o serviço, o que precisa mudar na entrega ou comunicação, como comunicar o novo preço para clientes atuais, e como atrair novos clientes já no novo valor.',
      },
      {
        slug: 'montar-oferta',
        nome: 'Montar uma oferta',
        descricao: 'Oferta estruturada com bônus e chamada para ação',
        campos: [
          { id: 'produto', label: 'O que você vende?', tipo: 'text', placeholder: 'Ex: curso gravado de maquiagem' },
          { id: 'publico', label: 'Para quem?', tipo: 'text', placeholder: 'Ex: mulheres que querem se maquiar sozinhas' },
          { id: 'diferencial', label: 'O que te diferencia?', tipo: 'text', placeholder: 'Ex: método de 15 minutos para o dia a dia' },
        ],
        promptTemplate: 'Monte uma oferta completa e irresistível. Produto: {produto}. Público: {publico}. Diferencial: {diferencial}. A oferta deve ter: nome de impacto, o que está incluído, 2-3 bônus complementares, resultado prometido, e CTA final. Formate como se fosse um texto de página de vendas.',
      },
      {
        slug: 'escolher-canal',
        nome: 'Escolher canal de venda',
        descricao: 'Recomendação de canal com estratégia para começar agora',
        campos: [
          { id: 'nicho', label: 'Seu negócio', tipo: 'text', placeholder: 'Ex: terapeuta holística' },
          { id: 'publico', label: 'Onde está seu cliente?', tipo: 'text', placeholder: 'Ex: mulheres 35-50 anos, classe média' },
          { id: 'tempo', label: 'Quanto tempo você tem por dia para marketing?', tipo: 'select', opcoes: ['30 minutos', '1 hora', '2 horas', 'mais de 2 horas'] },
        ],
        promptTemplate: 'Recomende o melhor canal de vendas para este negócio. Negócio: {nicho}. Público: {publico}. Tempo disponível: {tempo}. Recomende 1 canal principal e 1 canal de suporte, explicando: por que cada um, como começar nos próximos 7 dias, e o que não fazer para não desperdiçar tempo.',
      },
    ],
  },
  {
    slug: 'organizacao-tarefas',
    nome: 'Organização & Tarefas',
    icone: '📋',
    descricao: 'Rotinas, prioridades e processos para trabalhar com clareza',
    ferramentas: [
      {
        slug: 'rotina-semanal',
        nome: 'Rotina semanal',
        descricao: 'Bloco de rotina organizado por dia com foco no negócio',
        campos: [
          { id: 'horas', label: 'Quantas horas por dia você tem para o negócio?', tipo: 'select', opcoes: ['2 horas', '4 horas', '6 horas', '8 horas ou mais'] },
          { id: 'tipo_negocio', label: 'Tipo de negócio', tipo: 'text', placeholder: 'Ex: loja virtual de acessórios' },
          { id: 'prioridade', label: 'Maior prioridade agora', tipo: 'select', opcoes: ['Atrair clientes', 'Criar conteúdo', 'Atender clientes', 'Organizar processos', 'Lançar produto'] },
        ],
        promptTemplate: 'Crie uma rotina semanal para um empreendedor. Horas disponíveis por dia: {horas}. Negócio: {tipo_negocio}. Prioridade atual: {prioridade}. Monte um bloco de rotina de segunda a sexta (e sábado se necessário) com horários sugeridos e atividades específicas. Inclua blocos de criação de conteúdo, atendimento, tarefas administrativas e estratégia.',
      },
      {
        slug: 'lista-prioridades',
        nome: 'Lista de prioridades',
        descricao: 'Suas tarefas reordenadas por impacto e urgência',
        campos: [
          { id: 'tarefas', label: 'Liste suas tarefas em aberto', tipo: 'textarea', placeholder: 'Cole ou escreva uma tarefa por linha. Ex:\nResponder e-mails\nCriar post para Instagram\nLigar para fornecedor\nFazer planilha de gastos' },
        ],
        promptTemplate: 'Reorganize e priorize estas tarefas usando a matriz de impacto vs urgência. Tarefas: {tarefas}. Para cada tarefa, classifique como: FAZER AGORA (urgente + importante), AGENDAR (importante, não urgente), DELEGAR (urgente, não importante), ou ELIMINAR (não urgente, não importante). Explique brevemente o critério de cada classificação.',
      },
      {
        slug: 'como-delegar',
        nome: 'Como delegar',
        descricao: 'Passo a passo para delegar uma tarefa sem perder qualidade',
        campos: [
          { id: 'tarefa', label: 'Qual tarefa você quer delegar?', tipo: 'text', placeholder: 'Ex: responder DMs do Instagram' },
          { id: 'ajuda', label: 'Que tipo de ajuda você tem?', tipo: 'select', opcoes: ['Assistente virtual', 'Estagiário', 'Sócio/parceiro', 'Freelancer', 'Familiar'] },
        ],
        promptTemplate: 'Crie um guia de delegação para esta tarefa. Tarefa a delegar: {tarefa}. Tipo de ajuda disponível: {ajuda}. Inclua: o que deve ser documentado antes de delegar, como treinar a pessoa em menos de 30 minutos, quais métricas usar para avaliar se está sendo feito bem, e como fazer a primeira revisão.',
      },
      {
        slug: 'estruturar-processo',
        nome: 'Estruturar processo',
        descricao: 'SOP simples em checklist para qualquer tarefa do negócio',
        campos: [
          { id: 'processo', label: 'Nome do processo', tipo: 'text', placeholder: 'Ex: onboarding de novo cliente' },
          { id: 'etapas', label: 'Descreva as etapas brutas (pode ser bagunçado)', tipo: 'textarea', placeholder: 'Ex: mandar contrato, fazer reunião inicial, criar pasta no drive, adicionar no grupo...' },
        ],
        promptTemplate: 'Transforme estas etapas em um SOP (Procedimento Operacional Padrão) claro. Processo: {processo}. Etapas brutas: {etapas}. Organize em um checklist numerado e ordenado, com cada passo sendo uma ação específica e verificável. Inclua quem é responsável por cada etapa e quanto tempo deve levar (se aplicável).',
      },
      {
        slug: 'planejamento-mes',
        nome: 'Planejamento do mês',
        descricao: 'Plano de 4 semanas com foco e metas por semana',
        campos: [
          { id: 'objetivo', label: 'Qual é o seu objetivo principal este mês?', tipo: 'text', placeholder: 'Ex: lançar meu primeiro produto digital' },
          { id: 'recursos', label: 'Recursos disponíveis', tipo: 'textarea', placeholder: 'Ex: 3 horas por dia, orçamento de R$ 500 para anúncios, tenho um produto quase pronto' },
        ],
        promptTemplate: 'Crie um plano mensal de 4 semanas. Objetivo do mês: {objetivo}. Recursos disponíveis: {recursos}. Para cada semana, defina: o foco principal, as 3 tarefas mais importantes, e o resultado esperado ao final da semana. O plano deve ser realista e progressivo, com a Semana 4 garantindo que o objetivo seja atingido.',
      },
    ],
  },
  {
    slug: 'marketing-oferta',
    nome: 'Marketing & Oferta',
    icone: '🎯',
    descricao: 'Posicionamento, campanhas e copies prontas para converter',
    ferramentas: [
      {
        slug: 'oferta-irresistivel',
        nome: 'Criar oferta irresistível',
        descricao: 'Oferta com nome de impacto, bônus e CTA que converte',
        campos: [
          { id: 'produto', label: 'O que você vende?', tipo: 'text', placeholder: 'Ex: consultoria de imagem presencial' },
          { id: 'publico', label: 'Para quem é?', tipo: 'text', placeholder: 'Ex: mulheres executivas que querem se vestir com segurança' },
          { id: 'preco', label: 'Qual o preço?', tipo: 'text', placeholder: 'Ex: R$ 350' },
        ],
        promptTemplate: 'Crie uma oferta irresistível completa. Produto: {produto}. Público: {publico}. Preço: {preco}. A oferta deve ter: nome que comunica o resultado, o que está incluído (detalhado), 2 bônus que aumentam o valor percebido, para quem é (e para quem não é), garantia sugerida, e CTA final. Escreva como se fosse um post de vendas.',
      },
      {
        slug: 'posicionar-produto',
        nome: 'Posicionar produto',
        descricao: 'Novo posicionamento em 2 linhas que diferencia você do mercado',
        campos: [
          { id: 'produto', label: 'O que você vende?', tipo: 'text', placeholder: 'Ex: brigadeiros gourmet' },
          { id: 'para_quem', label: 'Para quem você vende?', tipo: 'text', placeholder: 'Ex: empresas para presentes corporativos' },
          { id: 'como_cobra', label: 'Como você cobra atualmente?', tipo: 'text', placeholder: 'Ex: por unidade, por caixa' },
        ],
        promptTemplate: 'Crie um novo posicionamento de mercado para este produto. Produto: {produto}. Para quem: {para_quem}. Como cobra: {como_cobra}. Entregue: 1) Uma frase de posicionamento (máximo 2 linhas) que diferencie do mercado, 2) O argumento central de valor, 3) Como comunicar isso no Instagram e no WhatsApp.',
      },
      {
        slug: 'prompt-imagem-ia',
        nome: 'Prompt para imagem IA',
        descricao: 'Prompt pronto para gerar imagens no Canva IA ou ChatGPT',
        campos: [
          { id: 'produto', label: 'O que você quer mostrar na imagem?', tipo: 'text', placeholder: 'Ex: uma sessão de spa relaxante' },
          { id: 'estilo', label: 'Estilo visual desejado', tipo: 'select', opcoes: ['Minimalista e clean', 'Quente e aconchegante', 'Profissional e corporativo', 'Colorido e alegre', 'Dark e premium'] },
          { id: 'uso', label: 'Onde vai usar?', tipo: 'select', opcoes: ['Post do Instagram', 'Story', 'Capa de produto', 'Banner do site', 'Thumbnail de vídeo'] },
        ],
        promptTemplate: 'Crie 3 prompts para gerar imagens com IA. O que mostrar: {produto}. Estilo: {estilo}. Uso: {uso}. Cada prompt deve estar em inglês (funciona melhor para IA de imagem), ser detalhado com composição, iluminação, estilo e atmosfera. Formate como: PROMPT 1: [texto], PROMPT 2: [texto], PROMPT 3: [texto].',
      },
      {
        slug: 'descricao-produto',
        nome: 'Descrição de produto',
        descricao: 'Copy de descrição que vende para loja, bio ou catálogo',
        campos: [
          { id: 'produto', label: 'Qual é o produto?', tipo: 'text', placeholder: 'Ex: kit skincare para pele seca' },
          { id: 'beneficios', label: 'Quais os principais benefícios?', tipo: 'textarea', placeholder: 'Ex: hidrata por 24h, reduz vermelhidão, textura leve' },
          { id: 'onde', label: 'Onde vai usar essa descrição?', tipo: 'select', opcoes: ['Loja virtual', 'Instagram/Bio', 'WhatsApp catálogo', 'Marketplace'] },
        ],
        promptTemplate: 'Escreva uma descrição de produto que vende. Produto: {produto}. Benefícios: {beneficios}. Onde vai usar: {onde}. A descrição deve: começar com o principal benefício (não com o nome do produto), usar linguagem sensorial, responder objeções implícitas, e terminar com um CTA. Escreva 2 versões: uma curta (até 80 palavras) e uma longa (até 200 palavras).',
      },
      {
        slug: 'campanha-lancamento',
        nome: 'Campanha de lançamento',
        descricao: 'Cronograma completo de 7 dias para lançar seu produto',
        campos: [
          { id: 'produto', label: 'O que você vai lançar?', tipo: 'text', placeholder: 'Ex: ebook de receitas fitness' },
          { id: 'data', label: 'Quando abre o carrinho?', tipo: 'text', placeholder: 'Ex: na próxima segunda-feira' },
          { id: 'canal', label: 'Canal principal', tipo: 'select', opcoes: ['Instagram', 'WhatsApp', 'Instagram + WhatsApp', 'TikTok', 'E-mail'] },
        ],
        promptTemplate: 'Crie um cronograma de campanha de lançamento de 7 dias. Produto: {produto}. Abertura do carrinho: {data}. Canal: {canal}. Para cada dia, defina: o objetivo do dia (aquecer, gerar curiosidade, revelar, vender, urgência), o tipo de conteúdo a publicar, e a mensagem central. O cronograma deve criar antecipação progressiva e pico de vendas no dia de abertura.',
      },
    ],
  },
  {
    slug: 'crm-relacionamento',
    nome: 'CRM & Relacionamento',
    icone: '🤝',
    descricao: 'Fidelize, reative e encante seus clientes com mais consistência',
    ferramentas: [
      {
        slug: 'mensagem-pos-compra',
        nome: 'Mensagem pós-compra',
        descricao: 'Mensagem de agradecimento que gera indicação e fidelização',
        campos: [
          { id: 'produto', label: 'Produto ou serviço vendido', tipo: 'text' },
          { id: 'canal', label: 'Canal', tipo: 'select', opcoes: ['WhatsApp', 'Instagram', 'E-mail'] },
        ],
        promptTemplate: 'Crie uma mensagem pós-compra para cliente. Produto: {produto}. Canal: {canal}. A mensagem deve agradecer genuinamente, perguntar sobre a experiência, e sutilmente incentivar indicação ou retorno.',
      },
      {
        slug: 'reativacao-cliente-vip',
        nome: 'Reativar cliente VIP',
        descricao: 'Abordagem especial para seu melhor cliente que sumiu',
        campos: [
          { id: 'cliente_perfil', label: 'Perfil do cliente', tipo: 'text', placeholder: 'Ex: comprou 3 vezes, sempre elogiava' },
          { id: 'tempo_sumido', label: 'Tempo sem comprar', tipo: 'select', opcoes: ['1 mês', '3 meses', '6 meses', 'mais de 6 meses'] },
        ],
        promptTemplate: 'Crie mensagem para reativar cliente VIP. Perfil do cliente: {cliente_perfil}. Tempo sem comprar: {tempo_sumido}. Tom deve ser exclusivo e pessoal, não genérico.',
      },
      {
        slug: 'pesquisa-satisfacao',
        nome: 'Pesquisa de satisfação',
        descricao: 'Pergunta simples que revela o que o cliente realmente pensa',
        campos: [
          { id: 'produto', label: 'Produto ou serviço', tipo: 'text' },
          { id: 'formato', label: 'Formato', tipo: 'select', opcoes: ['WhatsApp', 'Formulário curto', 'Enquete Instagram'] },
        ],
        promptTemplate: 'Crie uma pesquisa de satisfação simples. Produto/serviço: {produto}. Formato: {formato}. Máximo 3 perguntas, linguagem informal, que gere resposta honesta.',
      },
      {
        slug: 'programa-indicacao',
        nome: 'Criar programa de indicação',
        descricao: 'Estrutura simples de indicação que o cliente realmente usa',
        campos: [
          { id: 'produto', label: 'Produto ou serviço', tipo: 'text' },
          { id: 'beneficio', label: 'Benefício oferecido', tipo: 'text', placeholder: 'Ex: 10% de desconto, brinde, crédito' },
        ],
        promptTemplate: 'Crie um programa de indicação simples e atrativo. Produto: {produto}. Benefício oferecido: {beneficio}. Inclua: regras claras em 3 linhas, mensagem pronta para o cliente compartilhar, e como divulgar nas redes.',
      },
    ],
  },
  {
    slug: 'gestao-financeira',
    nome: 'Gestão Financeira',
    icone: '💰',
    descricao: 'Controle, precificação e organização financeira sem complicar',
    ferramentas: [
      {
        slug: 'precificar-produto',
        nome: 'Precificar produto ou serviço',
        descricao: 'Preço justo que cobre custos e gera lucro real',
        campos: [
          { id: 'produto', label: 'Produto ou serviço', tipo: 'text' },
          { id: 'custo', label: 'Custo direto', tipo: 'text', placeholder: 'Ex: R$40 em materiais, 2h de trabalho' },
          { id: 'despesas_fixas', label: 'Despesas fixas mensais', tipo: 'text', placeholder: 'Ex: R$500/mês de aluguel, internet, etc' },
          { id: 'margem', label: 'Margem de lucro desejada', tipo: 'select', opcoes: ['20%', '30%', '40%', '50%', '60%'] },
        ],
        promptTemplate: 'Calcule e explique a precificação deste produto/serviço. Produto: {produto}. Custo direto: {custo}. Despesas fixas mensais: {despesas_fixas}. Margem de lucro desejada: {margem}. Mostre o cálculo passo a passo em linguagem simples e entregue o preço final recomendado com justificativa.',
      },
      {
        slug: 'separar-pj-pessoal',
        nome: 'Separar PJ do pessoal',
        descricao: 'Plano prático para parar de misturar dinheiro do negócio com o pessoal',
        campos: [
          { id: 'faturamento', label: 'Faturamento mensal', tipo: 'text', placeholder: 'Ex: R$4.000/mês' },
          { id: 'situacao', label: 'Situação atual', tipo: 'textarea', placeholder: 'Ex: ainda uso conta pessoal para tudo, não sei quanto fica de lucro' },
        ],
        promptTemplate: 'Crie um plano prático para separar financeiro do negócio e pessoal. Faturamento mensal: {faturamento}. Situação atual: {situacao}. Inclua: passo a passo para estruturar as contas, quanto transferir para si mesmo como pró-labore, e como acompanhar lucro real.',
      },
      {
        slug: 'fluxo-caixa-simples',
        nome: 'Fluxo de caixa simples',
        descricao: 'Modelo de controle mensal que qualquer pessoa consegue manter',
        campos: [
          { id: 'entradas', label: 'Entradas do mês', tipo: 'textarea', placeholder: 'Ex: vendas recorrentes R$2k, consultoria avulsa R$800' },
          { id: 'saidas', label: 'Saídas do mês', tipo: 'textarea', placeholder: 'Ex: fornecedor R$500, anúncios R$200, aluguel R$400' },
        ],
        promptTemplate: 'Organize este fluxo de caixa e dê uma análise. Entradas: {entradas}. Saídas: {saidas}. Apresente: tabela simples com totais, saldo líquido, 2-3 observações sobre saúde financeira, e 1 ação concreta para melhorar.',
      },
    ],
  },
]

export function getCategoriaBySlug(slug: string): Categoria | undefined {
  return categorias.find(c => c.slug === slug)
}

export function getFerramentaBySlug(categoriaSlug: string, ferramentaSlug: string): Ferramenta | undefined {
  const categoria = getCategoriaBySlug(categoriaSlug)
  return categoria?.ferramentas.find(f => f.slug === ferramentaSlug)
}

export function getFerramentaGlobal(ferramentaSlug: string): { ferramenta: Ferramenta; categoria: Categoria } | undefined {
  for (const categoria of categorias) {
    const ferramenta = categoria.ferramentas.find(f => f.slug === ferramentaSlug)
    if (ferramenta) return { ferramenta, categoria }
  }
  return undefined
}
