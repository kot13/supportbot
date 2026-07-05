# Quickstart: Bot model settings

**Branch**: `013-bot-model-settings`  

## Prerequisites

- Migrations `001`–`006` applied; `009-bot-qa-rag` operational.
- `OPENAI_API_KEY` in `.env`.
- Admin login to panel.
- At least one successful `npm run rag:index` on the environment (optional; tests stale/never states without it).

## 1. Migrate

```bash
npm run db:migrate   # applies 007_bot_model_settings.sql
```

Verify:

```bash
psql "$DATABASE_URL" -c "\d bot_settings"
psql "$DATABASE_URL" -c "\d knowledge_index_runs"
```

Expect columns `answer_model`, `embedding_model` on `bot_settings` and `embedding_model` on `knowledge_index_runs`.

## 2. Start app

```bash
npm run dev
```

Open `/bot` (or bot settings route in sidebar).

## 3. Verify default models (US1, US2)

1. Open bot settings.
2. Answer model = `gpt-4.1`, embedding model = `text-embedding-3-small`.
3. Save without changes — success.

## 4. Verify index status block (US3, SC-007)

1. With index built under `text-embedding-3-small`, status should show **current** (no stale badge).
2. Change embedding model to `text-embedding-3-large`, save.
3. Expect warning about reindex + status **outdated**.
4. Last reindex timestamp visible if index existed before.

## 5. Verify UI reindex (US4, SC-006, SC-008)

1. Click **Reindex knowledge base** (or equivalent label).
2. Status becomes **running**; button disabled.
3. Wait for auto-update to **current** (no manual refresh).
4. Stale indicator clears; timestamp updates.

## 6. Verify CLI uses settings (FR-013)

```bash
# With embedding_model = text-embedding-3-large in DB
npm run rag:index
```

Check last run:

```bash
psql "$DATABASE_URL" -c "select id, status, embedding_model, chunk_count, finished_at from knowledge_index_runs order by id desc limit 1;"
```

Expect `embedding_model = text-embedding-3-large`.

## 7. Verify bot answers use new models (SC-002, SC-003)

1. Set answer model to `gpt-5.5`, save.
2. Ask bot a product question in Telegram (after index is **current**).
3. Confirm answer quality / check structured logs for model id if instrumented.

## 8. Verify outdated index blocks bad RAG (edge case)

1. Change embedding model without reindex.
2. Ask bot a documentation question.
3. Expect fallback (not hallucinated doc answer); may appear in `/unanswered`.

## 9. API smoke tests

```bash
# Settings
curl -s -b "session=…" http://localhost:3000/api/bot-settings | jq .

# Index status
curl -s -b "session=…" http://localhost:3000/api/knowledge/index-status | jq .

# Trigger reindex
curl -s -X POST -b "session=…" http://localhost:3000/api/knowledge/reindex | jq .
```

## 10. Tests

```bash
npm test -- tests/unit/domain/botSettings
npm test -- tests/unit/rag/embed.test.ts
npm test -- tests/integration/knowledgeIndexStatus.test.ts
npm run lint
npm run build
```

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Status stuck on `running` | `select * from knowledge_index_runs where status='running'`; kill stale row only in dev |
| Reindex 409 | Another reindex in progress |
| Bot always «not indexed» | `knowledge_chunks` count; index status API `state` |
| OpenAI errors on `gpt-5.5` | API key access to model; fallback in `/unanswered` |
