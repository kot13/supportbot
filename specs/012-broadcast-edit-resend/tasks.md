---
description: "Actionable task list for implementing broadcast edit/resend and drafts"
---

# Tasks: Редактирование, повторная отправка и черновики broadcast-рассылки

**Input**: Design documents from `/specs/012-broadcast-edit-resend/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/api.md`, `quickstart.md`

**Organization**: Phases — setup → foundational → User Story 1 (P1) → User Story 2 (P2) → User Story 4 (P2) → User Story 3 (P3) → polish. Tasks use sequential IDs `T###`; `[P]` = parallelizable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files / no hard ordering)
- **[Story]**: `[US1]`–`[US4]` maps to user stories in `spec.md`
- Paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline quality before feature edits.

- [x] T001 Run `npm test && npm run lint` on branch `012-broadcast-edit-resend` and note baseline; fix only unrelated blockers before feature work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared DB/domain helpers used by compose, drafts, and send-from-draft.

**Checkpoint**: `getBroadcastComposePayload`, draft save helpers, and `canSaveDraft` are importable and unit-tested.

- [x] T002 [P] Add `canSaveDraft({ content, targetMode, chatIds })` and exported types in `src/domain/broadcast/saveDraft.ts` per FR-021/FR-022
- [x] T003 [P] Add unit tests for `canSaveDraft` in `tests/unit/domain/broadcast/saveDraft.test.ts`
- [x] T004 Extend `src/db/broadcasts.ts`: `getBroadcastComposePayload(id, { failedOnly })`, `listBroadcastRecipientChatIds`, `createDraft`, `updateDraft`, `deleteDraft` (draft-only), `replaceBroadcastRecipients`, `replaceBroadcastAttachmentMeta`; export types `BroadcastComposePayload`, `DraftSaveInput`
- [x] T005 [P] Add Zod schemas for draft save body and compose response in `src/domain/broadcast/broadcastDraftSchemas.ts` (or colocate in `saveDraft.ts` if minimal)

---

## Phase 3: User Story 1 — Открыть прошлую рассылку в редакторе и отправить заново (Priority: P1) 🎯 MVP

**Goal**: Из деталей истории открыть `/broadcast` с предзаполнением; отправка создаёт **новую** запись; исходная не меняется; до send запись в истории не появляется.

**Independent Test**: Детали рассылки → «Edit and resend» → изменить текст → подтвердить send → новая строка в истории; исходная без изменений; между open и send новых id нет.

### Implementation for User Story 1

- [x] T006 [US1] Implement `GET` handler in `app/api/broadcasts/[id]/compose/route.ts` per `contracts/api.md` (`failedOnly` default `0`, errors `NOT_FOUND` / `VALIDATION`)
- [x] T007 [P] [US1] Add integration tests for compose (happy path, 404) in `tests/integration/broadcastCompose.test.ts`
- [x] T008 [US1] Update `app/(panel)/broadcast/page.tsx` to pass `searchParams` (`from`, `failedOnly`, `draftId`) into client wrapper
- [x] T009 [US1] Extend `app/(panel)/broadcast/BroadcastClient.tsx`: on mount load `GET /api/broadcasts/{from}/compose` when `from` set; apply `content`, `mode`, `selectedIds`; show banner «Based on broadcast #N»; track `sourceBroadcastId` without creating DB row
- [x] T010 [US1] Ensure resend send path still uses existing `POST /api/broadcasts` (new row) when no `draftId` in `app/(panel)/broadcast/BroadcastClient.tsx`; keep 007 confirmation modal
- [x] T011 [US1] Add «Edit and resend» link/button on `app/(panel)/broadcast/history/[id]/page.tsx` → `/broadcast?from={id}` (hide for `status === draft`)

**Checkpoint**: US1 acceptance scenarios 1–6 satisfied from detail page.

---

## Phase 4: User Story 2 — Быстрый повтор только неудачным получателям (Priority: P2)

