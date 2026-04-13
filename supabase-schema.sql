-- INCLAW Supabase Schema
-- Run this in the Supabase SQL editor to set up the database

-- Chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title       TEXT,
  model_id    TEXT NOT NULL DEFAULT 'codellama-34b',
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  model_id        TEXT,
  thinking_steps  JSONB,
  tokens_used     INTEGER
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session
  ON public.chat_messages (session_id, created_at);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user
  ON public.chat_sessions (user_id, updated_at DESC);

-- Auto-update updated_at on sessions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous sessions (user_id NULL) for demo usage
CREATE POLICY "Allow public read for anonymous sessions"
  ON public.chat_sessions FOR SELECT
  USING (user_id IS NULL);

CREATE POLICY "Allow public insert for anonymous sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Allow message read for session owner"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions s
      WHERE s.id = session_id AND s.user_id IS NULL
    )
  );

CREATE POLICY "Allow message insert for session owner"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions s
      WHERE s.id = session_id AND s.user_id IS NULL
    )
  );

-- INCLAW memory table for per-user context
CREATE TABLE IF NOT EXISTS public.inclaw_memory (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  session_id  TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  model_used  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking for rate limiting
CREATE TABLE IF NOT EXISTS public.inclaw_usage (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT,
  message_count INTEGER DEFAULT 0,
  hour_window   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
