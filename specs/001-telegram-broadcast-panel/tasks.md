---
description: "Actionable task list for implementing the feature"
---

# Tasks: Telegram bot broadcast panel

**Input**: Design documents from `/specs/001-telegram-broadcast-panel/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Not explicitly requested in the specification. Include only minimal E2E smoke coverage where it reduces risk for key journeys.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the repository as a Next.js + TypeScript project with a consistent structure.

- [ ] T001 Create Next.js project skeleton in repo root (`app/`, `src/`, `tests/`)
- [ ] T002 [P] Add repo-level README and local dev notes in `README.md`
- [ ] T003 [P] Add env example file in `.env.example` covering DB + runtime concepts (no secrets)
- [ ] T004 [P] Configure formatting/linting (ESLint/formatter) and scripts in `package.json`
- [ ] T005 [P] Create base UI primitives in `src/ui/` (layout shell, form controls, buttons, alerts)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Setup PostgreSQL connectivity + config validation in `src/db/` (connection + env validation)
- [ ] T007 Define migrations framework and initial migrations in `src/db/migrations/`
- [ ] T008 [P] Define domain-safe error types and sanitization helpers in `src/observability/errors.ts`
- [ ] T009 [P] Add structured logging helper with redaction in `src/observability/logger.ts`
- [ ] T010 Create DB schema for `AdminUser`, `BotSettings`, `Chat` in migration file(s) under `src/db/migrations/`
- [ ] T011 Create DB schema for `BroadcastMessage`, `BroadcastRecipient`, `DeliveryResult` in migration file(s) under `src/db/migrations/`
- [ ] T012 Implement DB access layer for core entities in `src/db/` (queries/repositories)
- [ ] T013 Implement server-side session/auth foundation in `src/auth/` (session creation, read, destroy)
- [ ] T014 Add route protection utility used by server routes and pages in `src/auth/requireAuth.ts`
- [ ] T015 Implement Telegram send adapter boundary in `src/telegram/send.ts` (single place to call Telegram)
- [ ] T016 Implement Telegram update ingestion boundary in `src/telegram/updates.ts` (normalize updates → domain events)

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 — Sign in to admin panel (Priority: P1) 🎯 MVP

**Goal**: Provide a login screen and authenticated access to the admin panel shell.

**Independent Test**: Open `/login`, sign in with seeded credentials, then access protected routes; invalid credentials show a generic error.

- [ ] T017 [P] [US1] Implement `/login` page UI in `app/(auth)/login/page.tsx`
- [ ] T018 [US1] Implement sign-in server action/route in `app/api/auth/login/route.ts`
- [ ] T019 [US1] Implement logout server action/route in `app/api/auth/logout/route.ts`
- [ ] T020 [P] [US1] Implement auth-protected panel layout shell in `app/(panel)/layout.tsx`
- [ ] T021 [P] [US1] Add sidebar navigation component in `src/ui/Sidebar.tsx`
- [ ] T022 [US1] Add protected landing route (panel home) in `app/(panel)/page.tsx`
- [ ] T023 [US1] Add credential verification against DB in `src/auth/verifyCredentials.ts`
- [ ] T024 [US1] Seed initial admin user (dev-only workflow) via script in `src/db/seed.ts`
- [ ] T025 [US1] Ensure direct access to panel routes redirects to `/login` when unauthenticated (implementation in `src/auth/requireAuth.ts`)

**Checkpoint**: US1 is complete when login works end-to-end and panel routes are protected.

---

## Phase 4: User Story 2 — Configure Telegram bot settings (Priority: P2)

**Goal**: View and update bot name/token stored in DB (token never exposed back to client).

**Independent Test**: Open `/bot`, save a token, refresh the page and see that settings persist; token is shown only as “set/not set”.

- [ ] T026 [P] [US2] Implement bot settings page UI in `app/(panel)/bot/page.tsx`
- [ ] T027 [US2] Implement bot settings read endpoint/action in `app/api/bot-settings/route.ts`
- [ ] T028 [US2] Implement bot settings update endpoint/action in `app/api/bot-settings/route.ts`
- [ ] T029 [US2] Add DB upsert for single-row `BotSettings` in `src/db/botSettings.ts`
- [ ] T030 [US2] Add validation rules for bot settings in `src/domain/botSettings/validate.ts`
- [ ] T031 [US2] Ensure logs/errors never include raw bot token in `src/observability/*`

**Checkpoint**: US2 complete when bot settings can be saved and reloaded, with safe token handling.

---

## Phase 5: User Story 3 — Broadcast a message to selected chats (Priority: P3)

**Goal**: Compose a formatted message, select all/subset recipients, send, and persist per-chat outcomes.

**Independent Test**: With at least one chat in DB, send a broadcast; see summary (success/fail) and a history record with per-chat results.

- [ ] T032 [P] [US3] Implement broadcast composer UI in `app/(panel)/broadcast/page.tsx`
- [ ] T033 [P] [US3] Implement recipient picker component in `src/ui/ChatPicker.tsx` (all vs subset)
- [ ] T034 [P] [US3] Implement formatted message editor + preview in `src/ui/MessageEditor.tsx`
- [ ] T035 [US3] Implement broadcast create/send endpoint/action in `app/api/broadcasts/route.ts`
- [ ] T036 [US3] Implement broadcast history list endpoint in `app/api/broadcasts/history/route.ts`
- [ ] T037 [US3] Implement broadcast details endpoint (per-chat results) in `app/api/broadcasts/[id]/route.ts`
- [ ] T038 [US3] Implement broadcast orchestration service in `src/domain/broadcast/sendBroadcast.ts`
- [ ] T039 [US3] Implement rate-limited dispatch queue in `src/telegram/dispatchQueue.ts`
- [ ] T040 [US3] Implement persistence for `BroadcastMessage` + recipients in `src/db/broadcasts.ts`
- [ ] T041 [US3] Implement persistence for `DeliveryResult` in `src/db/deliveryResults.ts`
- [ ] T042 [US3] Implement sanitized error mapping (Telegram error → admin-friendly) in `src/telegram/errors.ts`
- [ ] T043 [US3] Add UI for history + details (results table) in `app/(panel)/broadcast/history/page.tsx`

**Checkpoint**: US3 complete when a broadcast can be sent, results stored, and history/details visible.

---

## Phase 6: User Story 4 — View chats where the bot is added (Priority: P4)

**Goal**: Provide a read-only chat list in the admin panel, populated by Telegram updates and stored in DB.

**Independent Test**: After adding the bot to a chat and triggering an update, `/chats` shows the chat; UI offers no CRUD.

- [ ] T044 [P] [US4] Implement chats page UI in `app/(panel)/chats/page.tsx`
- [ ] T045 [US4] Implement chats list endpoint in `app/api/chats/route.ts`
- [ ] T046 [US4] Implement chat upsert in `src/db/chats.ts`
- [ ] T047 [US4] Implement Telegram update handler (chat discovery) in `src/telegram/handleUpdate.ts`
- [ ] T048 [US4] Implement webhook receiver route in `app/api/telegram/webhook/route.ts`
- [ ] T049 [US4] Add optional long-polling dev runner in `src/telegram/pollingRunner.ts`

**Checkpoint**: US4 complete when chats appear via bot updates and are viewable read-only.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T050 [P] Mobile responsiveness pass in `app/(panel)/layout.tsx`, `src/ui/Sidebar.tsx`, `app/(panel)/bot/page.tsx`, `app/(panel)/chats/page.tsx`, `app/(panel)/broadcast/page.tsx`, `app/(panel)/broadcast/history/page.tsx`
- [ ] T051 [P] Add empty/error states in `app/(panel)/bot/page.tsx`, `app/(panel)/chats/page.tsx`, `app/(panel)/broadcast/page.tsx`, `app/(panel)/broadcast/history/page.tsx`
- [ ] T052 Add basic brute-force mitigation for login in `app/api/auth/login/route.ts`
- [ ] T053 Add broadcast safety checks (no token set, no chats, no recipients) in `src/domain/broadcast/sendBroadcast.ts`
- [ ] T054 [P] Add unit tests for credential verification and generic auth errors in `tests/unit/auth/verifyCredentials.test.ts`
- [ ] T055 [P] Add unit tests for Telegram error sanitization mapping in `tests/unit/telegram/errors.test.ts`
- [ ] T056 Add integration test for broadcast persistence (message + recipients + delivery results) in `tests/integration/broadcast-persistence.test.ts`
- [ ] T057 [P] Add smoke E2E for sign-in + broadcast happy path in `tests/e2e/auth-and-broadcast.spec.ts`
- [ ] T058 Validate `quickstart.md` manually and align scripts/docs with reality in `specs/001-telegram-broadcast-panel/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 7)**: Depends on desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 — no dependencies on other stories.
- **US2 (P2)**: Starts after Phase 2 — depends only on auth foundation from Phase 2/US1 for access control.
- **US3 (P3)**: Starts after Phase 2 — depends on bot token (US2) and available chats (US4) to be fully demonstrable, but can be implemented earlier and validated once data exists.
- **US4 (P4)**: Starts after Phase 2 — enables US3 real-world validation by populating chat list.

### Parallel Opportunities

- Setup tasks marked **[P]** can run in parallel.
- Foundational tasks **T008/T009** can run in parallel while DB/migrations are being set up.
- Within each story, UI tasks and server tasks often parallelize if they touch different files.

---

## Parallel Example: User Story 3

```bash
Task: "Implement broadcast composer UI in app/(panel)/broadcast/page.tsx"
Task: "Implement recipient picker component in src/ui/ChatPicker.tsx"
Task: "Implement message editor + preview in src/ui/MessageEditor.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) + Phase 2 (Foundational).
2. Complete Phase 3 (US1) and validate sign-in + protected routes.
3. Stop and demo the panel shell.

### Incremental Delivery

1. Add US2 (bot settings) → validate persistence and safe token handling.
2. Add US4 (chat discovery) → validate chats list fills automatically.
3. Add US3 (broadcast) → validate sending + persisted outcomes and history.
4. Finish with Polish phase.
