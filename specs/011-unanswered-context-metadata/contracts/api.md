# Contracts: Unanswered context snapshots

**Branch**: `011-unanswered-context-metadata`  
**Date**: 2026-07-05  

## GET `/api/unanswered/[messageId]/context`

**Purpose**: Lazy-load RAG context snapshot for an unanswered user message (FR-006, US2).

**Authentication**: Admin session required (`requireAuth`).

**Path params**:

| Param | Type | Description |
|-------|------|-------------|
| `messageId` | int | `chat_messages.id` of a user message with `unanswered_reason` set |

**Success response** `200`:

```json
{
  "ok": true,
  "data": {
    "messageId": 42,
    "reason": "no_context",
    "createdAt": "2026-07-05T14:30:00.000Z",
    "snapshot": {
      "searchPerformed": true,
      "chunkCount": 6,
      "bestDistance": 0.71,
      "recentMessages": [
        { "role": "user", "content": "Как подключить SDK?" },
        { "role": "bot", "content": "…" }
      ],
      "retrievedChunks": [
        {
          "chunkId": 101,
          "sourceType": "sdk_doc",
          "sourcePath": "sdk-guides/android/how-to-get-started.md",
          "title": "Getting started",
          "content": "…",
          "metadata": { "section": "install" },
          "distance": 0.71
        }
      ]
    }
  }
}
```

When no snapshot exists (legacy row or pre-feature data):

```json
{
  "ok": true,
  "data": {
    "messageId": 42,
    "reason": "no_context",
    "createdAt": "2026-07-05T14:30:00.000Z",
    "snapshot": null
  }
}
```

**Error responses**:

| Status | Condition |
|--------|-----------|
| `401` | Not authenticated |
| `404` | Message not found, or not a user message, or `unanswered_reason` is null |
| `400` | Invalid `messageId` |

**Notes**:

- `reason` and `createdAt` duplicated from message for modal header without extra client state.
- Response MUST NOT include embeddings, API keys, or raw OpenAI request bodies.

---

## Internal write contract (not HTTP)

**Trigger**: `processIncomingMessage` after sending fallback reply.

**Input** (`UnansweredContextSnapshot` + `reason`):

| Field | When |
|-------|------|
| `searchPerformed: false`, empty arrays | `no_knowledge_index`, `not_configured` |
| `searchPerformed: true`, chunks populated | `no_context`, `openai_error` after retrieval |
| `searchPerformed: true`, chunks empty | `openai_error` during embedding |

**Persistence**: `markMessageUnanswered(messageId, reason, snapshot)` → reason update + snapshot insert (idempotent).

---

## UI contract: `/unanswered` modal

**Trigger**: User clicks «View context» (or equivalent) on a table row.

**Client flow**:

1. Open HeroUI Modal with loading state.
2. `fetch('/api/unanswered/${messageId}/context')`.
3. Render sections:
   - **Processing**: reason (human label), `createdAt`, `searchPerformed` badge.
   - **Search summary** (if `searchPerformed`): `chunkCount`, `bestDistance` formatted to 3 decimals.
   - **Retrieved chunks**: accordion or stacked cards — source type, path, title, distance, metadata (JSON pretty), content (clamp + expand).
   - **Dialog context**: list of `recentMessages` with role labels.
4. If `snapshot === null`: message «Снимок контекста недоступен (запись до обновления)».
5. If `searchPerformed === false`: prominent note «Поиск по базе знаний не выполнялся» (distinct from empty search results).

**Table unchanged**: columns When, Question, Reason, Chat, User — no snapshot columns (FR-007).
