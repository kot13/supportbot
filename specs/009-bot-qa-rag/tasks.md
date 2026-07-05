---
description: "Actionable task list for implementing Bot Q&A with RAG"
---

# Tasks: Ответы бота на вопросы по InAppStory

**Input**: Design documents from `/specs/009-bot-qa-rag/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/api.md`, `quickstart.md`

**Organization**: Phases by setup → foundation (DB + RAG index) → US1 (P1) → US2 (P1) → US3 (P2) → US4 (P3) → polish. IDs `T###`; `[P]` = parallelizable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: different files, no hard ordering within the same phase
- **[Story]**: `[US1]` / `[US2]` / `[US3]` / `[US4]`
- Paths from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Зависимости, env и скрипты перед миграциями и RAG.

- [x] T001 Run `npm install openai` and commit updated `package.json` / `package-lock.json`
- [x] T002 [P] Extend `.env.example` with `OPENAI_API_KEY`, `RAG_TOP_K` (default 6), `CHAT_CONTEXT_LIMIT` (default 10), optional `TELEGRAM_BOT_USERNAME`
- [x] T003 [P] Add npm script `"rag:index": "tsx scripts/rag-index.ts"` in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Схема БД, слой данных, индексация базы знаний — **блокирует все user stories**.

**Checkpoint**: `npm run db:migrate` + `npm run rag:index` создают чанки в `knowledge_chunks`.

- [x] T004 Create `src/db/migrations/003_bot_qa_rag.sql`: `CREATE EXTENSION vector`; tables `chat_messages`, `knowledge_chunks`, `knowledge_index_runs`, `processed_telegram_updates`; indexes per `specs/009-bot-qa-rag/data-model.md`
- [x] T005 [P] Add `src/db/chatMessages.ts`: `insertChatMessage`, `listChatMessages(chatId, { limit, before })` with keyset pagination
- [x] T006 [P] Add `src/db/knowledgeChunks.ts`: `upsertKnowledgeChunk`, `searchSimilarChunks(embedding, topK)` using cosine `<=>`
- [x] T007 [P] Add `src/db/knowledgeIndexRuns.ts` (`startRun`, `completeRun`, `failRun`) and `src/db/processedTelegramUpdates.ts` (`tryMarkProcessed(updateId)`)
- [x] T008 [P] Add `src/rag/chunkers/markdown.ts`: split `data/docs-master/docs/**/*.md` by `##`/`###` with paragraph fallback and ~100 char overlap
- [x] T009 [P] Add `src/rag/chunkers/csvResources.ts`: parse `data/resources.csv` rows into chunks (title + HTML-stripped `content`)
- [x] T010 [P] Add `src/rag/chunkers/openApiYaml.ts`: parse `data/inappstory-pub-api-v1.yaml` into per path+method chunks
- [x] T011 Add `src/rag/embed.ts`: OpenAI `text-embedding-3-small` (1536 dims), guard missing `OPENAI_API_KEY`
- [x] T012 Add `src/rag/indexKnowledge.ts`: orchestrate chunkers → embed → upsert; record run in `knowledge_index_runs`; full reindex strategy per `research.md`
- [x] T013 Add `scripts/rag-index.ts`: CLI entry calling `indexKnowledge()` with exit codes and chunk count log
- [x] T014 Add `src/rag/retrieve.ts`: embed query + `searchSimilarChunks` with `RAG_TOP_K` from env

---

## Phase 3: User Story 1 — Бот отвечает на вопросы в Telegram (Priority: P1) 🎯 MVP

**Goal**: Обращение к боту → RAG-ответ в том же чате с учётом контекста (US1, FR-001–003, FR-008).

**Independent Test**: В личном чате задать «Как начать работу с Android SDK?» — получить связный ответ в Telegram в течение ~30 с после `rag:index`.

### Implementation for User Story 1

