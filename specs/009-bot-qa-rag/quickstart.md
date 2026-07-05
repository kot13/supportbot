# Quickstart: Bot Q&A with RAG

**Branch**: `009-bot-qa-rag`  

## Prerequisites

- PostgreSQL with **pgvector** extension available on the server image.
- `DATABASE_URL`, migrations applied (including `003`–`005`).
- Bot token in **Bots** (`/bot`).
- `OPENAI_API_KEY` in `.env`.
- Knowledge files present:
  - `data/docs-master/docs/`
  - `data/resources.csv`
  - `data/inappstory-pub-api-v1.yaml`
- Webhook or long-polling delivering updates (`npm run telegram:poll` for local dev).

## 1. Configure environment

```bash
cp .env.example .env
# Add:
# OPENAI_API_KEY=sk-...
# TELEGRAM_BOT_USERNAME=your_bot   # recommended for group @mention
# DOCS_BASE_URL=https://docs.inappstory.com   # optional
```

## 2. Migrate and index knowledge base

```bash
npm run db:migrate   # includes 003–005
npm run rag:index
```

Expect log line with chunk count and `knowledge_index_runs.status = completed`.

## 3. Start update ingestion

**Option A — long polling (local dev)**:

```bash
npm run telegram:poll
```

Expect log `telegram_poll_started`. Only **one** polling process per bot token.

**Option B — webhook (production)**:

1. Open `/bot`.
2. Enter full HTTPS URL → **Register webhook**.

## 4. Verify bot answers (US1, SC-001)

1. Message the bot in **private** chat: «Как начать работу с Android SDK?»
2. Within ~30 s receive a text answer in Telegram.
3. Ask a follow-up in the same chat; answer should reflect prior context.

**Group chat**: use `@YourBotUsername вопрос…` or reply to a bot message.

## 5. Verify history in admin (US3, SC-003)

1. Open `/chats`.
2. Click the chat title → `/chats/[id]`.
3. Confirm user and bot messages appear in order with role labels and sender name (link to Telegram when available).

## 6. Verify out-of-scope behavior (US4, SC-005)

Ask: «Какая погода в Москве?» — bot should state it cannot answer from InAppStory docs.

## 7. Verify unanswered list (US5)

1. Ask an out-of-scope question (step 6).
2. Open `/unanswered` in the sidebar.
3. Confirm the question appears with reason «Нет контекста в документации» and link to the message in chat.

## 8. Verify formatting (SC-006)

Ask a question that yields code and doc links — confirm clickable links and code blocks in Telegram (not raw `` ``` `` / `[text](url)`).

## 9. Verify `/start` and `/help`

- `/start` → fixed greeting, no RAG.
- «Что ты умеешь?» or `/help` → fixed topic list, no RAG.

## 10. Reindex after doc updates

```bash
npm run rag:index
```

## Automated checks

```bash
npm test && npm run lint
```

Integration tests (with `DATABASE_URL` + optional `OPENAI_API_KEY` mock):

- `isAddressedToBot` unit tests
- message persistence + API `GET /api/chats/[id]/messages`
- chunker unit tests (md / csv / yaml samples)

## Troubleshooting

| Symptom | Check |
|---------|--------|
| No bot reply | `npm run telegram:poll` or webhook; `OPENAI_API_KEY`; index not empty |
| No reply in **group** without `@` | Expected — privacy mode; use `@bot` or reply |
| `telegram_poll_conflict` in logs | Stop duplicate `getUpdates` processes |
| Same question works with `@bot` but not without | Fixed in v1.1: `stripBotMentionFromText` + `RAG_MAX_DISTANCE=0.62` |
| «Cannot answer» always | Run `rag:index`; verify sources on disk |
| Markdown shows as raw text | Restart polling after deploy; check `parse_mode: HTML` |
| Duplicate replies | `processed_telegram_updates` table; webhook not registered twice |
| pgvector error | `CREATE EXTENSION vector` on DB (use Docker pgvector image locally) |
