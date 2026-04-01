# Data model: Chats and History improvements

**Branch**: `005-chats-history-improvements`  
**Date**: 2026-04-01  

## Existing entities (unchanged schema)

### `broadcast_messages`

Core broadcast record: content, format, target mode, status, timestamps.

### `delivery_results`

Per `(broadcast_message_id, chat_id)` outcome: `status`, `attempt_count`, `sent_at`, `error_code`, `error_message`.

### `chats`

Known Telegram chats: `telegram_chat_id`, `title`, `type`, `is_active`, `last_seen_at`.

## Read models

### Broadcast list row (history table)

Extends the current list projection:

| Field | Source | Notes |
|--------|--------|--------|
| `id`, `created_at`, `sent_at`, `status` | `broadcast_messages` | As today |
| `recipients_total`, `success_count`, `failure_count`, `attachments_count` | aggregates | As today |
| ~~`content_preview`~~ | — | **Removed** from list |
| `error_code_summary` | aggregate over `delivery_results` | Distinct `error_code` from failed deliveries, concatenated for display; null/empty → UI `-` |

### Broadcast details (details page + API)

- **Broadcast**: Full `content`, `format`, `target_mode`, `status`, timestamps, attachment count (existing `BroadcastDetailsRow`).
- **Deliveries**: Per chat: `telegram_chat_id`, `title`, `status`, attempts, `sent_at`, `error_code`, `error_message` (existing `BroadcastDeliveryRow`).

### Chats list row

Unchanged columns from `listChats`; polling only refreshes the same shape from `GET /api/chats`.

## Migration

No new tables or columns required for this feature if aggregation is done in SQL over existing `delivery_results.error_code`.