- [x] T015 [P] [US1] Add `src/rag/prompts.ts`: system prompt (только контекст InAppStory, «не знаю» при отсутствии данных) + user prompt builder with chunks and recent messages
- [x] T016 [US1] Add `src/rag/answer.ts`: `answerQuestion({ chatId, question, recentMessages })` using `gpt-4.1`; types `AnswerQuestionResult` per `contracts/api.md`
- [x] T017 [P] [US1] Extend `src/telegram/updates.ts`: `normalizeIncomingMessage`, `isAddressedToBot` (private = all text; group = @mention or reply to bot) per `research.md`
- [x] T018 [P] [US1] Add `src/telegram/botIdentity.ts`: cache bot username via `getMe` (fallback `TELEGRAM_BOT_USERNAME`) for mention detection
- [x] T019 [US1] Add `splitLongTelegramText` helper in `src/telegram/send.ts` (≤4096 chars per message)
- [x] T020 [US1] Add `src/telegram/processMessage.ts`: idempotency via `processed_telegram_updates`; resolve internal `chat_id`; save user message; load recent messages; `retrieve` + `answerQuestion`; save bot message; `sendTelegramMessage` (split if needed)
- [x] T021 [US1] Extend `src/telegram/handleUpdate.ts`: after `upsertChat`, if incoming text message → `void processIncomingMessage(update).catch(logger)`
- [x] T022 [US1] Update `app/api/telegram/webhook/route.ts`: return `200` immediately; delegate to `handleTelegramUpdate` without awaiting RAG (async inside handler)

**Checkpoint**: SC-001, SC-002 (manual pilot) — бот отвечает в Telegram.

---

## Phase 4: User Story 2 — Полная история переписки сохраняется (Priority: P1)

**Goal**: Каждая реплика пользователя и бота в обращении сохраняется в `chat_messages` (US2, FR-004–005).

**Independent Test**: После диалога с ботом `SELECT * FROM chat_messages WHERE chat_id = ?` содержит все пары user/bot в хронологическом порядке.

### Implementation for User Story 2

- [x] T023 [US2] Verify and harden persistence in `src/telegram/processMessage.ts`: insert user row before RAG; insert bot row after successful send; store `telegram_message_id` / `telegram_user_id` when available
- [x] T024 [US2] Wire `CHAT_CONTEXT_LIMIT` in `src/telegram/processMessage.ts` → `listChatMessages` → `answerQuestion` for multi-turn context (FR-008)
- [x] T025 [P] [US2] Add integration test `tests/integration/chatMessages.test.ts`: insert + paginated list (requires `DATABASE_URL`; skip if unset)

**Checkpoint**: SC-003 — 100% сообщений пилотного диалога в БД.

---

## Phase 5: User Story 3 — Просмотр истории в админ-панели (Priority: P2)

**Goal**: `/chats` → детали чата с историей сообщений (US3, FR-006–007).

**Independent Test**: Открыть `/chats/[id]` — видны user/bot сообщения в порядке; пустое состояние для чата без переписки.

### Implementation for User Story 3

- [x] T026 [US3] Add `app/api/chats/[id]/messages/route.ts`: `GET` with `requireAuth`, zod query `limit`/`before`, response shape per `contracts/api.md`; `404` if chat missing
- [x] T027 [US3] Add `app/(panel)/chats/[id]/page.tsx`: Server Component loads chat + first message page via `listChatMessages`
- [x] T028 [US3] Add `app/(panel)/chats/[id]/ChatHistoryClient.tsx`: display bubbles (user vs bot), «Load older» via `before` cursor
- [x] T029 [US3] Update `app/(panel)/chats/ChatsTable.tsx`: link chat title (or new column) to `/chats/[id]`

**Checkpoint**: SC-004 — админ видит историю без Telegram-клиента.

---

## Phase 6: User Story 4 — Поведение при неуверенности и сбоях (Priority: P3)

**Goal**: Явное «не знаю» и понятные ошибки без секретов (US4, FR-009–010).

**Independent Test**: Вопрос вне темы → отказ; симуляция ошибки OpenAI → fallback-сообщение в чат.

### Implementation for User Story 4

