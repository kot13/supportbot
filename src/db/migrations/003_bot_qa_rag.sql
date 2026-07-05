-- Bot Q&A with RAG: chat history, knowledge chunks, idempotency

create extension if not exists vector;

create table if not exists chat_messages (
  id bigserial primary key,
  chat_id bigint not null references chats(id) on delete cascade,
  role text not null check (role in ('user', 'bot')),
  content text not null,
  telegram_message_id bigint null,
  telegram_user_id bigint null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_chat_id_created_at_idx
  on chat_messages (chat_id, created_at desc);

create unique index if not exists chat_messages_chat_telegram_msg_uniq
  on chat_messages (chat_id, telegram_message_id)
  where telegram_message_id is not null;

create table if not exists knowledge_chunks (
  id bigserial primary key,
  source_type text not null check (source_type in ('sdk_doc', 'console_article', 'api_spec')),
  source_path text not null,
  title text null,
  content text not null,
  content_hash text not null,
  embedding vector(1536) not null,
  metadata jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint knowledge_chunks_source_hash_uniq unique (source_type, source_path, content_hash)
);

create index if not exists knowledge_chunks_embedding_hnsw_idx
  on knowledge_chunks using hnsw (embedding vector_cosine_ops);

create table if not exists knowledge_index_runs (
  id bigserial primary key,
  status text not null check (status in ('running', 'completed', 'failed')),
  chunk_count int null,
  error_message text null,
  started_at timestamptz not null default now(),
  finished_at timestamptz null
);

create table if not exists processed_telegram_updates (
  update_id bigint primary key,
  processed_at timestamptz not null default now()
);
