create table if not exists unanswered_context_snapshots (
  id bigserial primary key,
  chat_message_id bigint not null unique references chat_messages (id) on delete cascade,
  search_performed boolean not null,
  chunk_count int not null default 0,
  best_distance double precision null,
  recent_messages jsonb not null default '[]'::jsonb,
  retrieved_chunks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
