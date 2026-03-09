

# Plan: Edge Function + RAG Vector Store for Avatar Chat

## Overview

Replace the 3 n8n webhook endpoints with **one Supabase Edge Function** (`avatar-chat`) that replicates the full n8n pipeline: system prompt, conversation history, RAG retrieval, and structured multi-message response. Additionally, create the vector store infrastructure (3 tables) with an admin upload flow.

## Extracted System Prompts

Successfully extracted from the n8n JSONs:
- **TINO** (~4500 chars): Motivational sports coach, Argentine tone, hydration/training/rest for athletes 8-16. References: Toni Nadal, Mouratoglou, Guardiola, Phil Jackson, Mourinho.
- **ZAHIA** (~3500 chars): Sports nutritionist, science-based, culturally inclusive (Muslim identity). References: Nancy Clark, Louise Burke, Asker Jeukendrup, Ricardo Uauy.
- **ROMA** (~5000 chars): Sports psychology mentor, Contain-Direct-Anchor principle, micro-strategies. References: Jean Cote, Dave Collins, Michael Gervais, Richard Bailey.

Each also has a **Verificador** (formatter) system prompt that splits responses into 2-3 short Argentine-toned messages as `{ respuesta: [...] }`.

## Architecture

```text
Frontend (Chat.tsx)
  │
  ▼  supabase.functions.invoke('avatar-chat', { body })
Edge Function: avatar-chat
  │
  ├─ 1. Load last 20 messages from ai_messages table
  ├─ 2. Query RAG vector store (rag_tino/zahia/roma) via pgvector similarity search
  ├─ 3. Call OpenAI gpt-4o-mini with: system prompt + RAG context + history + user message
  ├─ 4. Parse structured JSON response { respuesta: [...] }
  └─ Return array of message parts
```

## Implementation Steps

### Step 1: Database Migration -- Vector Store Tables
- Enable `pgvector` extension
- Create 3 tables: `rag_tino`, `rag_zahia`, `rag_roma` (same schema each)
  - `id` bigserial PK
  - `content` text
  - `metadata` jsonb
  - `embedding` vector(1536) -- OpenAI text-embedding-3-small dimension
  - Index: `ivfflat` on embedding column using cosine distance
- Create a `match_documents` function per table (or one parameterized function) for similarity search
- RLS: read access for authenticated users, insert for admins

### Step 2: Create Edge Function `avatar-chat`
Single function handling all 3 avatars. Accepts `{ message, avatar, conversationId }`.

Pipeline:
1. Validate input (avatar must be TINO/ZAHIA/ROMA)
2. Fetch last 20 messages from `ai_messages` for conversation context
3. Generate embedding for user message via OpenAI `text-embedding-3-small`
4. Query the correct `rag_<avatar>` table for top-5 similar documents
5. Build messages array: system prompt (full extracted prompt) + RAG context + conversation history + user message
6. Call OpenAI `gpt-4o-mini` with `response_format: { type: "json_object" }` requesting `{ respuesta: string[] }`
7. Return the `respuesta` array as JSON

Uses secrets: `key_openai`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

### Step 3: Update `supabase/config.toml`
Add `[functions.avatar-chat]` with `verify_jwt = false`.

### Step 4: Update Frontend `Chat.tsx`
- Remove `AVATAR_WEBHOOKS` constant
- Replace `fetch(AVATAR_WEBHOOKS[...])` with `supabase.functions.invoke('avatar-chat', { body: { message, avatar, conversationId } })`
- Simplify `parseWebhookResponse` to handle the new clean `{ respuesta: [...] }` format

### Step 5: Create Edge Function `avatar-rag-upload`
Admin-only function for uploading documents to vector stores:
1. Accept file content + avatar name
2. Split text into chunks (~500 tokens each)
3. Generate embeddings via OpenAI
4. Insert into corresponding `rag_<avatar>` table

### Step 6: Admin UI for RAG Upload
Add a section to the admin Settings page (`/admin/settings`) with:
- Dropdown to select avatar (TINO/ZAHIA/ROMA)
- File upload (txt, pdf, md)
- Upload button that calls `avatar-rag-upload`
- List of existing documents per avatar with delete option

## Technical Notes

- The n8n workflows use `gpt-5-mini` which maps to OpenAI's `gpt-4o-mini` model
- The Verificador step is merged into the main system prompt (formatting rules are already included in each avatar's prompt)
- RAG embedding dimension 1536 matches `text-embedding-3-small`
- The edge function uses the service role key to bypass RLS when reading ai_messages

