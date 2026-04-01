# Data model: Chat management

**Branch**: `006-chat-management`  
**Date**: 2026-04-01  

## Table `chats` (existing)

| Column | Meaning |
|--------|---------|
| `id` | Surrogate PK |
| `telegram_chat_id` | Telegram chat id (unique) |
| `title` | Display name when available |
| `type` | e.g. private, group, supergroup, channel |
| `is_active` | Bot considered able to act in chat (for targeting); **must** reflect leave/kick when derived from updates |
| `last_seen_at` | Last activity / upsert time |

**Migrations**: None required for v1 if only logic changes for `is_active` and webhook registration does not persist URL.

## Table `bot_settings` (existing)

| Column | Meaning |
|--------|---------|
| `bot_token_secret` | Token for Bot API calls (never exposed to client) |
| `bot_name` | Display |

**Optional later**: `last_webhook_url text null` — only if product wants to show last registered URL; **not required** by current spec (manual entry each time).

## External mapping

- One Telegram chat ↔ at most one `chats` row (`telegram_chat_id` unique).
- Webhook binding: logical state at Telegram servers; optional echo of last URL only if stored.

## API / UI projection

- Admin list: `GET /api/chats` — `isActive` semantics per FR-005.
- Bot settings: manual webhook URL field + register action → see `contracts/api.md`.
