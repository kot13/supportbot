# Data model: Bot Q&A with RAG

**Branch**: `009-bot-qa-rag`  
**Date**: 2026-07-05  

## Migration `003_bot_qa_rag.sql` (proposed)

### Extension

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Table `chat_messages`

| Column | Type | Meaning |
|--------|------|---------|
| `id` | `bigserial` PK | Surrogate id |
| `chat_id` | `bigint` NOT NULL FK → `chats(id)` ON DELETE CASCADE | Owning chat |
| `role` | `text` NOT NULL | `user` \| `bot` |
| `content` | `text` NOT NULL | Message body (plain text / Markdown from bot) |
| `telegram_message_id` | `bigint` NULL | Telegram `message_id` when known |
| `telegram_user_id` | `bigint` NULL | Sender user id for `role=user` |
| `created_at` | `timestamptz` NOT NULL DEFAULT `now()` | When recorded |

**Indexes**:

- `(chat_id, created_at DESC)` — history listing
- `UNIQUE (chat_id, telegram_message_id)` WHERE `telegram_message_id IS NOT NULL` — dedupe user messages

**Rules**:

- Every addressed user message and every bot reply MUST be inserted (FR-004).
- Bot messages: `role=bot`, `telegram_user_id` NULL.

### Migration `004_chat_message_telegram_user.sql`

| Column | Type | Meaning |
|--------|------|---------|
| `telegram_username` | `text` NULL | Sender `@username` for `role=user` |
| `telegram_user_first_name` | `text` NULL | Sender first name for display in admin UI |

### Migration `005_unanswered_messages.sql`

| Column | Type | Meaning |
|--------|------|---------|
| `unanswered_reason` | `text` NULL | Set on `role=user` when bot could not give a grounded answer: `no_context`, `no_knowledge_index`, `openai_error`, `not_configured` |

**Index**: partial `(created_at DESC) WHERE role = 'user' AND unanswered_reason IS NOT NULL` — list `/unanswered`.

### Table `knowledge_chunks`

| Column | Type | Meaning |
|--------|------|---------|
| `id` | `bigserial` PK | Chunk id |
| `source_type` | `text` NOT NULL | `sdk_doc` \| `console_article` \| `api_spec` |
| `source_path` | `text` NOT NULL | Relative path or logical key (e.g. `sdk-guides/android/how-to-get-started.md`, `resources.csv#11`, `GET /v1/stories`) |
| `title` | `text` NULL | Human title / operation summary |
| `content` | `text` NOT NULL | Text used for embedding and retrieval |
| `content_hash` | `text` NOT NULL | SHA-256 of `content` for change detection |
| `embedding` | `vector(1536)` NOT NULL | text-embedding-3-small |
| `metadata` | `jsonb` NULL | Extra (category, tags, openapi operationId, …) |
| `created_at` | `timestamptz` NOT NULL DEFAULT `now()` | |
| `updated_at` | `timestamptz` NOT NULL DEFAULT `now()` | |

**Indexes**:

- `UNIQUE (source_type, source_path, content_hash)` — avoid duplicate inserts on reindex
- HNSW on `embedding vector_cosine_ops`

### Table `knowledge_index_runs`

| Column | Type | Meaning |
|--------|------|---------|
| `id` | `bigserial` PK | Run id |
| `status` | `text` NOT NULL | `running` \| `completed` \| `failed` |
| `chunk_count` | `int` NULL | Chunks written |
| `error_message` | `text` NULL | Sanitized error on failure |
| `started_at` | `timestamptz` NOT NULL DEFAULT `now()` | |
| `finished_at` | `timestamptz` NULL | |

### Table `processed_telegram_updates`

| Column | Type | Meaning |
|--------|------|---------|
| `update_id` | `bigint` PK | Telegram `update_id` |
| `processed_at` | `timestamptz` NOT NULL DEFAULT `now()` | |

Prevents double-processing of the same update (retries).

## Existing tables (unchanged structure)

### `chats`

Used as parent for `chat_messages`. Upsert logic from 006 remains; `last_seen_at` updated on each message.

### `bot_settings`

Token for `sendMessage`; no schema change. Bot username for @mention — from `getMe` cache, not stored in v1.

## Entity relationships

```text
chats 1 ── * chat_messages
knowledge_chunks (standalone, no FK to chats)
knowledge_index_runs (audit of index jobs)
processed_telegram_updates (idempotency)
```

## Validation rules

- `chat_messages.role` ∈ {`user`, `bot`}
- `knowledge_chunks.source_type` ∈ {`sdk_doc`, `console_article`, `api_spec`}
- `content` max length: 32_000 chars per row (truncate with log if chunker exceeds)
- Embeddings MUST be dimension 1536

## API / UI projections

| UI / API | Source |
|----------|--------|
| Chat list `/chats` | `chats` (existing) |
| Chat detail `/chats/[id]` | `chats` + `chat_messages` paginated; anchors `#message-{id}` |
| Unanswered list `/unanswered` | `chat_messages` WHERE `unanswered_reason IS NOT NULL` JOIN `chats` |
| RAG retrieval | `knowledge_chunks` by vector similarity |
