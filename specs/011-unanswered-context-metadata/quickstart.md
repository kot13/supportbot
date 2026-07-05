# Quickstart: Unanswered context snapshots

**Branch**: `011-unanswered-context-metadata`  

## Prerequisites

- Feature `009-bot-qa-rag` deployed: migrations `003`–`005`, `rag:index` completed, bot answering questions.
- Admin access to panel (`/unanswered` visible in sidebar).
- `OPENAI_API_KEY` configured (for retrieval path tests).

## 1. Migrate

```bash
npm run db:migrate   # applies 006_unanswered_context_snapshots.sql
```

Verify:

```bash
psql "$DATABASE_URL" -c "\d unanswered_context_snapshots"
```

## 2. Start services

```bash
npm run dev
# separate terminal for local bot ingestion:
npm run telegram:poll
```

## 3. Verify snapshot on `no_context` (US1, SC-001)

1. In Telegram, ask the bot a question outside InAppStory docs, e.g. «Какая погода в Москве?»
2. Confirm fallback reply in chat.
3. Open `/unanswered` — row appears with reason «Нет контекста в документации».
4. Click **View context** (or equivalent).
5. Modal shows:
   - `searchPerformed: true`
   - List of retrieved chunks with source, distance, content
   - Recent dialog messages from the chat

## 4. Verify `no_knowledge_index` (FR-008, SC-003)

1. On a dev DB with empty `knowledge_chunks` (or after `truncate knowledge_chunks` in test env only):
2. Ask any product question.
3. Open context modal — must show **«Поиск по базе знаний не выполнялся»**, not «0 results».

Restore index: `npm run rag:index`.

## 5. Verify API directly

```bash
# Replace MESSAGE_ID with id from /unanswered row
curl -s -b "session=…" "http://localhost:3000/api/unanswered/MESSAGE_ID/context" | jq .
```

Expect `ok: true` and `data.snapshot` object.

## 6. Verify compact table (FR-007)

1. Load `/unanswered` with multiple rows.
2. Table columns unchanged; no wide JSON columns.
3. Context only visible after explicit modal action.

## 7. Run tests

```bash
npm test -- tests/unit/rag/unansweredSnapshot.test.ts
npm test -- tests/integration/unansweredContextSnapshots.test.ts
npm run lint
```

## 8. Legacy rows

Rows created before migration may return `snapshot: null` in API — expected; no backfill in v1.

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Modal 404 | Message must have `unanswered_reason`; use user message id |
| Empty chunks but `searchPerformed: true` | Embedding/API error before search returned results |
| No new snapshot on retry | Idempotent insert — only first unanswered marking creates snapshot |
