-- SÓ PARA DESENVOLVIMENTO LOCAL.
-- Simula as tabelas que já existem no D1 "clara" em produção.
-- Os nomes de colunas reais são ajustados em src/painel/db.js (bloco ADAPTADOR).
CREATE TABLE IF NOT EXISTS contacts (
  phone TEXT PRIMARY KEY,
  name TEXT,
  paused_until INTEGER,
  created_at INTEGER
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL,
  role TEXT NOT NULL,        -- 'user' (cliente) | 'assistant' (Clara) | 'admin' (Rafael)
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL -- epoch em milissegundos
);
CREATE INDEX IF NOT EXISTS messages_phone_idx ON messages(phone, created_at);
