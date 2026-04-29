---
description: "Actionable task list for implementing the feature"
---

# Tasks: Подтверждение перед отправкой сообщений (broadcast)

**Input**: Design documents from `/specs/007-send-confirmation/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/broadcast-send.md`, `quickstart.md`

**Organization**: Phases — setup → foundational helper → User Story 1 (P1) → User Story 2 (P2) → polish. Tasks use sequential IDs `T###`; `[P]` = parallelizable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files / no hard ordering)
- **[Story]**: `[US1]` / `[US2]` maps to user stories in `spec.md`
- Paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline quality before UI edits.

- [x] T001 Run `npm test && npm run lint` on the current branch and resolve only pre-existing failures unrelated to this feature before changing `app/(panel)/broadcast/BroadcastClient.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared preview helper for modal content (used by US1).

**Checkpoint**: Helper is pure TypeScript and importable from the client bundle.

- [x] T002 [P] Implement `truncateBroadcastBody(text: string, maxChars: number)` returning `{ preview: string; truncated: boolean; totalChars: number }` in `src/ui/broadcastConfirmationPreview.ts` per `specs/007-send-confirmation/research.md` (explicit truncation notice when `truncated`)

---

## Phase 3: User Story 1 — Подтверждение перед рассылкой (Priority: P1) 🎯 MVP

**Goal**: До вызова `POST /api/broadcasts` оператор видит модальное подтверждение со сводкой; отмена не шлёт запрос и не очищает черновик.

**Independent Test**: Заполнить форму → первое действие открывает модалку → отмена → текст и выбор на месте → подтверждение → поведение как у текущей успешной рассылки.

### Implementation for User Story 1

- [x] T003 [US1] Refactor `app/(panel)/broadcast/BroadcastClient.tsx`: extract existing network logic from `send()` into an inner async function (e.g. `executeBroadcastSend`) that performs the same JSON vs `FormData` `fetch` to `/api/broadcasts` as today
- [x] T004 [US1] Add client state (e.g. `confirmOpen`) and HeroUI `Modal` in `app/(panel)/broadcast/BroadcastClient.tsx`; primary page button opens the modal when `canSend` and not `pending`, instead of calling `executeBroadcastSend` directly
- [x] T005 [US1] Render confirmation summary in the modal in `app/(panel)/broadcast/BroadcastClient.tsx`: recipient scope — for `mode === "all"` show total chat count from `chats.length`; for `subset` show selected count (and optional short list of titles if space allows); show `images.length`; show message preview using `truncateBroadcastBody(content, …)` from `src/ui/broadcastConfirmationPreview.ts`
- [x] T006 [US1] Wire modal primary action to call `executeBroadcastSend()` and close modal on success path consistent with current UX; Cancel/onClose must not call `fetch` and must leave `content`, `mode`, `selectedIds`, `images` unchanged in `app/(panel)/broadcast/BroadcastClient.tsx`
- [x] T007 [US1] While `pending` is true, disable opening duplicate sends: disable the main broadcast trigger, modal confirm/cancel as appropriate, and keep existing disabled states for file inputs / remove image buttons aligned with current `pending` usage in `app/(panel)/broadcast/BroadcastClient.tsx`

**Checkpoint**: FR-001–FR-005 satisfied for broadcast flow; API unchanged per `contracts/broadcast-send.md`.

---

## Phase 4: User Story 2 — Понятные действия в окне подтверждения (Priority: P2)

**Goal**: Различимые «подтвердить отправку» и «отмена»; согласованность с остальной панелью и базовая доступность.

**Independent Test**: В модалке видно две разные кнопки; отмена — вторичная; таб-навигация доходит до обеих.

### Implementation for User Story 2

- [x] T008 [US2] Adjust modal button variants and labels in `app/(panel)/broadcast/BroadcastClient.tsx` so confirm send is visually primary and cancel is secondary/dismissive (English copy consistent with existing panel strings such as “Send broadcast”)
- [x] T009 [US2] Set modal `aria-labelledby` / title content and verify focus moves into the dialog when opened (HeroUI defaults acceptable); ensure heading describes the action (e.g. confirm broadcast) in `app/(panel)/broadcast/BroadcastClient.tsx`

**Checkpoint**: User Story 2 acceptance scenarios met.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Regression safety and manual validation.

- [x] T010 [P] Extend Playwright coverage in `tests/e2e/auth-and-broadcast.spec.ts`: after login and navigating to `/broadcast`, fill `data-testid="message-textarea"` with safe text, click the broadcast send button, expect a dialog (e.g. `role="dialog"` or stable test id), click cancel/secondary action, assert textarea value unchanged; optionally `page.route`/`request` listener to assert no `POST **/api/broadcasts` on cancel
- [x] T011 Run `npm test && npm run lint` after all edits; fix regressions
- [ ] T012 [P] Execute manual checklist in `specs/007-send-confirmation/quickstart.md` on a running app

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends on | Notes |
|--------|--------------|--------|
| Phase 1 | — | Baseline |
| Phase 2 | Phase 1 optional | T002 can start after T001; strictly US1 needs T002 before T005 |
| Phase 3 (US1) | T002 complete | T003–T007 sequential within same file |
| Phase 4 (US2) | Phase 3 | Modal must exist before polish labels/a11y |
| Phase 5 | US1 (US2 recommended) | E2E assumes UI stable |

### User Story Dependencies

- **US1**: After T002; no dependency on US2.
- **US2**: After US1 modal exists (Phases 3–4).

### Parallel Opportunities

- **T002** [P] can run in parallel with **T001** (different concerns: helper vs lint).
- **T010** [P] and **T012** [P] can run in parallel after implementation (E2E vs manual).
- US1 tasks **T003–T007** share one file — edit sequentially to avoid merge conflicts.

### Parallel Example: Early phase

```bash
# After T001 scheduled:
# Developer A: T002 in src/ui/broadcastConfirmationPreview.ts
# Developer B: T003 start only after T002 if preview import needed — prefer sequential T002 → T003…T007
```

---

## Implementation Strategy

### MVP (User Story 1 only)

1. Complete Phase 1–2 (T001–T002).
2. Complete Phase 3 (T003–T007).
3. Stop and validate with `quickstart.md` (broadcast confirm/cancel/success).

### Full feature

1. MVP above.
2. Phase 4 (T008–T009).
3. Phase 5 (T010–T012).

---

## Notes

- Do not add server-side “confirmed” flags; contract remains `POST /api/broadcasts` only after UI confirmation (`contracts/broadcast-send.md`).
- Avoid duplicating send logic — one `executeBroadcastSend` for JSON and multipart paths.

---

## Task Summary

| Metric | Value |
|--------|--------|
| Total tasks | 12 (T001–T012) |
| US1 tasks | 5 (T003–T007) |
| US2 tasks | 2 (T008–T009) |
| Setup / foundation / polish | 5 (T001–T002, T010–T012) |
| MVP task count | 7 (T001–T007, optional T011 partial) |

**Suggested MVP scope**: Phases 1–3 (T001–T007) plus minimal validation from Phase 5 (**T011**).

**Format validation**: All tasks use `- [ ]`, sequential `T###`, file paths in descriptions, `[US#]` only on story-phase tasks, `[P]` only where parallelizable.
