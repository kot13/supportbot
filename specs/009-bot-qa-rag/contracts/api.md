# Contracts: Bot Q&A with RAG (admin + internal)

**Branch**: `009-bot-qa-rag`  
**Date**: 2026-07-05  

## GET `/api/chats/[id]/messages`

**Purpose**: Paginated chat message history for admin panel (US3, FR-006–007).

**Authentication**: Admin session required (`requireAuth`).

**Path params**:

- `id` — internal `chats.id` (bigint)

**Query params**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | int | `50` | Max 100 |
| `before` | int | — | Return messages with `id < before` (older page) |

**Success response** `200`:

```json
{
  "ok": true,
  "data": {
    "chat": {
      "id": 1,
      "telegramChatId": "-100123",
      "title": "Support group",
      "type": "supergroup",
      "isActive": true
    },
    "messages": [
      {
        "id": 10,
        "role": "user",
        "content": "Как подключить SDK на Android?",
        "telegramMessageId": 42,
        "telegramUserId": 123456789,
        "telegramUsername": "pavel",
        "telegramUserFirstName": "Pavel",
        "createdAt": "2026-07-05T10:00:00.000Z"
      },
      {
        "id": 11,
        "role": "bot",
        "content": "Для подключения SDK…",
        "telegramMessageId": 43,
        "createdAt": "2026-07-05T10:00:05.000Z"
      }
    ],
    "nextBefore": 10
  }
}
```

- `nextBefore` — pass as `before` to load older messages; omitted when no more.

**Error responses**:

- `404` — chat not found: `{ "ok": false, "error": { "code": "NOT_FOUND", "message": "…" } }`
- `401` — not authenticated

**Notes**:

- Messages ordered **ascending** by `created_at` within the returned page (oldest first in batch).
- UI loads latest page first (implementation may query `ORDER BY id DESC LIMIT` then reverse for display).

---

## GET `/unanswered` (admin page, not JSON API)

**Purpose**: Список вопросов с `unanswered_reason` (FR-017). Реализовано как Server Component `app/(panel)/unanswered/page.tsx` + `listUnansweredMessages()`; отдельный REST endpoint в v1 **не** требуется.

**Row fields** (projection): `id`, `chatId`, `content`, `reason`, `createdAt`, `chatTitle`, `chatType`, `telegramUserId`, `telegramUsername`, `telegramUserFirstName`.

**Link to chat**: `/chats/{chatId}#message-{id}`.

---

## POST `/api/knowledge/reindex` (optional v1, recommended)

**Purpose**: Trigger full knowledge base reindex from filesystem sources (FR-011).

**Authentication**: Admin session required.

**Request**: empty body or `{}`

**Success response** `202`:

```json
{
  "ok": true,
  "data": {
    "runId": 3,
    "status": "running"
  }
}
```

**Error response** `409` — reindex already running.

**Notes**:

- Long-running; client polls logs or `knowledge_index_runs` (no public poll endpoint required in v1).
- CLI `npm run rag:index` is the canonical operator path if UI omitted.

---

## POST `/api/telegram/webhook` (extended behavior)

**Purpose**: Ingest Telegram updates; **existing** contract unchanged for HTTP shape.

**New internal behavior** (not in response body):

1. Validate secret header (existing).
2. Return `{ "ok": true }` immediately.
3. Async: upsert chat → if text message addressed to bot → persist → RAG answer → persist bot message → `sendMessage`.

**Idempotency**: Same `update_id` processed once.

---

## Internal modules (not HTTP)

### `processIncomingMessage(update)`

**Input**: Parsed Telegram update  
**Output**: void  
**Side effects**: DB writes, OpenAI calls, Telegram send

### `answerQuestion(input)`

```ts
type AnswerQuestionInput = {
  chatId: number;           // internal chats.id
  question: string;
  recentMessages: Array<{ role: "user" | "bot"; content: string }>;
};

type AnswerQuestionResult =
  | { ok: true; answer: string }
  | { ok: false; reason: "no_context" | "openai_error" | "not_configured"; message: string };
```

### `indexKnowledgeSources()`

Reads `data/docs-master/docs`, `data/resources.csv`, `data/inappstory-pub-api-v1.yaml`; upserts `knowledge_chunks`.

---

## Environment variables (new)

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes (for Q&A) | OpenAI API key |
| `RAG_TOP_K` | No | Default `6` |
| `RAG_MAX_DISTANCE` | No | Max cosine distance for usable context; default `0.62` |
| `CHAT_CONTEXT_LIMIT` | No | Default `10` messages |
| `TELEGRAM_BOT_USERNAME` | No | Override for @mention detection |
| `DOCS_BASE_URL` | No | Base for relative doc links in bot answers; default `https://docs.inappstory.com` |

Existing: `DATABASE_URL`, `TELEGRAM_WEBHOOK_SECRET`, bot token in DB.