**Goal**: Одним действием prefill только чатов с `delivery_results.status = failure`.

**Independent Test**: Рассылка с failures → «Retry failed» → subset с failed chats only → send только им.

### Implementation for User Story 2

- [x] T012 [US2] Extend `getBroadcastComposePayload` and compose route for `failedOnly=1`: chat ids from failed deliveries, force `target_mode=subset`, return `NO_FAILURES` when none in `src/db/broadcasts.ts` and `app/api/broadcasts/[id]/compose/route.ts`
- [x] T013 [P] [US2] Add integration test `failedOnly=1` and `NO_FAILURES` in `tests/integration/broadcastCompose.test.ts`
- [x] T014 [US2] Add «Retry failed» action on `app/(panel)/broadcast/history/[id]/page.tsx` → `/broadcast?from={id}&failedOnly=1`; disabled/hidden when `failure_count === 0`
- [x] T015 [US2] In `BroadcastClient`, when `failedOnly=1` and `skipped_recipients > 0`, show non-blocking notice per edge case in `app/(panel)/broadcast/BroadcastClient.tsx`

**Checkpoint**: US2 acceptance scenarios 1–3 satisfied.

---

## Phase 5: User Story 4 — Сохранение и возобновление черновика (Priority: P2)

**Goal**: Save draft to server, list in history as `draft`, edit, send (same id → completed), delete with confirmation; attachment metadata only.

**Independent Test**: Save draft → виден в истории → open → edit → send; save draft with image metadata → reopen shows meta, files re-attached manually.

### Implementation for User Story 4

- [x] T016 [US4] Implement `POST` in `app/api/broadcasts/drafts/route.ts` (create draft, `canSaveDraft`, persist recipients + attachment meta)
- [x] T017 [US4] Extend `app/api/broadcasts/[id]/route.ts` with `PATCH` (draft only) and `DELETE` (draft only, `NOT_DRAFT` / `NOT_FOUND`)
- [x] T018 [US4] Implement `POST` in `app/api/broadcasts/[id]/send/route.ts`: validate draft status, reuse `sendBroadcast` on same id, multipart/json parity with `app/api/broadcasts/route.ts`
- [x] T019 [P] [US4] Add integration tests draft create/update/send/delete in `tests/integration/broadcastDrafts.test.ts`
- [x] T020 [US4] Add «Save draft» button and logic in `app/(panel)/broadcast/BroadcastClient.tsx`: `POST /api/broadcasts/drafts` or `PATCH /api/broadcasts/{draftId}`; success toast with id; `canSaveDraft` client mirror
- [x] T021 [US4] Load draft via `?draftId=` in `BroadcastClient`: `GET /api/broadcasts/{id}` + recipients; show saved attachment metadata hint (re-attach files)
- [x] T022 [US4] Send from draft: `POST /api/broadcasts/{draftId}/send` in `executeBroadcastSend` when `draftId` set in `app/(panel)/broadcast/BroadcastClient.tsx`
- [x] T023 [US4] Update `app/(panel)/broadcast/history/BroadcastHistoryTable.tsx`: render `draft` status; `-` for delivery columns when draft; «Edit» → `/broadcast?draftId=`; client delete with confirm modal → `DELETE /api/broadcasts/{id}`
- [x] T024 [US4] Update `app/(panel)/broadcast/history/[id]/page.tsx` for draft rows: «Continue editing» instead of resend; no delivery table empty state

**Checkpoint**: US4 acceptance scenarios 1–10 and FR-013–FR-026 satisfied.

---

## Phase 6: User Story 3 — Запуск из таблицы истории (Priority: P3)

**Goal**: Resend / retry failed / open draft from history table without visiting detail page.

**Independent Test**: From `/broadcast/history` row actions open editor with correct prefill and source label.

### Implementation for User Story 3

