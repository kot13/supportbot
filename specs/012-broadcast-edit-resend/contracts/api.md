# Contracts: Редактирование, повторная отправка и черновики broadcast-рассылки

**Branch**: `012-broadcast-edit-resend`  
**Date**: 2026-07-05  

Authentication: `requireAuth` on all routes (unchanged).

## GET `/api/broadcasts/history`

Unchanged shape. Draft rows included with `status: "draft"`, `sent_at: null`, delivery counts 0.

---

## GET `/api/broadcasts/[id]`

Existing details endpoint. For drafts: `deliveries` empty array; `broadcast.status` = `draft`.

---

## GET `/api/broadcasts/[id]/compose`

### Purpose

Prefill editor for **resend** or **retry failed** without creating a DB row.

### Query parameters

| Param | Type | Default | Description |
|--------|------|---------|-------------|
| `failedOnly` | `0` \| `1` | `0` | If `1`, preselect only chats with failed deliveries |

### Success `200`

```json
{
  "ok": true,
  "data": {
    "source_broadcast_id": 42,
    "content": "<b>Hello</b>",
    "format": "html",
    "target_mode": "subset",
    "chat_ids": [1, 3],
    "attachments": [
      {
        "ordinal": 0,
        "original_filename": "promo.png",
        "mime_type": "image/png",
        "size_bytes": 12000
      }
    ],
    "skipped_recipients": 0
  }
}
```

### Errors

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION` | Invalid id |
| 404 | `NOT_FOUND` | Broadcast missing |
| 400 | `NO_FAILURES` | `failedOnly=1` but no failed deliveries |

---

## POST `/api/broadcasts/drafts`

### Purpose

Create a new draft.

### Request (JSON)

```json
{
  "content": "Partial text",
  "format": "html",
  "targetMode": "subset",
  "chatIds": [1, 2],
  "attachmentMeta": [
    { "originalFilename": "a.png", "mimeType": "image/png", "sizeBytes": 1000 }
  ]
}
```

`attachmentMeta` optional; no file bytes.

### Success `201`

```json
{
  "ok": true,
  "data": { "id": 99 }
}
```

### Errors

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION` | Empty form (no text and no recipients) |

---

## PATCH `/api/broadcasts/[id]`

### Purpose

Update existing **draft** only.

### Request

Same body as `POST /api/broadcasts/drafts`.

### Success `200`

```json
{
  "ok": true,
  "data": { "id": 99 }
}
```

### Errors

| Status | Code | When |
|--------|------|------|
| 404 | `NOT_FOUND` | Missing |
| 409 | `NOT_DRAFT` | `status !== draft` |
| 400 | `VALIDATION` | Empty form |

---

## POST `/api/broadcasts/[id]/send`

### Purpose

Send an existing draft (same record transitions to sent).

### Request

Same as existing `POST /api/broadcasts`: JSON or `multipart/form-data` with `content`, `targetMode`, `chatIds`, optional `images` / `videos`.

### Success `200`

```json
{
  "ok": true,
  "data": {
    "id": 99,
    "summary": {
      "successCount": 10,
      "failureCount": 0,
      "recipientsTotal": 10
    }
  }
}
```

### Errors

| Status | Code | When |
|--------|------|------|
| 409 | `NOT_DRAFT` | Not a draft |
| 400 | `VALIDATION` | Send validation (content, recipients, length) |

---

## DELETE `/api/broadcasts/[id]`

### Purpose

Delete draft with confirmation done in UI.

### Success `200`

```json
{
  "ok": true,
  "data": { "id": 99 }
}
```

### Errors

| Status | Code | When |
|--------|------|------|
| 404 | `NOT_FOUND` | Missing |
| 409 | `NOT_DRAFT` | Cannot delete sent broadcast |

---

## POST `/api/broadcasts` (existing)

Unchanged for **immediate send** without prior draft (resend session without save → new row on confirm send).

Optional future: accept `sourceBroadcastId` in response only (logging), not required for v1.

---

## UI routes

| Route | Purpose |
|--------|---------|
| `/broadcast?from={id}` | Resend prefill |
| `/broadcast?from={id}&failedOnly=1` | Retry failed prefill |
| `/broadcast?draftId={id}` | Open draft for edit |

Server page passes searchParams to `BroadcastClient` initial loader.
