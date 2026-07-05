# Data model: Unanswered context snapshots

**Branch**: `011-unanswered-context-metadata`  
**Date**: 2026-07-05  

## Migration `006_unanswered_context_snapshots.sql` (proposed)

### Table `unanswered_context_snapshots`

| Column | Type | Meaning |
|--------|------|---------|
| `id` | `bigserial` PK | Surrogate id |
| `chat_message_id` | `bigint` NOT NULL UNIQUE FK → `chat_messages(id)` ON DELETE CASCADE | User message marked unanswered |
| `search_performed` | `boolean` NOT NULL | Whether vector retrieval ran |
| `chunk_count` | `int` NOT NULL DEFAULT 0 | `jsonb_array_length(retrieved_chunks)` denormalized for quick display |
| `best_distance` | `double precision` NULL | Distance of best-ranked chunk; NULL if search not performed or no chunks |
| `recent_messages` | `jsonb` NOT NULL DEFAULT `'[]'` | `[{ "role": "user"\|"bot", "content": string }]` |
| `retrieved_chunks` | `jsonb` NOT NULL DEFAULT `'[]'` | Array of chunk snapshots (see below) |
| `created_at` | `timestamptz` NOT NULL DEFAULT `now()` | Snapshot creation time (≈ message `created_at`) |

**Indexes**:

- `UNIQUE (chat_message_id)` — enforces 1:1 with unanswered user message
- Optional: none on JSONB for v1 (lookup always by `chat_message_id`)

### JSON shape: `retrieved_chunks[]`

| Field | Type | Source |
|-------|------|--------|
| `chunkId` | number | `knowledge_chunks.id` at retrieval time |
| `sourceType` | string | `sdk_doc` \| `console_article` \| `api_spec` |
| `sourcePath` | string | Logical path / key |
| `title` | string \| null | Chunk title |
| `content` | string | Full chunk text used in prompt |
| `metadata` | object \| null | Chunk `metadata` jsonb |
| `distance` | number | pgvector cosine distance |

### JSON shape: `recent_messages[]`

| Field | Type |
|-------|------|
| `role` | `"user"` \| `"bot"` |
| `content` | string |

## Relationships

```text
chats 1──* chat_messages 1──0..1 unanswered_context_snapshots
```

- Snapshot exists only when `chat_messages.unanswered_reason IS NOT NULL` and feature is deployed.
- Historical unanswered rows (pre-migration) have no snapshot row — UI shows «снимок недоступен».

## Application types (TypeScript)

```typescript
type UnansweredRetrievedChunkSnapshot = {
  chunkId: number;
  sourceType: "sdk_doc" | "console_article" | "api_spec";
  sourcePath: string;
  title: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  distance: number;
};

type UnansweredDialogMessage = {
  role: "user" | "bot";
  content: string;
};

type UnansweredContextSnapshot = {
  searchPerformed: boolean;
  chunkCount: number;
  bestDistance: number | null;
  recentMessages: UnansweredDialogMessage[];
  retrievedChunks: UnansweredRetrievedChunkSnapshot[];
};
```

## DB access layer

| Function | Purpose |
|----------|---------|
| `insertUnansweredContextSnapshot(chatMessageId, snapshot)` | Insert once; `ON CONFLICT DO NOTHING` |
| `getUnansweredContextSnapshot(chatMessageId)` | Load for API / admin detail |
| `markMessageUnanswered(id, reason, snapshot?)` | Extend existing: set reason + optional snapshot in one flow |

## Validation rules

- Snapshot insert only when `unanswered_reason` is set on a `role=user` message.
- `chunk_count` MUST equal `retrieved_chunks.length`.
- If `search_performed = false`, `retrieved_chunks` MUST be `[]` and `best_distance` MUST be NULL (FR-008).
- `retrieved_chunks` ordered by ascending `distance` (same as retrieval query).

## State transitions

```text
[user message saved]
       │
       ▼
[bot fallback] ──► unanswered_reason := reason
       │           insert unanswered_context_snapshots (immutable)
       ▼
[admin views /unanswered] ──► list without snapshot payload
       │
       ▼
[admin opens details] ──► GET context by message id
```

No updates or deletes of snapshot content after insert (immutable audit record).
