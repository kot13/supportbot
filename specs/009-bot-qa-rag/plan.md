# Implementation Plan: Ответы бота на вопросы по InAppStory

**Branch**: `009-bot-qa-rag` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)  
**Status**: Implemented (MVP + v1.1 iterations 2026-07-05)  
**Input**: Feature specification from `/specs/009-bot-qa-rag/spec.md`

**Note**: Filled by `/speckit.plan`.

## Summary

Фича **009** добавляет **Q&A-бота** в существующий supportbot:

1. **Telegram**: при обращении с вопросом бот отвечает в чат, используя **RAG** по корпоративной документации InAppStory.
2. **Хранение**: все реплики пользователя и бота в `chat_messages` (включая `telegram_username`, `unanswered_reason`).
3. **Админка**: `/chats/[id]` — история переписки с якорями и ссылками на пользователей; `/unanswered` — мониторинг вопросов без обоснованного ответа.
4. **Стек (по спеке)**: OpenAI **GPT-4.1** + **text-embedding-3-small**, **PostgreSQL + pgvector**.

**План**: миграции `003`–`005`; модули `src/rag/`; Telegram pipeline (`processMessage`, `pollingRunner`, `markdownToTelegramHtml`); CLI `rag:index`; API `GET /api/chats/[id]/messages`; UI `/chats/[id]`, `/unanswered`.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+), Next.js 16 App Router  
**Primary Dependencies**: `pg`, `openai` (new), `zod`, `@heroui/react`, Telegram Bot API, OpenAI API  
**Storage**: PostgreSQL — `chat_messages`, `knowledge_chunks`, `knowledge_index_runs`, `processed_telegram_updates`; migrations `004` (telegram user fields), `005` (`unanswered_reason`); extension `vector`  
**Testing**: Vitest (unit/integration), Playwright e2e для `/chats/[id]` (optional)  
**Target Platform**: Linux server / local dev; PostgreSQL с pgvector  
**Project Type**: Next.js monolith — `app/api`, `app/(panel)`, `src/` domain modules  
**Performance Goals**: Ответ в чат ≤ 30 с (SC-001); webhook ACK < 1 с; индексация ~300+ документов — разовая операция, допустимо несколько минут  
**Constraints**: OpenAI и токен бота только на сервере; webhook не блокируется на RAG; Telegram message ≤ 4096 chars  
**Scale/Scope**: Один бот, ~217 md + 83 статьи + OpenAPI; десятки чатов, тысячи сообщений

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router)**: `/chats/[id]` — Server Component для начальной загрузки; Client только для «load more». OpenAI/pgvector — server-only modules.
- **Gate B (TypeScript)**: Явные типы для `ChatMessage`, `KnowledgeChunk`, `AnswerQuestionResult`; zod на API query/body.
- **Gate C (Security)**: `OPENAI_API_KEY` только env; `requireAuth` на history API; ошибки OpenAI/Telegram санитизируются для пользователя; промпт не логировать целиком в prod.
- **Gate D (Testing)**: Unit — `isAddressedToBot`, chunkers, prompt builder; integration — message CRUD, messages API; мок OpenAI в тестах.
- **Gate E (UX)**: Пустое состояние истории; различимые bubble user/bot; ошибка бота — понятный текст в Telegram.

**Post-design**: Нарушений нет. Новая зависимость `openai` и pgvector — обоснованы спекой.

## Project Structure

### Documentation (this feature)

```text
specs/009-bot-qa-rag/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── api.md           # Phase 1
└── tasks.md             # /speckit.tasks
```

### Source Code (repository root)