- [x] T030 [US4] Handle `no_context` / `not_configured` in `src/rag/answer.ts` with fixed Russian user-facing strings (no fabricated product steps)
- [x] T031 [US4] In `src/telegram/processMessage.ts`: on `openai_error` or send failure, send sanitized fallback to chat and log structured error (no API keys in user text)
- [x] T032 [P] [US4] Add unit tests `tests/unit/telegram/isAddressedToBot.test.ts` for private/group/reply/mention cases
- [x] T033 [P] [US4] Add unit tests `tests/unit/rag/prompts.test.ts` or `answer.test.ts` with mocked OpenAI client for `no_context` branch

**Checkpoint**: SC-005 — ≥90% out-of-scope questions get explicit «cannot answer».

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Тесты chunkers, документация, опциональный reindex API, регрессия.

- [x] T034 [P] Add unit tests `tests/unit/rag/chunkers.test.ts` with small fixtures for md/csv/yaml chunkers
- [x] T035 [P] Optional: add `app/api/knowledge/reindex/route.ts` (`POST`, `requireAuth`, `202` + async `indexKnowledge`) per `contracts/api.md`
- [x] T036 Update `README.md`: `OPENAI_API_KEY`, pgvector requirement, `npm run rag:index`, link to `specs/009-bot-qa-rag/quickstart.md`
- [x] T037 Run `npm test && npm run lint && npm run build`; fix regressions (migrate + `rag:index` — вручную на окружении с pgvector и `OPENAI_API_KEY`)
- [x] T038 [P] Manual validation per `specs/009-bot-qa-rag/quickstart.md` — **2026-07-05**: prerequisites OK (env, migrations 003–005, 2630 chunks indexed); `telegram:poll` active; 8 RAG-ответов + 13 fallback + 5 `/start`/`/help` в БД; 2 записи в `/unanswered`; admin `/chats`, `/chats/[id]`, `/unanswered` — 200 в dev; `npm test` (60), `npm run lint`, `npm run build` — green

---

## Phase 8: Post-implementation (v1.1 — 2026-07-05)

**Purpose**: Доработки после первого MVP: long polling, группы, форматирование, мониторинг неотвеченных, UX админки.

**Checkpoint**: quickstart steps 3–9; SC-006.

- [x] T039 [P] Add `npm run telegram:poll` + `src/telegram/pollingRunner.ts` with `dotenv/config`, startup/conflict logs
- [x] T040 [P] Extend `.env.example`: `RAG_MAX_DISTANCE`, `DOCS_BASE_URL`, `TELEGRAM_BOT_USERNAME` guidance
- [x] T041 [US1] `/start` greeting + `isHelpIntent` fixed replies (no RAG) in `src/telegram/processMessage.ts` + `src/telegram/updates.ts`
- [x] T042 [US1] `stripBotMentionFromText` before RAG; raise `RAG_MAX_DISTANCE` default to `0.62` in `src/rag/prompts.ts`
- [x] T043 [US1] `src/telegram/markdownToTelegramHtml.ts` + `parse_mode: HTML` in `sendTelegramMessage`; plain fallback on parse error
- [x] T044 [P] [US2] Migration `004_chat_message_telegram_user.sql` + persist `telegram_username`, `telegram_user_first_name` in `processMessage.ts`
- [x] T045 [P] [US5] Migration `005_unanswered_messages.sql` + `markMessageUnanswered` / `listUnansweredMessages` in `src/db/chatMessages.ts`
- [x] T046 [US5] `app/(panel)/unanswered/page.tsx` + `UnansweredTable.tsx`; nav item in `src/ui/Sidebar.tsx`
- [x] T047 [US3] `ChatHistoryClient.tsx`: Telegram user link, `#message-{id}` anchors, auto-scroll/load older, highlight ring
- [x] T048 [P] [US3] `src/utils/formatDateTime.ts` fixed locale/timezone (hydration fix); `src/utils/chatMessageLink.ts`, `telegramUser.ts`, `unansweredReason.ts`
- [x] T049 [P] Extend `GET /api/chats/[id]/messages` response with `telegramUserId`, `telegramUsername`, `telegramUserFirstName`
- [x] T050 [P] Unit tests: `isHelpIntent`, `stripBotMentionFromText`, `markdownToTelegramHtml`, `chatMessageLink`, `unansweredReason`, `formatDateTime`; update `prompts.test.ts` for threshold 0.62
- [x] T051 Update spec artifacts (`spec.md`, `research.md`, `data-model.md`, `contracts/api.md`, `quickstart.md`, `plan.md`, `tasks.md`) for v1.1