- [x] T025 [US3] Add actions column to `app/(panel)/broadcast/history/BroadcastHistoryTable.tsx`: sent rows — «Resend», «Retry failed» (if failures); draft rows covered in T023
- [x] T026 [US3] Ensure `BroadcastClient` source banner shows when entering via table links (`from` / `draftId`) in `app/(panel)/broadcast/BroadcastClient.tsx`

**Checkpoint**: US3 acceptance scenarios 1–2 satisfied.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: E2E, regression, manual validation.

- [x] T027 [P] Add Playwright spec `tests/e2e/broadcast-edit-resend.spec.ts`: resend creates new row; draft save/open/send; delete draft cancel keeps row
- [x] T028 Run `npm test && npm run lint` after all edits; fix regressions
- [ ] T029 [P] Execute manual checklist in `specs/012-broadcast-edit-resend/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends on | Notes |
|--------|--------------|--------|
| Phase 1 | — | Baseline |
| Phase 2 | Phase 1 | Blocks all stories |
| Phase 3 (US1) | Phase 2 | Needs T004 compose DB + T006 route |
| Phase 4 (US2) | Phase 3 | Extends compose route and detail UI |
| Phase 5 (US4) | Phase 2 | Can start after T004; parallel with US1/US2 if staffed |
| Phase 6 (US3) | US1 + US2 + US4 table bits | T025 after T023/T014 |
| Phase 7 | US1–US4 desired | E2E last |

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2–US4.
- **US2 (P2)**: After US1 compose route exists (T006–T012).
- **US4 (P2)**: After Phase 2; independent of US1 for API; shares `BroadcastClient` (coordinate edits).
- **US3 (P3)**: After US1/US2/US4 action links defined.

### Parallel Opportunities

- **T002**, **T003**, **T005** [P] in Phase 2 (different files).
- **T007**, **T013**, **T019**, **T027**, **T029** [P] tests/manual vs implementation in other files.
- **US4** API tasks **T016–T018** [P] after T004 (different route files).
- **US1** and **US4** both touch `BroadcastClient.tsx` — serialize or merge carefully.

### Parallel Example: Phase 2

```bash
# Developer A: T002 + T003 (saveDraft.ts + unit test)
# Developer B: T004 (broadcasts.ts DB layer)
# Developer C: T005 (Zod schemas)
```

### Parallel Example: After Phase 2

```bash
# Developer A: US1 (T006–T011)
# Developer B: US4 API only (T016–T019)
# Merge before heavy BroadcastClient work (T009 + T020–T022)
```

---

## Implementation Strategy

### MVP (User Story 1 only)

1. Complete Phase 1–2 (T001–T005).
2. Complete Phase 3 (T006–T011).
3. Validate with compose + resend from detail page (`quickstart.md` §2).

### Incremental delivery

1. MVP (US1) → demo resend.
2. Add US2 (retry failed) → demo partial failure recovery.
3. Add US4 (drafts) → demo save/resume/send/delete.
4. Add US3 (table actions) → fewer clicks.
5. Phase 7 polish.

---

## Notes

- No DB migration for v1 (`research.md` R1).
- Sent broadcasts remain immutable; `PATCH`/`DELETE` only when `status = draft`.
- Attachment bytes never stored; metadata in `broadcast_attachments` on draft save.
- Keep existing 007 confirmation before any send path.

---

## Task Summary

| Metric | Value |
|--------|--------|
| Total tasks | 29 (T001–T029) |
| US1 tasks | 6 (T006–T011) |
| US2 tasks | 4 (T012–T015) |
| US3 tasks | 2 (T025–T026) |
| US4 tasks | 9 (T016–T024) |
| Setup / foundation / polish | 8 (T001–T005, T027–T029) |

**Suggested MVP scope**: Phases 1–3 (T001–T011) + T028.

**Format validation**: All tasks use `- [ ]`, sequential `T###`, file paths in descriptions, `[US#]` on story-phase tasks only, `[P]` where parallelizable.
