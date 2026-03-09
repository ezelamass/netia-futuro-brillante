
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- ============================================
-- RAG tables for each avatar
-- ============================================

CREATE TABLE public.rag_tino (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  embedding extensions.vector(1536),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.rag_zahia (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  embedding extensions.vector(1536),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.rag_roma (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  embedding extensions.vector(1536),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for similarity search
CREATE INDEX idx_rag_tino_embedding ON public.rag_tino USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_rag_zahia_embedding ON public.rag_zahia USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_rag_roma_embedding ON public.rag_roma USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);

-- RLS
ALTER TABLE public.rag_tino ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_zahia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_roma ENABLE ROW LEVEL SECURITY;

-- Read access for authenticated users
CREATE POLICY "Authenticated users can read rag_tino" ON public.rag_tino FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read rag_zahia" ON public.rag_zahia FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read rag_roma" ON public.rag_roma FOR SELECT TO authenticated USING (true);

-- Admin insert/delete
CREATE POLICY "Admins can manage rag_tino" ON public.rag_tino FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage rag_zahia" ON public.rag_zahia FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage rag_roma" ON public.rag_roma FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Generic match_documents function for RAG retrieval
CREATE OR REPLACE FUNCTION public.match_rag_documents(
  _table_name text,
  _query_embedding extensions.vector(1536),
  _match_count int DEFAULT 5,
  _match_threshold float DEFAULT 0.7
)
RETURNS TABLE (id bigint, content text, metadata jsonb, similarity float)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _table_name = 'rag_tino' THEN
    RETURN QUERY
      SELECT t.id, t.content, t.metadata,
        1 - (t.embedding <=> _query_embedding)::float AS similarity
      FROM public.rag_tino t
      WHERE 1 - (t.embedding <=> _query_embedding) > _match_threshold
      ORDER BY t.embedding <=> _query_embedding
      LIMIT _match_count;
  ELSIF _table_name = 'rag_zahia' THEN
    RETURN QUERY
      SELECT t.id, t.content, t.metadata,
        1 - (t.embedding <=> _query_embedding)::float AS similarity
      FROM public.rag_zahia t
      WHERE 1 - (t.embedding <=> _query_embedding) > _match_threshold
      ORDER BY t.embedding <=> _query_embedding
      LIMIT _match_count;
  ELSIF _table_name = 'rag_roma' THEN
    RETURN QUERY
      SELECT t.id, t.content, t.metadata,
        1 - (t.embedding <=> _query_embedding)::float AS similarity
      FROM public.rag_roma t
      WHERE 1 - (t.embedding <=> _query_embedding) > _match_threshold
      ORDER BY t.embedding <=> _query_embedding
      LIMIT _match_count;
  END IF;
END;
$$;
