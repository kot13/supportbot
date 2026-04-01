---
description: "Actionable task list for implementing the feature"
---

# Tasks: Chats and History improvements

**Input**: Design documents from `/specs/005-chats-history-improvements/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/api.md`

**Organization**: Tasks grouped by execution order (types-safe increments) and user stories. IDs are sequential.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency)
- **[Story]**: US1 / US2 / US3 (from `spec.md`)
- Paths are repo-relative from project root

---

## Phase 1: History list data + table (FR-001, FR-002)

**Purpose**: Extend `listBroadcasts`, expose `error_code_summary` per `contracts/api.md`, and update `BroadcastHistoryTable` in the **same change set as the DB/types** so `tsc` never references removed `content_preview` without a matching UI update.

**Checkpoint**: History API and page show no Preview column; Error code column works; list row type matches `BroadcastListRow`.

- [x] T001 Extend `listBroadcasts` and `BroadcastListRow` in `src/db/broadcasts.ts`:
  - Remove `content_preview` from the SQL select
  - Add aggregate of distinct non-null `error_code` values from failed rows in `delivery_results` (e.g. comma-separated ordered string)
  - Expose the column as **`error_code_summary`** (snake_case) on the row type to match `GET /api/broadcasts/history` in `contracts/api.md`
  - Null/empty aggregate: render **`-`** in the table (T005), not misleading blanks
- [x] T002 [P] Confirm `app/api/broadcasts/history/route.ts` returns the updated shape: `{ ok: true, data: rows }` includes `error_code_summary` and omits `content_preview`; dates serialize as today’s API consumers expect (add explicit mapping only if needed)

- [x] T005 [US2] In the **same PR/commit as T001–T002**, update `app/(panel)/broadcast/history/BroadcastHistoryTable.tsx`:
  - Remove `content_preview` / Preview column and related `Row` fields
  - Add **Error code** column bound to **`error_code_summary`** (display `-` when empty)
- [x] T006 [US2] Remove or rewrite the footer tip in `app/(panel)/broadcast/history/page.tsx` that points admins to raw JSON now that a details page exists

---

## Phase 2: User Story 1 — Inspect broadcast details (Priority: P1) 🎯 MVP

**Goal**: Clicking a broadcast ID opens an in-panel details page with full message data and per-chat delivery results (including error codes).

**Independent Test**: From `/broadcast/history`, click an ID → `/broadcast/history/[id]` shows content, status, timestamps, counts, and deliveries; unknown ID shows a clear not-found state.

- [x] T003 [US1] Add `app/(panel)/broadcast/history/[id]/page.tsx`:
  - `requireAuth()`, parse numeric `id`, `getBroadcastDetails(id)`
  - Call `notFound()` when broadcast is missing
  - Render broadcast fields, full content in a scroll-safe region, attachment count, link back to history
  - Render deliveries in a table (chat id/title, status, attempts, sent_at, `error_code`, `error_message`) with an explicit empty state when `deliveries` is empty
- [x] T004 [US1] Update ID cell in `app/(panel)/broadcast/history/BroadcastHistoryTable.tsx` to use `next/link` to `/broadcast/history/[id]` (replace raw `/api/broadcasts/[id]` href)

---

## Phase 3: User Story 3 — Auto-refresh chats list (Priority: P3)

**Goal**: `/chats` refreshes data on a polling interval without full page reload; transient API errors do not break the page.

**Independent Test**: With the app open on `/chats`, a newly ingested chat appears within the polling interval without manual refresh.

- [x] T007 [US3] Add a client wrapper (e.g. `app/(panel)/chats/ChatsPageClient.tsx`) that accepts initial rows from the server, polls `GET /api/chats` with credentials on a fixed interval (per `plan.md` / `research.md`, e.g. 15–30s), updates state passed to `ChatsTable`, and keeps last good data on fetch failure (optional subtle error indicator)
- [x] T008 [US3] Update `app/(panel)/chats/page.tsx` to load chats on the server and render the client wrapper + `ChatsTable` with serialized dates compatible with existing `ChatsTable` props

---

## Phase 4: Tests & quality gates

**Purpose**: Regression coverage and repo quality commands.

- [x] T009 [P] Integration coverage for `listBroadcasts` + `error_code_summary` (happy path + no failures / failures without codes) in `tests/integration/` (extend `broadcast-persistence.test.ts` or add a focused file)
- [x] T010 [P] E2E in `tests/e2e/auth-and-broadcast.spec.ts`: after authenticated navigation to `/broadcast/history`, **if** at least one broadcast row exists, click the ID link and assert URL matches `/broadcast/history/<id>`. **If** the table is empty, either seed a minimal broadcast via existing test helpers/API or `test.skip` with a comment—do not leave a flaky unconditional click.
- [x] T011 Run `npm test`, `npm run lint`, and `npm run build`; fix any regressions
- [x] T012 [P] Manual pass using `specs/005-chats-history-improvements/quickstart.md`

**Final checkpoint**: `spec.md` success criteria SC-001–SC-003 satisfied.

---

## Dependencies & execution order

| Phase | Depends on | Notes |
|--------|------------|--------|
| Phase 1 | — | **T001–T002 and T005 must ship together** (no merge of T001 alone). |
| Phase 2 | Phase 1 complete | Details page + ID link; table already shows `error_code_summary`. |
| Phase 3 | — | Independent; can run after Phase 1 in parallel with Phase 2 if staffed. |
| Phase 4 | Features under test are implemented | |

**Parallel opportunities**: T002 with T005 after T001 is drafted (different files, same PR). T007–T008 parallel with Phase 2 after Phase 1.

---

## Implementation strategy

1. **First merge**: Phase 1 (T001–T006) — history list + table + footer; build stays green.
2. **MVP (US1)**: Phase 2 (T003–T004) — details route + panel link on ID.
3. **US3**: Phase 3 (T007–T008).
4. **Finish**: Phase 4.

---

## Notes

- Keep `GET /api/broadcasts/[id]` behavior unchanged unless a deliberate contract bump is documented in `contracts/api.md`.
- Polling must not use WebSockets in v1 (`spec.md` assumptions).
- When changing list JSON shape, keep `contracts/api.md` in sync (T001/T002).
