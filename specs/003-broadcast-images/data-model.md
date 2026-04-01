# Data model: Broadcast images

**Branch**: `003-broadcast-images`  
**Date**: 2026-04-01  
**Spec**: `./spec.md`  

## Overview

This feature adds attachment metadata for broadcast messages.

## Entities

### 1) BroadcastAttachment

Represents one image attached to a broadcast message.

**Fields**:
- `id`: unique identifier
- `broadcast_message_id`: reference to `broadcast_messages.id`
- `ordinal`: integer ordering \(0..9\) for display/sending order
- `original_filename`: original filename as provided by admin client (optional)
- `mime_type`: image mime type (`image/jpeg`, `image/png`, ...)
- `size_bytes`: attachment size in bytes
- `telegram_file_id`: optional identifier returned by Telegram on successful send (for possible future reuse)
- `created_at`: timestamp

**Constraints**:
- `(broadcast_message_id, ordinal)` is unique
- Each `broadcast_message_id` can have 0–10 attachments

### 2) BroadcastMessage (existing)

Broadcast message remains the primary record. No change required for text-only.

**Optional derived metadata**:
- `attachments_count`: derived from `broadcast_attachments` count (can be computed on read)

### 3) DeliveryResult (existing)

Per-chat delivery outcome remains. For image broadcasts, failures/successes are recorded the same way.

## Relationships

```text
broadcast_messages 1 ── * broadcast_attachments
broadcast_messages 1 ── * broadcast_recipients
broadcast_messages 1 ── * delivery_results
```

## Migration notes

- Add a new table `broadcast_attachments` referencing `broadcast_messages`.
- Keep existing tables unchanged for backward compatibility.

