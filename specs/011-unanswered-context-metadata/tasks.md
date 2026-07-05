---
description: "Actionable task list for unanswered context snapshots"
---

# Tasks: Контекст и метаданные для неотвеченных вопросов

**Input**: Design documents from `/specs/011-unanswered-context-metadata/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/api.md`, `quickstart.md`

**Organization**: Phases by setup → foundation (DB + snapshot builder) → US1 (P1) → US2 (P2) → US3 (P3) → polish. IDs `T###`; `[P]` = parallelizable.

**Tests**: Unit and integration tests included per `plan.md` Gate D and `research.md` Decision 6.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: different files, no hard ordering within the same phase
- **[Story]**: `[US1]` / `[US2]` / `[US3]`
- Paths from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Подтвердить baseline перед миграцией `006`.

- [x] T001 Confirm branch `011-unanswered-context-metadata`, migrations `003`–`005` applied, bot Q&A baseline from `009-bot-qa-rag` per `specs/011-unanswered-context-metadata/quickstart.md` Prerequisites

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Схема БД, типы, построитель снимка — **блокирует все user stories**.

**Checkpoint**: `npm run db:migrate` applies `006`; `buildUnansweredContextSnapshot` unit tests pass.

- [x] T002 Create `src/db/migrations/006_unanswered_context_snapshots.sql`: table `unanswered_context_snapshots` with columns and FK per `specs/011-unanswered-context-metadata/data-model.md`
- [x] T003 [P] Add `src/db/unansweredContextSnapshots.ts`: export types `UnansweredContextSnapshot`, `UnansweredRetrievedChunkSnapshot`, `UnansweredDialogMessage`; `insertUnansweredContextSnapshot` (`ON CONFLICT DO NOTHING`); `getUnansweredContextSnapshot`
- [x] T004 [P] Add `src/rag/unansweredSnapshot.ts`: `buildUnansweredContextSnapshot({ searchPerformed, chunks, recentMessages })` — map `RetrievedChunk[]` to snapshot JSON; compute `chunkCount` and `bestDistance` per `research.md`
- [x] T005 [P] Add unit tests `tests/unit/rag/unansweredSnapshot.test.ts`: cases `searchPerformed: false` (no index), `no_context` with chunks, `openai_error` with empty chunks after failed embed
- [x] T006 Extend `markMessageUnanswered` in `src/db/chatMessages.ts`: optional third arg `snapshot`; `UPDATE … WHERE unanswered_reason IS NULL`; call `insertUnansweredContextSnapshot` when snapshot provided

---

## Phase 3: User Story 1 — Сохранение контекста при неотвеченном вопросе (Priority: P1) 🎯 MVP

**Goal**: При fallback бот сохраняет неизменяемый снимок RAG-контекста вместе с `unanswered_reason` (US1, FR-001–005, FR-008).

**Independent Test**: Задать вопрос вне базы знаний → в БД есть строка в `unanswered_context_snapshots` с `retrieved_chunks` и `recent_messages`; успешный ответ не создаёт снимок.

### Implementation for User Story 1

- [x] T007 [US1] Refactor `src/telegram/processMessage.ts`: introduce locals `chunks`, `recentMessages`, `searchPerformed` initialized per branch (`no_knowledge_index` → `searchPerformed: false`; retrieval path → `true`)
- [x] T008 [US1] Wire `src/telegram/processMessage.ts`: on `unansweredReason`, call `buildUnansweredContextSnapshot` then `markMessageUnanswered(userMessage.id, reason, snapshot)`; skip for `/start`, `/help`, successful RAG answers
- [x] T009 [US1] Add integration test `tests/integration/unansweredContextSnapshots.test.ts`: mark unanswered + snapshot insert, `getUnansweredContextSnapshot`, idempotent second insert (skip if `DATABASE_URL` unset)
- [x] T010 [US1] Run `npm run db:migrate` and verify snapshot row exists after manual out-of-scope bot question (`specs/011-unanswered-context-metadata/quickstart.md` §3)

**Checkpoint**: SC-001 — снимок с полным списком чанков доступен в БД без повторного вопроса боту.

---

## Phase 4: User Story 2 — Просмотр контекста в `/unanswered` (Priority: P2)

**Goal**: Администратор открывает детали снимка из таблицы неотвеченных вопросов (US2, FR-006–007).

**Independent Test**: `/unanswered` → «View context» → модалка показывает фрагменты (source, distance, content, metadata) и диалоговый контекст; таблица остаётся компактной.

### Implementation for User Story 2

- [x] T011 [US2] Add `app/api/unanswered/[messageId]/context/route.ts`: `GET` with `requireAuth`, zod `messageId`, response shape per `specs/011-unanswered-context-metadata/contracts/api.md`; `404` if message missing or not unanswered
- [x] T012 [P] [US2] Add `app/(panel)/unanswered/UnansweredContextModal.tsx`: HeroUI `Modal` + `useOverlayState` (pattern from `app/(panel)/broadcast/BroadcastClient.tsx`); fetch `/api/unanswered/{id}/context` on open; loading and error states
- [x] T013 [US2] Update `app/(panel)/unanswered/UnansweredTable.tsx`: add «View context» action per row opening `UnansweredContextModal`; do not add snapshot columns to table (FR-007)
- [x] T014 [US2] In `app/(panel)/unanswered/UnansweredContextModal.tsx`: render `retrievedChunks` (source type, path, title, distance, metadata, content with line-clamp + expand) and `recentMessages` with role labels