---

## Dependencies & Execution Order

| Phase | Depends on |
|--------|------------|
| Phase 1 | — |
| Phase 2 | Phase 1 (openai package, rag:index script) |
| Phase 3 (US1) | Phase 2 (DB + indexed chunks + retrieve) |
| Phase 4 (US2) | Phase 3 (`processMessage.ts` exists) |
| Phase 5 (US3) | Phase 2 (`chatMessages.ts`); best after Phase 4 (есть данные) |
| Phase 6 (US4) | Phase 3 (`answer.ts`, `processMessage.ts`) |
| Phase 7 | US1–US4 functionally complete |
| Phase 8 | Phase 7 (MVP shipped); incremental v1.1 |

### User Story Dependencies

| Story | Priority | Depends on | Independent test |
|-------|----------|------------|------------------|
| US1 | P1 | Phase 2 | Вопрос в Telegram → ответ |
| US2 | P1 | US1 pipeline | Все реплики в `chat_messages` |
| US3 | P2 | `chat_messages` data | `/chats/[id]` UI |
| US4 | P3 | US1 | Out-of-scope / error messages |
| US5 | P2 | US1 + US4 | `/unanswered` list with links to chat messages |

**Note**: US3 API/UI can start after Phase 2 (T005) in parallel with US1, but meaningful UI test needs messages from US1/US2.

### Parallel Opportunities

**Phase 2** (after T004 migration): T005–T010 in parallel; then T011→T012→T013 sequential; T014 after T006+T011.

**Phase 3**: T015+T017+T018 parallel; then T016→T019→T020→T021→T022.

**Phase 5**: T026 parallel with T027–T028 after API contract stable.

**Phase 7**: T034, T035, T038 parallel.

---

## Parallel Example: Phase 2

```bash
# After T004 migration lands:
T005 chatMessages.ts
T006 knowledgeChunks.ts
T007 knowledgeIndexRuns.ts + processedTelegramUpdates.ts
T008 markdown chunker
T009 csv chunker
T010 openApi chunker
# Then sequentially: T011 embed → T012 indexKnowledge → T013 CLI → T014 retrieve
```

## Parallel Example: User Story 1

```bash
T015 prompts.ts
T017 updates.ts (normalizeIncomingMessage)
T018 botIdentity.ts
# Then: T016 answer.ts → T019 send split → T020 processMessage → T021 handleUpdate → T022 webhook
```

---

## Implementation Strategy

### MVP (minimum shippable)

1. Phase 1: T001–T003  
2. Phase 2: T004–T014 (+ run `rag:index`)  
3. Phase 3: T015–T022  
4. **STOP and VALIDATE**: quickstart steps 4–5 (bot answer)  
5. Phase 4: T023–T025 (persistence guarantee)

### Full delivery

1. MVP above  
2. Phase 5: T026–T029 (admin history)  
3. Phase 6: T030–T033 (graceful failures)  
4. Phase 7: T034–T038 (tests, docs, CI green)
5. Phase 8: T039–T051 (polling, unanswered, markdown, spec sync)

### Suggested MVP scope

**User Story 1 only** (Phases 1–3 + T023–T024 from US2 for context/history writes) — delivers ответы бота; US3/US4 — следующие инкременты.

---

## Notes

- PostgreSQL image must support **pgvector** (`CREATE EXTENSION vector`).
- Long polling: `npm run telegram:poll` → `src/telegram/pollingRunner.ts` → `handleTelegramUpdate`; only one `getUpdates` per token.
- Do not log full prompts or `OPENAI_API_KEY` (Constitution Gate C).
- Group chats: non-addressed messages are **not** saved and **not** answered (spec Edge Cases); privacy mode — only @mention/reply/command delivered.
- Fixed replies (`/start`, `/help`, `isHelpIntent`) skip RAG and `unanswered_reason`.
- Admin chat history shows raw Markdown; Telegram replies use HTML formatting (FR-014).
