# Contracts: Bot model settings & knowledge index status

**Branch**: `013-bot-model-settings`  
**Date**: 2026-07-05  

## GET `/api/bot-settings` (extended)

**Authentication**: Admin session (`requireAuth`).

**Success** `200`:

```json
{
  "ok": true,
  "data": {
    "botName": "supportbot",
    "tokenSet": true,
    "answerModel": "gpt-4.1",
    "embeddingModel": "text-embedding-3-small"
  }
}
```

- `answerModel`: `gpt-4.1` | `gpt-5.5`
- `embeddingModel`: `text-embedding-3-small` | `text-embedding-3-large`
- Token secret never returned.

---

## PUT `/api/bot-settings` (extended)

**Body** (all fields optional except at least one change):

```json
{
  "botName": "supportbot",
  "botToken": "123:ABC…",
  "answerModel": "gpt-5.5",
  "embeddingModel": "text-embedding-3-large"
}
```

**Validation**:

- `answerModel` ∈ allowed answer models
- `embeddingModel` ∈ allowed embedding models
- Token still required in DB after merge (existing rule)

**Success** `200`:

```json
{
  "ok": true,
  "data": {
    "botName": "supportbot",
    "tokenSet": true,
    "answerModel": "gpt-5.5",
    "embeddingModel": "text-embedding-3-large",
    "embeddingModelChanged": true
  }
}
```

- `embeddingModelChanged`: `true` if `embedding_model` value changed vs previous row (for client warning FR-007).

**Errors**: `400 VALIDATION` — invalid model or missing token after update.

---

## GET `/api/knowledge/index-status` (new)

**Purpose**: Статус индекса для блока на странице настроек бота + polling во время reindex (FR-016–FR-019).

**Authentication**: `requireAuth`.

**Success** `200`:

```json
{
  "ok": true,
  "data": {
    "state": "outdated",
    "currentEmbeddingModel": "text-embedding-3-large",
    "indexedEmbeddingModel": "text-embedding-3-small",
    "lastCompletedAt": "2026-07-05T14:30:00.000Z",
    "lastChunkCount": 842,
    "runningStartedAt": null,
    "lastError": null
  }
}
```

**`state` values**:

| Value | Meaning |
|-------|---------|
| `never_indexed` | No successful index or zero chunks |
| `current` | Last successful index used same embedding model as settings |
| `outdated` | Settings embedding model ≠ indexed model |
| `running` | Reindex in progress |
| `failed` | Last run failed and no newer completed (optional UX; may collapse to `outdated`/`never_indexed` if chunks cleared) |

---

## POST `/api/knowledge/reindex` (existing, unchanged contract)

**Purpose**: Запуск полной переиндексации из UI (FR-012, FR-014).

**Authentication**: `requireAuth`.

**Success** `202`:

```json
{
  "ok": true,
  "data": { "status": "running" }
}
```

**Error** `409 CONFLICT` — reindex already running.

**Behavior change (implementation)**: `indexKnowledge()` reads `embedding_model` from `bot_settings` and records it on `completeIndexRun`.

---

## Internal modules (not HTTP)

### `embedTexts(texts, { model })`

Uses `bot_settings.embedding_model` when model not passed; always `dimensions: 1536`.

### `answerQuestion({ …, answerModel? })`

Uses `bot_settings.answer_model` when not passed.

### CLI `npm run rag:index`

Calls `indexKnowledge()` — same path as API reindex.

---

## Environment variables

No new required env vars. Existing:

| Variable | Required | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | Yes for RAG | unchanged |
| `RAG_TOP_K`, `RAG_MAX_DISTANCE`, `CHAT_CONTEXT_LIMIT` | No | unchanged |

Model selection is **DB-backed**, not env.
