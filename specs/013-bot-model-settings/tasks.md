---
description: "Actionable task list for bot model settings and knowledge reindex"
---

# Tasks: Выбор моделей эмбеддинга и ответов в настройках бота

**Input**: Design documents from `/specs/013-bot-model-settings/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/api.md`, `quickstart.md`

**Organization**: Phases — setup → foundational → User Story 1 (P1) → User Story 2 (P1) → User Story 4 (P1) → User Story 3 (P2) → polish. Tasks use sequential IDs `T###`; `[P]` = parallelizable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files / no hard ordering)
- **[Story]**: `[US1]`–`[US4]` maps to user stories in `spec.md`
- Paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline quality before feature edits.

- [x] T001 Run `npm test && npm run lint` on branch `013-bot-model-settings` and note baseline; fix only unrelated blockers before feature work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: DB schema, domain constants, and DB accessors for model fields and index-run metadata.

**Checkpoint**: Migration `007` applies; `getBotSettings()` returns `answer_model` and `embedding_model`; `completeIndexRun` accepts `embedding_model`.

- [x] T002 Add migration `src/db/migrations/007_bot_model_settings.sql` (`bot_settings.answer_model`, `bot_settings.embedding_model`, `knowledge_index_runs.embedding_model` with CHECK constraints per `data-model.md`)
- [x] T003 [P] Add allowed models and defaults in `src/domain/botSettings/models.ts`
- [x] T004 [P] Extend `BotSettingsUpdateSchema` with optional `answerModel` and `embeddingModel` enums in `src/domain/botSettings/validate.ts`
- [x] T005 Extend `getBotSettings` / `upsertBotSettings` for `answer_model` and `embedding_model` in `src/db/botSettings.ts`
- [x] T006 Extend `src/db/knowledgeIndexRuns.ts`: `embedding_model` on row type; `completeIndexRun(runId, chunkCount, embeddingModel)`; add `getLatestCompletedIndexRun()` and `getRunningIndexRun()`
- [x] T007 [P] Add unit tests for model constants and zod validation in `tests/unit/domain/botSettingsModels.test.ts`

---

## Phase 3: User Story 1 — Выбор модели для ответов бота (Priority: P1) 🎯 MVP

**Goal**: Администратор выбирает и сохраняет модель ответов (`gpt-4.1` / `gpt-5.5`); новые ответы бота используют сохранённое значение.

**Independent Test**: Сохранить `gpt-5.5` в настройках → задать боту вопрос → ответ формируется новой моделью (лог/поведение).

### Implementation for User Story 1

- [x] T008 [US1] Resolve `answer_model` from `getBotSettings()` in `src/rag/answer.ts` (replace hardcoded `CHAT_MODEL`)
- [x] T009 [US1] Extend `GET` / `PUT` in `app/api/bot-settings/route.ts` to read/write `answerModel` per `contracts/api.md`
- [x] T010 [US1] Add answer model selector to `app/(panel)/bot/BotSettingsForm.tsx` (load/save via `/api/bot-settings`)

**Checkpoint**: Answer model round-trips through API and is used by `answerQuestion`.

---

## Phase 4: User Story 2 — Выбор модели для эмбеддингов (Priority: P1)

**Goal**: Администратор выбирает модель эмбеддингов; индексация и поиск используют сохранённое значение; при смене — предупреждение о переиндексации.

**Independent Test**: Сохранить `text-embedding-3-large` → выполнить `npm run rag:index` → run записывает `embedding_model = text-embedding-3-large`.

### Implementation for User Story 2

- [x] T011 [US2] Resolve `embedding_model` from `getBotSettings()` in `src/rag/embed.ts`; pass `dimensions: 1536` for both models per `research.md`
- [x] T012 [US2] Extend `PUT` in `app/api/bot-settings/route.ts` with `embeddingModel` and response flag `embeddingModelChanged` per `contracts/api.md`
- [x] T013 [US2] Extend `GET` in `app/api/bot-settings/route.ts` to return `embeddingModel`
- [x] T014 [US2] Add embedding model selector to `app/(panel)/bot/BotSettingsForm.tsx`
- [x] T015 [US2] Show post-save Alert when `embeddingModelChanged === true` in `app/(panel)/bot/BotSettingsForm.tsx` (FR-007)

**Checkpoint**: Embedding model persists; CLI `rag:index` uses DB setting after T018.

---

## Phase 5: User Story 4 — Переиндексация после смены модели эмбеддингов (Priority: P1)

**Goal**: Кнопка reindex на экране настроек + CLI; статус выполняется/готово/ошибка с автообновлением; без параллельных запусков.

**Independent Test**: Сменить embedding model → reindex из UI → статус `running` → `current` без перезагрузки страницы.

