-- 002_broadcast_attachments.sql
-- Add attachment metadata for broadcast messages (images)

create table if not exists broadcast_attachments (
  id bigserial primary key,
  broadcast_message_id bigint not null references broadcast_messages(id) on delete cascade,
  ordinal int not null,
  original_filename text null,
  mime_type text not null,
  size_bytes bigint not null,
  telegram_file_id text null,
  created_at timestamptz not null default now(),
  constraint broadcast_attachments_uniq unique (broadcast_message_id, ordinal)
);

