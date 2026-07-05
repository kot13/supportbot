# Data model: Bot model settings & index status

**Branch**: `013-bot-model-settings`  
**Date**: 2026-07-05  

## Migration `007_bot_model_settings.sql` (proposed)

### Alter `bot_settings`

| Column | Type | Default | Constraint |
|--------|------|---------|------------|
| `answer_model` | `text` NOT NULL | `'gpt-4.1'` | CHECK in (`gpt-4.1`, `gpt-5.5`) |
| `embedding_model` | `text` NOT NULL | `'text-embedding-3-small'` | CHECK in (`text-embedding-3-small`, `text-embedding-3-large`) |

Existing rows (singleton `id = 1`) получают дефолты при `ADD COLUMN`.

### Alter `knowledge_index_runs`

| Column | Type | Meaning |
|--------|------|---------|
| `embedding_model` | `text` NULL | Модель эмбеддингов, использованная при успешном завершении run |

Заполняется только при `status = 'completed'`. Исторические completed run без значения интерпретируются как `text-embedding-3-small` в прикладном коде.

## Entity: Bot settings (extended)

| Field | Source | Notes |
|-------|--------|-------|
| `bot_name` | `bot_settings.bot_name` | unchanged |
| `bot_token_secret` | `bot_settings.bot_token_secret` | never returned from API |
| `answer_model` | `bot_settings.answer_model` | default `gpt-4.1` |
| `embedding_model` | `bot_settings.embedding_model` | default `text-embedding-3-small` |

## Entity: Knowledge index run (extended)

| Field | Source | Notes |
|-------|--------|-------|
| `id` | PK | unchanged |
| `status` | `running` \| `completed` \| `failed` | unchanged |
| `chunk_count` | int | set on complete |
| `error_message` | text | set on fail |
| `embedding_model` | text | set on complete only |
| `started_at` / `finished_at` | timestamptz | unchanged |

## Computed: Knowledge index status (not persisted)

Returned by `GET /api/knowledge/index-status`:

| Field | Type | Description |
|-------|------|-------------|
| `state` | enum | `never_indexed` \| `current` \| `outdated` \| `running` \| `failed` |
| `currentEmbeddingModel` | string | from `bot_settings` |
| `indexedEmbeddingModel` | string \| null | from last completed run |
| `lastCompletedAt` | ISO string \| null | `finished_at` last completed |
| `lastChunkCount` | number \| null | from last completed |
| `runningStartedAt` | ISO string \| null | if `state = running` |
| `lastError` | string \| null | sanitized message from last failed run (optional display) |

### State transitions

```text
never_indexed ──reindex success──► current
current ──change embedding_model──► outdated (logical; index rows unchanged until reindex)
outdated ──reindex start──► running
running ──success──► current
running ──fail──► failed (index may be empty or partial per existing clear+rebuild strategy)
failed ──reindex retry──► running
```

**Note**: `indexKnowledge()` по-прежнему делает `clearKnowledgeChunks()` в начале — при fail после clear бот может временно видеть `never_indexed` до успешного reindex.

## Application types (TypeScript)

```typescript
type AnswerModel = "gpt-4.1" | "gpt-5.5";
type EmbeddingModel = "text-embedding-3-small" | "text-embedding-3-large";

type BotSettingsRow = {
  bot_name: string | null;
  bot_token_secret: string | null;
  answer_model: AnswerModel;
  embedding_model: EmbeddingModel;
};

type KnowledgeIndexState =
  | "never_indexed"
  | "current"
  | "outdated"
  | "running"
  | "failed";
```

## Validation rules

- API PUT: `answerModel` / `embeddingModel` optional; invalid enum → 400 `VALIDATION`.
- DB CHECK constraints as backstop.
- Reindex POST: 409 `CONFLICT` if any run `status = 'running'`.

## Relationships

```text
bot_settings (singleton)
    └── embedding_model compared with ──► knowledge_index_runs (last completed.embedding_model)

knowledge_chunks.embedding ── built using ──► bot_settings.embedding_model at index time
```
