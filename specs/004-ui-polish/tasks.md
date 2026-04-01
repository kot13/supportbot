---
description: "Actionable task list for implementing the feature"
---

# Tasks: UI polish

**Input**: Design documents from `/specs/004-ui-polish/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `quickstart.md`

**Organization**: Tasks grouped by user story and execution phases. Prefer safe increments with clear checkpoints.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1/US2/US3
- Include exact file paths in descriptions

---

## Phase 1: Foundational (Blocking prerequisites)

**Purpose**: Ensure shared constraints and helpers are aligned before story work.

- [x] T001 Align message length rules used across UI + server: 2048 for text-only, 1024 for images caption (likely `src/domain/broadcast/validateImages.ts` and `src/domain/broadcast/sendBroadcast.ts`)
- [x] T002 [P] Update and document the manual verification checklist for conditional limits in `specs/004-ui-polish/quickstart.md`

**Checkpoint**: Shared length rules are defined and referenced consistently.

---

## Phase 2: User Story 1 — Consistent entry point (Priority: P1) 🎯 MVP

**Goal**: Navigating to `/` lands on `/chats` without exposing a dedicated home page, while preserving auth rules.

**Independent Test**: After sign-in, visiting `/` results in `/chats`. Unauthenticated behavior is unchanged (still cannot access protected pages).

- [x] T003 [US1] Remove/disable the dedicated `/` page and add server-side redirect `/` → `/chats` in `app/page.tsx`
- [x] T004 [US1] Ensure redirect does not bypass auth rules (verify flow; adjust if needed) in `app/page.tsx` and auth layout/guards
- [x] T005 [P] [US1] E2E smoke: authenticated visit to `/` redirects to `/chats` in `tests/e2e/auth-and-broadcast.spec.ts`

---

## Phase 3: User Story 2 — Faster navigation (Priority: P2)

**Goal**: Sidebar navigation ordering matches expected priority; `Bots` is last.

**Independent Test**: Sidebar shows `Bots` as the last navigation item.

- [x] T006 [US2] Move `Bots` navigation item to the end in `src/ui/Sidebar.tsx`
- [x] T007 [US2] Ensure active link highlighting still works for `Bots` route in `src/ui/Sidebar.tsx`

---

## Phase 4: User Story 3 — Message composer UX (Priority: P3)

**Goal**: Composer is full-width, preview matches sizing and preserves line breaks, show character counter, and enforce conditional length limits (1024 with images / 2048 without).

**Independent Test**:
- Type a multi-line message → preview shows same line breaks (including empty lines).
- Without images: 2048 allowed, 2049 rejected.
- With images: 1024 allowed, 1025 rejected.
- Character counter reflects the correct limit.

- [x] T008 [US3] Make the “Message” textarea full-width in `src/ui/MessageEditor.tsx`
- [x] T009 [US3] Make preview same width/size and preserve line breaks (including empty lines) in `src/ui/MessageEditor.tsx`
- [x] T010 [US3] Remove the tip/help section under preview (if present) in `src/ui/MessageEditor.tsx`
- [x] T011 [US3] Add a live character counter to the message textarea (shows `current/max`) in `src/ui/MessageEditor.tsx`
- [x] T012 [US3] Update client-side validation to enforce conditional limits (1024 with images / 2048 without) and block send in `app/(panel)/broadcast/BroadcastClient.tsx`
- [x] T013 [US3] Update server-side validation to enforce conditional limits in `app/api/broadcasts/route.ts` and `src/domain/broadcast/sendBroadcast.ts`
- [x] T014 [P] [US3] Update unit tests for validation:
  - text-only max 2048
  - with images max 1024
  in `tests/unit/broadcast/*`
- [x] T015 [P] [US3] E2E smoke: preview preserves line breaks (type multi-line text and assert preview text) in `tests/e2e/*`

---

## Phase 5: Polish & cross-cutting concerns

**Purpose**: Light theme consistency and quality gates.

- [x] T016 Update panel shell background/text to light theme in `app/(panel)/layout.tsx` and `app/globals.css`
- [x] T017 [P] Audit and adjust shared UI components for light theme readability:
  - `src/ui/Sidebar.tsx`
  - `src/ui/Alert.tsx`
  - `src/ui/Loading.tsx`
  - `src/ui/Table.tsx`
  - `src/ui/ChatPicker.tsx`
- [x] T018 [P] Audit key pages for remaining dark-only classes and update:
  - `app/(panel)/chats/*`
  - `app/(panel)/broadcast/*`
  - `app/(panel)/bot/*`
  - `app/(auth)/login/*`
- [x] T019 Ensure focus rings/hover/disabled states remain visible and accessible (manual check + fix)
- [x] T020 [P] Run `npm test`, `npm run lint`, and `npm run build` and fix regressions
- [x] T021 [P] Quick manual pass using `specs/004-ui-polish/quickstart.md`

**Final Checkpoint**: Feature matches `spec.md` and success criteria are met.

---

## Dependencies & Execution Order

- Phase 1 blocks US3 conditional-limit work.
- US1 can be delivered as MVP after Phase 1.
- US2 and US3 can be implemented after Phase 1 (US3 depends on validation alignment in T001).
- Polish phase should happen after US1–US3.

