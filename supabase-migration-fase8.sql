-- Migração Fase 8 (planos/limites) — rode no Supabase Dashboard > SQL Editor
-- Seguro rodar mesmo se as colunas já existirem (idempotente)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'essencial';

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_plan_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_plan_check CHECK (plan IN ('essencial', 'profissional', 'escala'));

ALTER TABLE public.bio_chats
  ADD COLUMN IF NOT EXISTS month_key TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM');
