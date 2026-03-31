# Data Model: Telegram bot broadcast panel

**Branch**: `001-telegram-broadcast-panel`  
**Date**: 2026-03-31  
**Spec**: `./spec.md`  

## Entities

### 1) AdminUser
Represents a user who can sign in to the admin panel.

- **Fields**
  - `id` (internal identifier)
  - `login` (unique)
  - `password_secret` (securely stored secret for verification; never returned to client)
  - `created_at`, `updated_at`
  - `disabled_at` (optional)
- **Validation rules**
  - `login` required, unique
  - `password_secret` required

### 2) BotSettings
Represents the Telegram bot configuration.

- **Fields**
  - `id` (single row for v1)
  - `bot_name`
  - `bot_token_secret` (sensitive; must not be exposed to clients/logs)
  - `created_at`, `updated_at`
- **Validation rules**
  - `bot_token_secret` required for sending broadcasts
  - `bot_name` optional (display only), or required if used in UI branding (v1: optional)

### 3) Chat
Represents a Telegram chat where the bot is present.

- **Fields**
  - `id` (internal identifier)
  - `telegram_chat_id` (unique, required)
  - `title` (display name; best-effort)
  - `type` (private/group/supergroup/channel where applicable)
  - `is_active` (true if bot is currently present; false if removed, optional but useful)
  - `last_seen_at` (timestamp of latest update)
  - `created_at`, `updated_at`
- **Validation rules**
  - `telegram_chat_id` required, unique

### 4) BroadcastMessage
Represents a composed message and a send operation.

- **Fields**
  - `id` (internal identifier)
  - `content` (the authored message)
  - `format` (e.g., html/plain; v1 default: html)
  - `target_mode` (`all` or `subset`)
  - `created_by_admin_user_id` (optional if single-admin system; recommended)
  - `created_at`
  - `sent_at` (set when dispatch starts or completes; choose consistent semantics)
  - `status` (draft/sending/completed/failed; optional but improves UX)
- **Validation rules**
  - `content` required, non-empty
  - `format` must be one of allowed values
  - If `target_mode = subset`, then at least one recipient must be specified

### 5) BroadcastRecipient
Maps a broadcast to its intended recipients.

- **Fields**
  - `id`
  - `broadcast_message_id`
  - `chat_id`
  - `created_at`
- **Constraints**
  - Unique (`broadcast_message_id`, `chat_id`) to prevent duplicate recipients within a single broadcast

### 6) DeliveryResult
Outcome of sending a broadcast to a specific chat.

- **Fields**
  - `id`
  - `broadcast_message_id`
  - `chat_id`
  - `status` (success/failure)
  - `attempt_count`
  - `sent_at`
  - `telegram_message_id` (optional, if available)
  - `error_code` (optional)
  - `error_message` (sanitized, admin-friendly)
- **Constraints**
  - Unique (`broadcast_message_id`, `chat_id`)

## Relationships

- `AdminUser (1) -> (N) BroadcastMessage` (optional if tracking author)
- `BroadcastMessage (1) -> (N) BroadcastRecipient`
- `BroadcastMessage (1) -> (N) DeliveryResult`
- `Chat (1) -> (N) BroadcastRecipient`
- `Chat (1) -> (N) DeliveryResult`

## State Transitions

### BroadcastMessage.status (if used)
- `draft` → `sending` → `completed`
- `sending` → `failed` (only if the broadcast cannot proceed at all; partial failures still allow `completed` with mixed per-chat outcomes)

## Data Retention (v1 default)
- Keep chats and broadcast history indefinitely unless an explicit retention policy is later introduced.
- Keep error details **sanitized** (no tokens, no raw stack traces, no PII beyond chat title/id).
