# Contracts: Chat management (admin)

**Branch**: `006-chat-management`  
**Date**: 2026-04-01  

## GET `/api/chats`

**Purpose**: List chats known to the system for the admin panel (and polling client).

**Authentication**: Admin session required.

**Success response**:

```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "telegramChatId": "…",
      "title": "…",
      "type": "supergroup",
      "isActive": true,
      "lastSeenAt": "2026-04-01T12:00:00.000Z"
    }
  ]
}
```

**Notes**:

- `isActive: false` when bot left/kicked or equivalent, per FR-005.
- Rows are upserted from processed Telegram updates, not via this endpoint.

---

## POST `/api/bot-settings/webhook`

**Purpose**: Register the Telegram webhook URL via Bot API `setWebhook` (US4, FR-006). Canonical route for this project.

**Authentication**: Admin session required.

**Request**:

```json
{
  "url": "https://example.com/api/telegram/webhook"
}
```

- `url` MUST be a full HTTPS URL (validation on server).
- Spec **does not** require auto-filled URL; admin enters full URL manually.

**Success response**:

```json
{
  "ok": true,
  "data": {
    "registered": true
  }
}
```

**Error response** (example):

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION | TELEGRAM | …",
    "message": "Human-readable, no secrets"
  }
}
```

**Notes**:

- If `TELEGRAM_WEBHOOK_SECRET` is configured, implementation SHOULD pass the corresponding `secret_token` to `setWebhook` so `POST /api/telegram/webhook` can validate `X-Telegram-Bot-Api-Secret-Token`.
- Response MUST NOT include the bot token or raw Telegram URLs containing the token.

---

## GET/PUT `/api/bot-settings`

**Purpose**: Unchanged — load/save bot name and token; never returns raw token in GET.

---

## Telegram webhook `POST /api/telegram/webhook`

**Purpose**: Ingest Telegram `Update` JSON; upsert `chats` with improved `is_active` handling.

**Authentication**: Optional `X-Telegram-Bot-Api-Secret-Token` when `TELEGRAM_WEBHOOK_SECRET` is set.

Behavioral change only (no response shape change required for this feature).
