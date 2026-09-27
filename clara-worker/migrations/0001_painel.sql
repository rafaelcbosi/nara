-- Tabelas do Painel da Clara. Só cria tabelas novas; não altera as existentes.
CREATE TABLE IF NOT EXISTS painel_perfis (
  phone TEXT PRIMARY KEY,
  empresa TEXT,
  segmento TEXT,
  tipo TEXT,
  faturamento TEXT,
  etapa TEXT DEFAULT 'Novo',
  interesse TEXT DEFAULT 'Ainda não definido',
  cidade TEXT,
  uf TEXT,
  o_que_vende TEXT,
  origem TEXT,
  resumo TEXT,
  dores TEXT,               -- JSON array
  score INTEGER DEFAULT 0,
  notas TEXT DEFAULT '',
  lido_ate INTEGER DEFAULT 0,
  diagnostico_em INTEGER,   -- epoch ms da call de Diagnóstico, se marcada
  perfil_ia_em INTEGER,     -- quando a IA atualizou o perfil pela última vez
  atualizado_em INTEGER
);
CREATE TABLE IF NOT EXISTS painel_etiquetas (
  phone TEXT NOT NULL,
  etiqueta TEXT NOT NULL,
  criado_em INTEGER,
  PRIMARY KEY (phone, etiqueta)
);
CREATE TABLE IF NOT EXISTS painel_eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT,
  tipo TEXT NOT NULL,       -- pagamento | modelo_enviado | etapa | etiqueta | nota
  descricao TEXT,
  criado_em INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS painel_aprendizado (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  status TEXT DEFAULT 'pendente', -- pendente | aprovada | corrigida
  resposta_final TEXT,
  criado_em INTEGER NOT NULL,
  revisado_em INTEGER
);
CREATE TABLE IF NOT EXISTS painel_config (
  chave TEXT PRIMARY KEY,
  valor TEXT
);
INSERT OR IGNORE INTO painel_config (chave, valor) VALUES ('meta_mensal', '8333');
