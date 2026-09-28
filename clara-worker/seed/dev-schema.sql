-- SÓ PARA DESENVOLVIMENTO LOCAL: mesma estrutura das tabelas da Clara em produção.
CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, phone TEXT NOT NULL, role TEXT NOT NULL, content TEXT, ts INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_messages_phone_ts ON messages (phone, ts);
CREATE TABLE IF NOT EXISTS contacts (phone TEXT PRIMARY KEY, name TEXT, tags TEXT, paused_until INTEGER DEFAULT 0, wix_id TEXT, created INTEGER);
