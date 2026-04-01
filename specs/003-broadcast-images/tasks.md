---
description: "Actionable task list for implementing the feature"
---

# Tasks: Broadcast images

**Input**: Design documents from `/specs/003-broadcast-images/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/api.md`

**Organization**: Tasks grouped by user story and execution phases. Prefer safe increments with clear checkpoints.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1/US2/US3
- Include exact file paths in descriptions

---

## Phase 1: Database & persistence foundations (Blocking)

**Purpose**: Persist attachment metadata and keep history inspectable.

- [x] T001 Add DB migration for `broadcast_attachments` table in `src/db/migrations/002_broadcast_attachments.sql`
- [x] T002 Wire migration runner to include new migration (verify ordering) in `src/db/migrate.ts`
- [x] T003 [P] Add DB helper module for attachments in `src/db/broadcastAttachments.ts` (insert/list by `broadcast_message_id`)
- [x] T004 [P] Extend broadcast history query to return `attachmentsCount` in `src/db/broadcasts.ts` and `app/api/broadcasts/history/route.ts`
- [x] T005 [P] Update broadcast details API (`/api/broadcasts/[id]`) to include `attachmentsCount` (and optionally list attachment metadata) in `app/api/broadcasts/[id]/route.ts`

**Checkpoint**: Migration runs cleanly; history API can report `attachmentsCount`.

---

## Phase 2: Telegram sending support (Blocking)

**Purpose**: Add the ability to send single-photo and album (2–10) messages.

- [x] T006 Add Telegram API helper for `sendPhoto` in `src/telegram/sendPhoto.ts` (supports caption + parse mode)
- [x] T007 Add Telegram API helper for `sendMediaGroup` in `src/telegram/sendMediaGroup.ts` (2–10 images, caption on first item only)
- [x] T008 Add a higher-level adapter `sendTelegramBroadcast` in `src/telegram/sendBroadcast.ts` that chooses:
  - text-only → existing `sendTelegramMessage`
  - 1 image → `sendPhoto` (caption = text)
  - 2–10 images → `sendMediaGroup` (caption on first image)
- [x] T009 Ensure errors are mapped consistently via `src/telegram/errors.ts` (use numeric Telegram error_code as string; keep message short)

**Checkpoint**: Telegram adapter supports text, 1 photo, and 2–10 photo albums.

---

## Phase 3: API contract & validation (US1/US2)

**Purpose**: Keep JSON contract for text-only, add multipart for images.

- [x] T010 [US1] Implement multipart handling for `POST /api/broadcasts` in `app/api/broadcasts/route.ts`
  - Accept `content`, `format`, `targetMode`, `chatIds`, `images[]`
  - Validate `images` count 1–10 when present
  - Validate mime type starts with `image/`
- [x] T010a [US1] Finalize multipart field contract in `specs/003-broadcast-images/contracts/api.md` and align UI request builder accordingly (define exact `chatIds` encoding)
- [x] T011 [US2] Add clear user-facing errors for validation failures (limit exceeded / non-image / missing content) in the same route
- [x] T012 [US1] Persist attachment metadata for a new broadcast before sending in `src/db/broadcastAttachments.ts` + `src/domain/broadcast/sendBroadcast.ts`
- [x] T013 [US1] Extend `src/domain/broadcast/sendBroadcast.ts` to pass attachment info to the Telegram adapter and to persist delivery results as today

**Checkpoint**: API supports both JSON (text-only) and multipart (with images); attachments metadata stored.

---

## Phase 4: Admin UI (US1/US2)

**Purpose**: Let admin attach, preview, remove images; enforce 1–10 limit; show helpful feedback.

- [x] T014 [US1] Add image picker UI to `app/(panel)/broadcast/BroadcastClient.tsx`
  - Attach 1–10 images
  - Remove selected image
  - Show count (e.g., “Images: 3/10”)
- [x] T015 [US2] Add client-side validation and error messaging for:
  - adding 11th image
  - non-image file selection
  - oversized files (best-effort; show generic “file too large”)
- [x] T016 [US1] Update send request logic to use multipart when images are present (keep JSON when none)
- [x] T017 [US2] Keep UX responsive while selecting 10 images (no blocking renders; show thumbnails or filenames)

**Checkpoint**: Admin can send broadcasts with images from UI and receives clear validation feedback.

---

## Phase 5: History UX (US3)

**Purpose**: Indicate that a broadcast contained images.

- [x] T018 [US3] Update `/broadcast/history` UI to display `attachmentsCount` in `app/(panel)/broadcast/history/page.tsx` and `app/(panel)/broadcast/history/BroadcastHistoryTable.tsx`
- [x] T019 [US3] Update any broadcast preview text to avoid showing raw binary placeholders; include e.g. “+3 images”

**Checkpoint**: History shows attachment metadata.

---

## Phase 6: Tests & polish

**Purpose**: Guard regressions and ensure quality gates.

- [x] T020 [P] Unit test: attachment validation (1–10, mime type) in a new `tests/unit/broadcast/attachmentsValidation.test.ts`
- [x] T021 [P] Integration test: persistence of `broadcast_attachments` + `attachmentsCount` in history query (new file under `tests/integration/`)
- [ ] T022 [P] E2E smoke: login → attach 1 image → send to a known chat (can be mocked or skipped locally) in `tests/e2e/` *(optional if environment lacks Telegram test chat)*
- [x] T023 [P] Run `npm run lint` and `npm run build` and fix regressions
- [x] T024 [P] Ensure request logging never includes raw image bytes/files during multipart handling (verify `src/observability/logger.ts` usage; redact/avoid logging File/FormData)

**Final Checkpoint**: Feature matches `spec.md` and success criteria are met.

---

## Dependencies & Execution Order

- Phase 1 must complete before Phase 3 (needs persistence).
- Phase 2 must complete before Phase 3/4 (needs Telegram adapter).
- Phase 3 must complete before Phase 4 (API contract needed).
- Phase 5 depends on Phase 1 (needs `attachmentsCount`).
- Phase 6 can be done incrementally after relevant phases.

