-- Execute este SQL no Supabase Dashboard > SQL Editor

-- Tabela de usuários (além da auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  kiwify_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive'
    CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'refunded')),
  plan TEXT DEFAULT 'essencial'
    CHECK (plan IN ('essencial', 'profissional', 'escala')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Usuário só lê o próprio perfil
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Service role pode fazer tudo (webhook Kiwify)
CREATE POLICY "service_role_all" ON public.users
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger: preenche public.users quando um novo auth.user é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_status_idx ON public.users(subscription_status);

-- ─────────────────────────────────────────────
-- Perfil de Negócio
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  niche       TEXT,
  product     TEXT,
  audience    TEXT,
  avg_ticket  TEXT,
  voice_tone  TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bp_select_own" ON public.business_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "bp_insert_own" ON public.business_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bp_update_own" ON public.business_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Bio Pages (Link na Bio)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bio_pages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT,
  photo_url   TEXT,
  whatsapp    TEXT,
  published   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bio_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "biopage_select_own" ON public.bio_pages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "biopage_insert_own" ON public.bio_pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "biopage_update_own" ON public.bio_pages
  FOR UPDATE USING (auth.uid() = user_id);

-- Leitura pública para páginas publicadas (visitantes sem login)
CREATE POLICY "biopage_public_read" ON public.bio_pages
  FOR SELECT USING (published = TRUE);

-- Items da bio page (produtos, links, whatsapp)
CREATE TABLE IF NOT EXISTS public.bio_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     UUID REFERENCES public.bio_pages(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('product', 'link', 'whatsapp')),
  label       TEXT NOT NULL,
  url         TEXT,
  image_url   TEXT,
  price       TEXT,
  position    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bio_items ENABLE ROW LEVEL SECURITY;

-- Leitura pública (visitantes veem os items da página)
CREATE POLICY "bioitem_public_read" ON public.bio_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bio_pages
      WHERE bio_pages.id = bio_items.page_id AND bio_pages.published = TRUE
    )
  );

CREATE POLICY "bioitem_owner_all" ON public.bio_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bio_pages
      WHERE bio_pages.id = bio_items.page_id AND bio_pages.user_id = auth.uid()
    )
  );

-- Sessões de chat da bio page (visitantes anônimos)
CREATE TABLE IF NOT EXISTS public.bio_chats (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id       UUID REFERENCES public.bio_pages(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT NOT NULL,
  messages      JSONB DEFAULT '[]',
  msg_count     INTEGER DEFAULT 0,
  month_key     TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM'),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bio_chats ENABLE ROW LEVEL SECURITY;

-- Acesso público via service role apenas (API route valida o session_token)
CREATE POLICY "biochat_service_all" ON public.bio_chats
  FOR ALL USING (auth.role() = 'service_role');
