alter table chat_messages
  add column if not exists telegram_username text null,
  add column if not exists telegram_user_first_name text null;
