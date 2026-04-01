# Research: Broadcast images

**Branch**: `003-broadcast-images`  
**Date**: 2026-04-01  
**Spec**: `./spec.md`  

## Decisions

### 1) How to send 1–10 images to Telegram
- **Decision**: Use Telegram single-media send for **1 image**, and album send for **2–10 images**.
- **Rationale**: Telegram albums (`sendMediaGroup`) require **2–10** items; a single image cannot be sent via album.
- **Alternatives considered**:
  - Always send images one-by-one: would produce multiple messages and breaks the “together as one” user expectation.

### 2) How to attach text to image broadcasts
- **Decision**: Attach the broadcast text as a **caption** (subject to Telegram caption limits). For albums, set caption on the **first** item only.
- **Rationale**: Telegram’s album UX shows a single caption for the group (best-effort; Telegram-specific).
- **Constraints**:
  - Caption is limited to **0–1024 characters** after entities parsing.

### 3) How to transfer images from UI to server
- **Decision**: Extend broadcast creation to accept **multipart form submission** when images are present, while keeping the existing JSON contract for text-only.
- **Rationale**: Images are binary; multipart is a standard approach; preserves backward compatibility for text-only broadcasts.
- **Alternatives considered**:
  - Separate “upload first” endpoint: more moving parts; not required for MVP.

### 4) Persistence strategy for attachments
- **Decision**: Persist **metadata** (count, filenames, mime types, sizes, ordering) and delivery outcomes; do not require persisting original image bytes for v1.
- **Rationale**: History needs to know “images were included” but does not need to re-display content; avoids storage/PII risk and large DB rows.
- **Future extension**: Optionally store Telegram `file_id` returned by successful sends for reuse.

## Notes

- Telegram Bot API references:
  - `sendMediaGroup`: requires **2–10** items.
  - `sendPhoto`: supports photo size limit and caption parsing.