### Implementation for User Story 4

- [x] T016 [US4] Implement `getKnowledgeIndexStatus()` in `src/rag/knowledgeIndexStatus.ts` per `data-model.md` state rules
- [x] T017 [P] [US4] Add unit tests for index status logic in `tests/unit/rag/knowledgeIndexStatus.test.ts`
- [x] T018 [US4] Update `src/rag/indexKnowledge.ts` to read embedding model from settings and pass to `completeIndexRun`
- [x] T019 [US4] Add `GET` handler in `app/api/knowledge/index-status/route.ts` with `requireAuth` per `contracts/api.md`
- [x] T020 [US4] Add reindex button calling `POST /api/knowledge/reindex` in `app/(panel)/bot/BotSettingsForm.tsx`
- [x] T021 [US4] Add 3s polling of `/api/knowledge/index-status` until terminal state; disable reindex while `running` in `app/(panel)/bot/BotSettingsForm.tsx`
- [x] T022 [US4] Skip RAG retrieval when index status is `outdated` in `src/telegram/processMessage.ts` (fallback before `retrieveContext`)

**Checkpoint**: Full reindex flow from UI; CLI records `embedding_model` on completed run.

---

## Phase 6: User Story 3 — Единый экран настроек бота (Priority: P2)

**Goal**: Имя, токен, обе модели, статус индекса и reindex на одной странице `/bot`.

**Independent Test**: Открыть `/bot` — все блоки видны; сохранение моделей без повторного ввода токена.

### Implementation for User Story 3

- [x] T023 [US3] Add knowledge index status block to `app/(panel)/bot/BotSettingsForm.tsx`: stale indicator, `lastCompletedAt`, states `never_indexed` / `current` / `outdated` / `running` / `failed`
- [x] T024 [US3] Group form sections in `app/(panel)/bot/BotSettingsForm.tsx`: bot identity, model settings, knowledge base (status + reindex), existing webhook block

**Checkpoint**: SC-001, SC-007 — admin sees unified settings and stale index indicator.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Integration coverage, regression check, docs.

- [x] T025 [P] Add integration tests for extended bot-settings API in `tests/integration/botSettingsModels.test.ts`
- [x] T026 [P] Add integration tests for index-status and reindex metadata in `tests/integration/knowledgeIndexStatus.test.ts`
- [x] T027 Run manual verification per `specs/013-bot-model-settings/quickstart.md` (sections 3–8)
- [x] T028 Run `npm test && npm run lint && npm run build`; fix regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** (foundational blocks all stories)
- **Phase 3 (US1)** after Phase 2
- **Phase 4 (US2)** after Phase 2; can start after T009 pattern exists (sequential with US1 API is fine)
- **Phase 5 (US4)** after Phase 4 (needs embedding model in settings + embed.ts)
- **Phase 6 (US3)** after Phase 5 (status block needs index-status API)
- **Phase 7** after desired stories complete

### User Story Dependencies

| Story | Depends on | Delivers independently |
|-------|------------|------------------------|
| US1 (P1) | Foundational | Answer model via API + RAG |
| US2 (P1) | Foundational, US1 API pattern | Embedding model + save warning |
| US4 (P1) | US2 | Reindex UI/CLI + index status |
| US3 (P2) | US1, US2, US4 | Unified layout + status display |

### Parallel Opportunities

```bash
# Foundational (after T002):
T003 models.ts ∥ T004 validate.ts ∥ T007 unit tests (after T003–T004)

# US4:
T016 knowledgeIndexStatus.ts then T017 unit tests ∥ T018 indexKnowledge.ts

# Polish:
T025 botSettings integration ∥ T026 index-status integration
```

---

## Parallel Example: User Story 4

```bash
# After T016 lands:
Task T017: "unit tests in tests/unit/rag/knowledgeIndexStatus.test.ts"
Task T018: "update src/rag/indexKnowledge.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 + Phase 2
2. Phase 3 (US1): answer model in settings + `answer.ts`
3. **Validate**: change answer model, confirm bot uses it
4. Stop or continue to US2/US4

### Incremental Delivery

1. Foundational → US1 (answer model) → demo
2. US2 (embedding model + warning) → demo
3. US4 (reindex + status + telegram guard) → demo
4. US3 (layout polish) → polish/tests

### Suggested MVP Scope

**User Story 1** (Phase 3) after Foundational — минимальная ценность: выбор модели ответов без переиндексации.

---

## Notes

- `POST /api/knowledge/reindex` already exists — extend behavior via `indexKnowledge()`, do not duplicate route
- Historical completed runs without `embedding_model` → treat as `text-embedding-3-small` in status logic
- No new env vars for model selection (DB-backed per contracts)
- Commit after each phase checkpoint