```text
src/db/migrations/
├── 003_bot_qa_rag.sql
├── 004_chat_message_telegram_user.sql
└── 005_unanswered_messages.sql

src/db/
├── chatMessages.ts       # insert/list/unanswered
├── knowledgeChunks.ts    # vector search, upsert chunks
└── knowledgeIndexRuns.ts # index job status

src/rag/
├── chunkers/
│   ├── markdown.ts
│   ├── csvResources.ts
│   └── openApiYaml.ts
├── embed.ts              # text-embedding-3-small
├── retrieve.ts           # pgvector top-k
├── answer.ts             # GPT-4.1 completion
├── indexKnowledge.ts     # full reindex orchestration
└── prompts.ts            # hasUsableContext, RAG_MAX_DISTANCE

src/telegram/
├── handleUpdate.ts       # extend: async message pipeline
├── updates.ts            # normalize, isAddressedToBot, isHelpIntent, stripBotMention
├── processMessage.ts     # save → answer → send, mark unanswered
├── pollingRunner.ts      # npm run telegram:poll
├── markdownToTelegramHtml.ts
├── botIdentity.ts
└── send.ts               # splitLongMessage, HTML parse_mode

app/api/telegram/webhook/route.ts   # fast 200 + void process

app/api/chats/[id]/messages/route.ts  # NEW

app/api/knowledge/reindex/route.ts    # optional

app/(panel)/chats/
├── page.tsx
├── ChatsTable.tsx        # link to detail
└── [id]/
    ├── page.tsx
    └── ChatHistoryClient.tsx  # anchors, user links, load more

app/(panel)/unanswered/
├── page.tsx
└── UnansweredTable.tsx

src/ui/Sidebar.tsx        # nav: Unanswered

scripts/
└── rag-index.ts          # npm run rag:index

tests/unit/rag/
tests/unit/telegram/
tests/integration/chatMessages.test.ts
```

**Structure Decision**: Домен RAG в `src/rag/`; доступ к БД через `src/db/*`; Telegram pipeline в `src/telegram/`; без отдельного микросервиса.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

No constitution violations expected.

## Phase 0 & 1 Outputs

| Artifact | Path | Status |
|----------|------|--------|
| Research | [research.md](./research.md) | Complete |
| Data model | [data-model.md](./data-model.md) | Complete |
| Contracts | [contracts/api.md](./contracts/api.md) | Complete |
| Quickstart | [quickstart.md](./quickstart.md) | Complete |

## Implementation sequence (for `/speckit.tasks`)

1. **DB**: migration pgvector + tables  
2. **RAG index**: chunkers + `rag:index` CLI + verify chunk count  
3. **RAG query**: embed + retrieve + answer module  
4. **Telegram**: message normalization, addressed detection, async pipeline, idempotency  
5. **API**: `GET /api/chats/[id]/messages`  
6. **UI**: `/chats/[id]` history view + table links  
7. **Tests + env docs**: `.env.example`, README/quickstart  
8. **Optional**: `POST /api/knowledge/reindex`
9. **v1.1**: long polling CLI, `/start`/`/help`, markdown HTML, `stripBotMention`, `RAG_MAX_DISTANCE`, migrations 004–005, `/unanswered`, chat anchors

## Implementation notes (v1.1)

| Area | Detail |
|------|--------|
| Dev ingestion | `npm run telegram:poll` — separate from `npm run dev`; one poller per token |
| Group chats | Privacy mode; `@mention` / reply / command only |
| RAG threshold | `RAG_MAX_DISTANCE=0.62` (cosine distance); tune via env |
| Unanswered | `unanswered_reason` on user message; not set for `/start`, `/help`, successful RAG |
| Telegram format | `markdownToTelegramHtml` → HTML; admin UI shows raw Markdown |
| Doc links | `DOCS_BASE_URL` resolves relative paths in bot answers |

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| pgvector не в образе Postgres | Документировать образ `pgvector/pgvector:pg16`; проверка в migrate |
| Медленный OpenAI | Async webhook; таймаут + fallback message |
| Галлюцинации | Strict system prompt + «не знаю»; SC-005 manual eval |
| Большие ответы | Split messages at 4096 chars |
| Разный ответ с/без `@bot` | `stripBotMentionFromText` + threshold 0.62 |
| Два poller'а на токен | Log `telegram_poll_conflict`; document single-process rule |
