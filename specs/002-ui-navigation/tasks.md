---
description: "Actionable task list for implementing the feature"
---

# Tasks: UI navigation and styling

**Input**: Design documents from `/specs/002-ui-navigation/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`

**Tests**: Not explicitly requested. Prefer lightweight checks: lint/build, and a minimal E2E smoke that verifies sign-out + sidebar presence rules if needed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the UI kit and make it available to the app.

- [x] T001 Add React Hero UI dependencies and baseline config in `package.json` (UI kit primitives must cover Button/Input/Alert/Table usage)
- [x] T002 [P] Add UI kit theme/provider wiring in `app/layout.tsx` (root provider if required)
- [x] T003 [P] Add/adjust global styles to align with the UI kit in `app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared UI primitives and layout rules so all pages can adopt consistent styling.

**⚠️ CRITICAL**: No user story work should proceed until shared primitives are ready.

- [x] T004 Define a single “App shell” layout contract for panel pages in `app/(panel)/layout.tsx`
- [x] T005 [P] Standardize button/input/alert wrappers to UI kit in `src/ui/Button.tsx`, `src/ui/Input.tsx`, `src/ui/Alert.tsx`
- [x] T006 [P] Add table wrapper in `src/ui/Table.tsx` and adopt it in `app/(panel)/chats/page.tsx` and `app/(panel)/broadcast/history/page.tsx` (consistent header/row/empty state styling)
- [x] T007 Ensure sidebar is the single source of navigation links in `src/ui/Sidebar.tsx`

**Checkpoint**: Shared UI primitives + layout rules ready.

---

## Phase 3: User Story 1 — Consistent navigation in admin area (Priority: P1) 🎯 MVP

**Goal**: Sidebar navigation on all authenticated pages, not on `/login`, with a reliable Sign out action.

**Independent Test**:
- Open `/login` (unauthenticated) → no sidebar, only login form.
- After sign-in → sidebar present on panel pages; Sign out returns to `/login` and protected pages redirect to login.

### Implementation for User Story 1

- [x] T008 [US1] Ensure `/login` uses auth-only layout (no sidebar) in `app/(auth)/login/page.tsx`
- [x] T009 [US1] Ensure panel layout renders sidebar only for authenticated users in `app/(panel)/layout.tsx`
- [x] T010 [US1] Ensure Sign out action invalidates session and redirects to login in `src/ui/Sidebar.tsx` and `app/api/auth/logout/route.ts`
- [x] T011 [US1] Ensure all admin sections are linked from sidebar in `src/ui/Sidebar.tsx` (bot, chats, broadcast, history)

**Checkpoint**: Navigation + sign out rules satisfied.

---

## Phase 4: User Story 2 — Modern strict UI across pages (Priority: P2)

**Goal**: Apply consistent strict modern styling to key pages and ensure empty/loading/error states are consistent.

**Independent Test**: `/bot`, `/chats`, `/broadcast`, `/broadcast/history` look consistent and handle empty/error states predictably.

- [x] T012 [P] [US2] Apply UI kit components/styles to bot settings form in `app/(panel)/bot/BotSettingsForm.tsx`
- [x] T013 [P] [US2] Apply UI kit components/styles to chats table in `app/(panel)/chats/page.tsx`
- [x] T014 [P] [US2] Apply UI kit components/styles to broadcast composer in `app/(panel)/broadcast/BroadcastClient.tsx`
- [x] T015 [P] [US2] Apply UI kit components/styles to broadcast history table in `app/(panel)/broadcast/history/page.tsx`
- [x] T016 [US2] Normalize empty/loading/error components usage across these pages via `src/ui/Alert.tsx` (and new helpers if needed)

**Checkpoint**: Consistent modern UI and states across key pages.

---

## Phase 5: User Story 3 — Use a UI kit / design system (Priority: P3)

**Goal**: Enforce and document a “use UI kit first” approach for common UI elements.

**Independent Test**: A developer can implement a new control using existing UI kit wrappers without adding new ad-hoc styles.

- [x] T017 [US3] Add UI kit usage guidance to `README.md` (what to use for buttons/inputs/tables/alerts)
- [x] T018 [US3] Refactor remaining custom-styled primitives to UI kit equivalents in `src/ui/*` (keep consistent API)

**Checkpoint**: UI kit usage is the default path.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final QA pass for responsiveness and regressions.

- [x] T019 [P] Responsive nav behavior check (mobile + desktop) in `app/(panel)/layout.tsx` and `src/ui/Sidebar.tsx`
- [x] T020 [P] Run `npm run lint` and `npm run build` and fix any regressions in relevant files
- [ ] T021 [P] Manual check: after logout, opening `/bot` redirects to `/login` (session invalidated)
- [x] T022 [P] E2E smoke (Playwright): sign in → sign out → opening `/bot` redirects to `/login` in `tests/e2e/auth-and-broadcast.spec.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **US1–US3**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on desired user stories

### User Story Dependencies

- **US1 (P1)**: First; establishes consistent navigation expectations
- **US2 (P2)**: After US1; styling applied across pages
- **US3 (P3)**: After US2; ensures future consistency

### Parallel Opportunities

- T002 and T003 can run in parallel
- T005 and T006 can run in parallel
- US2 tasks T012–T015 can run in parallel (different files)
