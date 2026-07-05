-- Bot model settings: answer + embedding model selection

alter table bot_settings
  add column if not exists answer_model text not null default 'gpt-4.1'
    check (answer_model in ('gpt-4.1', 'gpt-5.5')),
  add column if not exists embedding_model text not null default 'text-embedding-3-small'
    check (embedding_model in ('text-embedding-3-small', 'text-embedding-3-large'));

alter table knowledge_index_runs
  add column if not exists embedding_model text null;
