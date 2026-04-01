# Contracts: Broadcast images API

**Branch**: `003-broadcast-images`  
**Date**: 2026-04-01  

## POST `/api/broadcasts`

### Purpose

Create and send a broadcast message to all or selected chats.

### Authentication

Requires an authenticated admin session.

### Request (text-only, backward compatible)

- **Content-Type**: `application/json`

Body:

```json
{
  "content": "string",
  "format": "html",
  "targetMode": "all",
  "chatIds": [1, 2, 3]
}
```

### Request (with images)

- **Content-Type**: `multipart/form-data`

Fields:
- `content`: string (required)
- `format`: `html` | `plain` (optional; default `html`)
- `targetMode`: `all` | `subset` (optional; default `all`)
- `chatIds`: JSON string of number array (required when `targetMode=subset`), e.g. `[1,2,3]`
- `images`: 1–10 image files (each file must be an image mime type)

Notes:
- The server must validate:
  - image count \(1–10\)
  - each file is an image
- When `targetMode=subset`, `chatIds` MUST be provided as a JSON array string.
- Text-only behavior must remain unchanged when no `images` are supplied.

### Success Response

```json
{
  "ok": true,
  "data": {
    "id": 123,
    "summary": {
      "successCount": 3,
      "failureCount": 1,
      "recipientsTotal": 4
    }
  }
}
```

### Error Response

```json
{
  "ok": false,
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## GET `/api/broadcasts/history`

### Notes for this feature

History items should include a way to tell that images were attached (e.g., `attachmentsCount`), without returning raw file data.

