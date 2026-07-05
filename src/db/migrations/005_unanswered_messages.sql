alter table chat_messages
  add column if not exists unanswered_reason text null;

create index if not exists chat_messages_unanswered_reason_idx
  on chat_messages (created_at desc)
  where role = 'user' and unanswered_reason is not null;
