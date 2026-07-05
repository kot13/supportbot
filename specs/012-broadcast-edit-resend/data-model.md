# Data model: Редактирование, повторная отправка и черновики broadcast-рассылки

**Branch**: `012-broadcast-edit-resend`  
**Date**: 2026-07-05  

## Existing entities (unchanged schema)

### `broadcast_messages`

| Field | Role in this feature |
|--------|----------------------|
| `id` | PK; draft id при редактировании черновика |
| `content` | Текст черновика / resend prefill |
| `format` | `html` \| `plain` |
| `target_mode` | `all` \| `subset` |
| `status` | **`draft`** — черновик; `sending` → `completed` при отправке |
| `created_at`, `sent_at` | `sent_at` null для draft |
| `created_by_admin_user_id` | Опционально при create draft |

### `broadcast_recipients`

Записываются при **сохранении черновика** (subset) и при **отправке** (как сейчас). При update draft — replace set (delete + insert).

### `broadcast_attachments`

Метаданные вложений черновика (без бинарников). При update draft — replace set. `telegram_file_id` заполняется только после успешной отправки в Telegram (если понадобится позже).

### `delivery_results`

Только у отправленных рассылок. Используется для `compose?failedOnly=1` (источник chat ids).

## State transitions

### `broadcast_messages.status`

```text
[create draft]     → draft
[draft + send]     → draft → sending → completed
[POST /broadcasts] → draft → sending → completed  (immediate send, unchanged)
[delete draft]     → (row removed)
```

Отправленные записи (`completed`) **не** переходят обратно в `draft` и **не** обновляются при resend.

## Read models

### Broadcast list row (extended usage)

Существующий `BroadcastListRow` + черновики в том же запросе:

| Field | Draft behavior |
|--------|----------------|
| `status` | `draft` |
| `recipients_total` | count `broadcast_recipients` или `-` / 0 для `all` until send |
| `success_count`, `failure_count` | 0 |
| `attachments_count` | count `broadcast_attachments` |
| `sent_at` | null |

### Compose payload (`GET .../compose`)

| Field | Source |
|--------|--------|
| `source_broadcast_id` | param id |
| `content`, `format`, `target_mode` | `broadcast_messages` |
| `chat_ids` | `failedOnly`: `delivery_results` where failure; else `broadcast_recipients` for subset; else `[]` with `target_mode=all` |
| `attachments` | `broadcast_attachments` (metadata only) |
| `skipped_recipients` | chats in source not found in `chats` (deleted) |

### Draft editor state (client)

| Field | Notes |
|--------|--------|
| `draftId` | null для нового compose/resend session |
| `sourceBroadcastId` | для баннера «Based on #N» |
| `content`, `mode`, `selectedIds`, `images`, `videos` | client files for send; metadata synced on save draft |

## Validation rules

| Rule | Draft save | Send |
|------|------------|------|
| Non-empty content OR recipients | required | content required |
| Subset has ≥1 chat | if subset mode | required |
| Content length | optional warn in UI | 1024/2048 per media |
| Images XOR videos | on save metadata | on send |

## Migration

**None required** for v1. Optional follow-up: partial index `broadcast_messages(status) where status = 'draft'` if list grows large.
