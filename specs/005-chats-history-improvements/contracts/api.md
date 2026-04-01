# Contracts: Chats and History improvements

**Branch**: `005-chats-history-improvements`  
**Date**: 2026-04-01  

This feature **extends** existing endpoints; authentication rules are unchanged.

## GET `/api/broadcasts/history`

### Purpose

List recent broadcasts for admin tools (optional consumer of same shape as server-rendered history).

### Success response (extended)

```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "created_at": "2026-04-01T12:00:00.000Z",
      "sent_at": "2026-04-01T12:00:01.000Z",
      "status": "sent",
      "recipients_total": 10,
      "success_count": 9,
      "failure_count": 1,
      "attachments_count": 0,
      "error_code_summary": "403" 
    }
  ]
}
```

Notes:

- `content_preview` is **not** returned (removed from list projection).
- `error_code_summary` is the canonical JSON key (snake_case, aligned with `BroadcastListRow` and `GET` response). It is a **string** for display: distinct non-null error codes from failed deliveries; implementation may join with `", "`. Empty when no codes → UI shows `-`.

## GET `/api/broadcasts/[id]`

### Purpose

Full broadcast + per-chat delivery results (unchanged semantics).

### Success response

```json
{
  "ok": true,
  "data": {
    "broadcast": {
      "id": 1,
      "content": "…",
      "format": "html",
      "target_mode": "all",
      "created_at": "…",
      "sent_at": "…",
      "status": "sent",
      "attachments_count": 0
    },
    "deliveries": [
      {
        "chat_id": 1,
        "telegram_chat_id": "…",
        "title": "…",
        "status": "failure",
        "attempt_count": 1,
        "sent_at": "…",
        "error_code": "403",
        "error_message": "…"
      }
    ]
  }
}
```

### Error responses

- `400` — invalid id  
- `404` — broadcast not found  

## GET `/api/chats`

### Purpose

List chats for admin; used by **polling** on `/chats`.

### Success response (unchanged shape)

```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "telegramChatId": "…",
      "title": "…",
      "type": "…",
      "isActive": true,
      "lastSeenAt": "2026-04-01T12:00:00.000Z"
    }
  ]
}
```

Polling clients must send **credentials** (cookies) so `requireAuth` succeeds.