**Checkpoint**: SC-002 — администратор оценивает качество поиска через UI менее чем за 2 минуты на запись.

---

## Phase 5: User Story 3 — Аудит параметров обработки (Priority: P3)

**Goal**: В деталях видны метаданные процесса: причина, время, факт поиска, агрегаты (US3, FR-004).

**Independent Test**: Создать неотвеченные вопросы с `no_context` и `no_knowledge_index` — в модалке различимы «поиск выполнялся» vs «поиск не выполнялся».

### Implementation for User Story 3

- [x] T015 [US3] In `app/(panel)/unanswered/UnansweredContextModal.tsx`: processing header with `formatUnansweredReason` from `src/utils/unansweredReason.ts`, `createdAt`, `searchPerformed` badge
- [x] T016 [US3] In `app/(panel)/unanswered/UnansweredContextModal.tsx`: when `searchPerformed === true`, show summary block with `chunkCount` and `bestDistance` (3 decimal places)
- [x] T017 [US3] In `app/(panel)/unanswered/UnansweredContextModal.tsx`: distinct UI copy for `searchPerformed === false` (prominent «Поиск по базе знаний не выполнялся») vs `searchPerformed === true` with empty `retrievedChunks` (FR-008, SC-003)

**Checkpoint**: SC-003 — 100% различимость «не искали» и «искали, но мало контекста» в UI.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Legacy rows, quality gates, end-to-end validation.

- [x] T018 [P] In `app/(panel)/unanswered/UnansweredContextModal.tsx`: handle `snapshot: null` with message «Снимок контекста недоступен» for pre-feature rows per `contracts/api.md`
- [x] T019 Run `npm test && npm run lint` and fix failures introduced by this feature
- [ ] T020 Run full validation from `specs/011-unanswered-context-metadata/quickstart.md` §3–§7 (no_context, no_knowledge_index, API curl, compact table) — **manual**: ask bot in Telegram, open `/unanswered` modal

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **blocks all user stories**
- **US1 (Phase 3)**: Depends on Foundational (T002–T006)
- **US2 (Phase 4)**: Depends on US1 (snapshot must exist to view); API can be stub-tested with integration fixtures
- **US3 (Phase 5)**: Depends on US2 modal shell (T012–T014)
- **Polish (Phase 6)**: Depends on US1–US3

### User Story Dependencies

```text
Foundational → US1 (persist) → US2 (view) → US3 (audit UI) → Polish
```

- **US1 (P1)**: MVP — сохранение снимка; testable via DB/integration test without UI
- **US2 (P2)**: Requires US1 data (or test fixtures) for meaningful modal content
- **US3 (P3)**: Extends US2 modal; independently testable by varying `searchPerformed` in API responses

### Within Each User Story

- Foundational: migration → DB module + snapshot builder (parallel) → extend `markMessageUnanswered`
- US1: refactor `processMessage` → wire snapshot → integration test → manual verify
- US2: API route ∥ modal skeleton → table wiring → chunk/dialog rendering
- US3: incremental sections in same modal file (sequential)

### Parallel Opportunities

```bash
# Foundational (after T002 migration):
T003 src/db/unansweredContextSnapshots.ts
T004 src/rag/unansweredSnapshot.ts
T005 tests/unit/rag/unansweredSnapshot.test.ts

# US2 (after T011 API):
T012 UnansweredContextModal.tsx skeleton  # parallel with T013 if different devs — T013 touches UnansweredTable only

# Polish:
T018 legacy null handling  # parallel with T019 if tests already green
```

---

## Parallel Example: User Story 2

```bash
# After T011 API route is done:
Task T012: "Add UnansweredContextModal.tsx skeleton"
Task T013: "Update UnansweredTable.tsx with View context action"
# Then T014 enriches modal content (depends on T012)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1–2 (Setup + Foundational)
2. Complete Phase 3 (US1)
3. **STOP and VALIDATE**: integration test + DB row after bot fallback
4. Demo value: ops can query snapshots in DB even before UI

### Incremental Delivery

1. Foundational → US1 → **MVP in production** (data captured)
2. US2 → admins view context in panel
3. US3 → audit metadata polish
4. Polish → quickstart sign-off

### Suggested MVP Scope

**User Story 1 only** (T001–T010): satisfies core spec request «сохранять найденный контекст и все метаданные».

---

## Notes

- Do not backfill historical `unanswered_reason` rows (Assumptions in spec)
- Snapshot must not include embeddings or API keys (Gate C)
- `listUnansweredMessages` in `src/db/chatMessages.ts` must not JOIN snapshot payload (performance)
- Commit after each phase checkpoint
