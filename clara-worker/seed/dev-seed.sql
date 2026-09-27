DELETE FROM messages; DELETE FROM contacts; DELETE FROM painel_perfis; DELETE FROM painel_etiquetas; DELETE FROM painel_eventos; DELETE FROM painel_aprendizado;
INSERT INTO contacts (phone,name,paused_until,created_at) VALUES ('5521988124471','Juliana Prado',NULL,1790336969163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5521988124471','user','Quero fazer uma pergunta para o Rafael',1790542169163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5521988124471','assistant','Oi, Juliana! Aqui é a Clara, assistente virtual do Rafael Bosi. Pode mandar sua pergunta, por texto ou áudio 😊',1790542241163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5521988124471','user','Todo mundo acha meu preço caro. Devo baixar?',1790542529163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5521988124471','assistant','Quase nunca é o preço. É que o cliente não tá vendo o valor.

Não baixa agora. Muda a ordem: primeiro o resultado, depois a prova, depois o preço.

Testa essa semana e me conta.',1790542601163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5521988124471','user','Faz sentido! E como eu faço pacotes?',1790549369163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5521988124471','assistant','Adorei suas perguntas! Pra ir mais fundo, o Rafael tem a Série Clareza Digital, por R$ 74. Quer o link?',1790549441163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5521988124471','user','Quero sim!',1790551889163);
INSERT INTO painel_perfis (phone,empresa,segmento,tipo,faturamento,etapa,interesse,cidade,uf,o_que_vende,origem,score,atualizado_em) VALUES ('5521988124471','Studio Ju Prado','Beleza e estética','Serviço local','Começando (até R$ 5 mil)','Oferta enviada','Série Clareza','Niterói','RJ','Design de sobrancelha','Anúncio Pergunte ao Rafael',82,1790552969163);
INSERT INTO painel_etiquetas (phone,etiqueta,criado_em) VALUES ('5521988124471','whatsapp',1790552969163);
INSERT INTO painel_etiquetas (phone,etiqueta,criado_em) VALUES ('5521988124471','quente',1790552969163);
INSERT INTO painel_etiquetas (phone,etiqueta,criado_em) VALUES ('5521988124471','serie',1790552969163);
INSERT INTO contacts (phone,name,paused_until,created_at) VALUES ('5511977402019','Marcos Tavares',1790588969163,1790336969163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5511977402019','user','Tudo depende de mim no negócio. Como delego?',1790459369163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5511977402019','assistant','Você tem equipe ou prestador de serviço?

Começa delegando o que se repete e não precisa de você.',1790459729163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5511977402019','user','Tenho 2 pessoas mas não sei organizar. Queria falar com o Rafael.',1790542169163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5511977402019','assistant','Pelo que você me contou, vale uma conversa com o Rafael. Ele tem um Diagnóstico Estratégico de 30 minutos: rafaelbosi.com/30-min',1790542349163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5511977402019','admin','Oi, Marcos! Aqui é o Rafael. Vi seu caso, vamos conversar.',1790545769163);
INSERT INTO painel_perfis (phone,empresa,segmento,tipo,faturamento,etapa,interesse,cidade,uf,o_que_vende,origem,score,diagnostico_em,atualizado_em) VALUES ('5511977402019','Tavares Consultoria','Finanças e contabilidade','Serviço online / consultoria','Crescendo (R$ 5 a 30 mil)','Diagnóstico marcado','Mentoria','São Paulo','SP','Consultoria financeira para PMEs','Link da bio',91,1790624969163,1790552969163);
INSERT INTO painel_etiquetas (phone,etiqueta,criado_em) VALUES ('5511977402019','whatsapp',1790552969163);
INSERT INTO painel_etiquetas (phone,etiqueta,criado_em) VALUES ('5511977402019','mentoria',1790552969163);
INSERT INTO painel_etiquetas (phone,etiqueta,criado_em) VALUES ('5511977402019','rafael',1790552969163);
INSERT INTO contacts (phone,name,paused_until,created_at) VALUES ('5527993015582','Beatriz Lemos',NULL,1790336969163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5527993015582','user','Oi! A Paula me indicou',1790534249163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5527993015582','assistant','Oi, Beatriz! Aqui é a Clara, assistente virtual do Rafael. Me conta em 1 frase o que você vende?',1790534321163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5527993015582','user','[Áudio transcrito] Eu faço bolo de pote e queria começar a vender, mas não sei se cobro pelo preço do mercado ou pelo meu custo.',1790534609163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5527993015582','user','Não sei quanto cobrar',1790534969163);
INSERT INTO painel_perfis (phone,empresa,segmento,tipo,faturamento,etapa,interesse,cidade,uf,o_que_vende,origem,score,atualizado_em) VALUES ('5527993015582','Doce Bia','Alimentação','Produto físico','Ideia (ainda não vende)','Qualificando','Ainda não definido','Vila Velha','ES','Bolo de pote','Indicação',48,1790552969163);
INSERT INTO painel_etiquetas (phone,etiqueta,criado_em) VALUES ('5527993015582','whatsapp',1790552969163);
INSERT INTO contacts (phone,name,paused_until,created_at) VALUES ('5548991203346','Camila Rocha',NULL,1790336969163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5548991203346','user','Como consigo mais clientes pra minha loja?',1790369369163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5548991203346','assistant','Onde estão os clientes que já compraram de você, estão os próximos.

Quem é o seu cliente que mais compra?',1790369729163);
INSERT INTO messages (phone,role,content,created_at) VALUES ('5548991203346','user','Mães de 30 a 40 anos, principalmente',1790372969163);
INSERT INTO painel_perfis (phone,empresa,segmento,tipo,faturamento,etapa,interesse,cidade,uf,o_que_vende,origem,score,atualizado_em) VALUES ('5548991203346','Pequenos Passos Kids','Moda e varejo','Comércio / ponto físico','Começando (até R$ 5 mil)','Qualificando','Série Clareza','Florianópolis','SC','Roupa infantil','Link da bio',57,1790552969163);
INSERT INTO painel_etiquetas (phone,etiqueta,criado_em) VALUES ('5548991203346','whatsapp',1790552969163);
INSERT INTO painel_etiquetas (phone,etiqueta,criado_em) VALUES ('5548991203346','serie',1790552969163);
INSERT INTO painel_eventos (phone,tipo,descricao,criado_em) VALUES ('5531984557730','pagamento','Pagamento da Mentoria confirmado pela Kiwify. Boas-vindas enviadas.',1790480969163);
INSERT INTO painel_aprendizado (pergunta,resposta,criado_em) VALUES ('Vale a pena fazer um curso de marketing antes de começar?','O que eu faria: começa vendendo e aprende no caminho. Lista 10 pessoas que comprariam de você e oferece essa semana.',1790516969163);
INSERT INTO painel_aprendizado (pergunta,resposta,criado_em) VALUES ('Posso usar o Instagram pessoal pro meu negócio?','Pode, e é bom. Vida real aproxima. O segredo é ligar a vida ao seu trabalho.',1790516969163);
