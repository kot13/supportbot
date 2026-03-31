-- 001_init.sql
-- Core tables for supportbot v1 (admins, bot settings, chats, broadcasts)

create table if not exists admin_users (
  id bigserial primary key,
  login text not null unique,
  password_hash text not null,
  disabled_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bot_settings (
  id smallint primary key default 1,
  bot_name text null,
  bot_token_secret text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bot_settings_singleton check (id = 1)
);

create table if not exists chats (
  id bigserial primary key,
  telegram_chat_id bigint not null unique,
  title text null,
  type text null,
  is_active boolean not null default true,
  last_seen_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists broadcast_messages (
  id bigserial primary key,
  content text not null,
  format text not null default 'html',
  target_mode text not null,
  created_by_admin_user_id bigint null references admin_users(id),
  created_at timestamptz not null default now(),
  sent_at timestamptz null,
  status text not null default 'draft'
);

create table if not exists broadcast_recipients (
  id bigserial primary key,
  broadcast_message_id bigint not null references broadcast_messages(id) on delete cascade,
  chat_id bigint not null references chats(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint broadcast_recipients_uniq unique (broadcast_message_id, chat_id)
);

create table if not exists delivery_results (
  id bigserial primary key,
  broadcast_message_id bigint not null references broadcast_messages(id) on delete cascade,
  chat_id bigint not null references chats(id),
  status text not null,
  attempt_count int not null default 1,
  sent_at timestamptz null,
  telegram_message_id bigint null,
  error_code text null,
  error_message text null,
  constraint delivery_results_uniq unique (broadcast_message_id, chat_id)
);

create table if not exists sessions (
  id uuid primary key,
  admin_user_id bigint not null references admin_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

