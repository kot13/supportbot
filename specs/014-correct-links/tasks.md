---
description: "Список задач для фичи «Формирование правильных ссылок в ответах бота»"
---

# Tasks: Формирование правильных ссылок в ответах бота

**Input**: Design documents from `/specs/014-correct-links/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/source-urls.md`, `quickstart.md`  
**Язык**: русский (Конституция, принцип VI)

**Organization**: Setup → Foundational → US1 (P1, MVP) → US2 (P1) → US3 (P1) → US4 (P2) → Polish. ID `T###`; `[P]` = можно выполнять параллельно.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: разные файлы, нет жёсткой зависимости от незавершённых задач в той же фазе
- **[Story]**: `[US1]` / `[US2]` / `[US3]` / `[US4]`
- Пути от корня репозитория

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Подготовка env и документации перед изменениями кода.

- [x] T001 Обновить комментарий и пример `DOCS_BASE_URL` на `https://docs.inappstory.ru` в `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Общий модуль построения URL — **блокирует все user stories**.

**Checkpoint**: `buildSourceUrl` покрыт unit-тестами; `npm test -- tests/unit/rag/sourceUrls.test.ts` проходит.

- [x] T002 Создать `src/rag/sourceUrls.ts` с функциями `buildSdkDocUrl`, `buildConsoleArticleUrl`, `buildApiSpecUrl`, `buildSourceUrl` по контракту `specs/014-correct-links/contracts/source-urls.md`
- [x] T003 [P] Добавить `tests/unit/rag/sourceUrls.test.ts`: SDK path без `.md`, console slug, пустой slug → `null`, API базовый URL, диспетчер `buildSourceUrl`

---

## Phase 3: User Story 1 — Корректные ссылки на документацию SDK (Priority: P1) 🎯 MVP

**Goal**: Ответы бота содержат кликабельные ссылки на `https://docs.inappstory.ru/{path}` для материалов SDK.

**Independent Test**: Задать боту вопрос про Android SDK; ссылка в ответе ведёт на `https://docs.inappstory.ru/sdk-guides/android/...` без `.md`.

### Implementation for User Story 1

- [x] T004 [US1] Добавить `metadata.sourceUrl` для чанков `sdk_doc` в `src/rag/indexKnowledge.ts` (вызов `buildSourceUrl` при upsert) или в `src/rag/chunkers/markdown.ts`
- [x] T005 [US1] Обновить `SYSTEM_PROMPT` и `buildUserPrompt` в `src/rag/prompts.ts`: правила ссылок на SDK (`docs.inappstory.ru`), строка `URL:` в блоках контекста из `metadata.sourceUrl`
- [x] T006 [US1] Изменить дефолт `DOCS_BASE_URL` на `https://docs.inappstory.ru` и нормализацию `docs.inappstory.com` → `.ru` в `src/telegram/markdownToTelegramHtml.ts`
- [x] T007 [P] [US1] Обновить ожидания и добавить кейсы нормализации домена в `tests/unit/telegram/markdownToTelegramHtml.test.ts`

**Checkpoint**: После `npm run rag:index` вопрос про SDK даёт ссылки на `docs.inappstory.ru`.

---

## Phase 4: User Story 2 — Корректные ссылки на статьи консоли (Priority: P1)

**Goal**: Ссылки на статьи консоли ведут на `https://console.inappstory.ru/docs/{slug}`.

**Independent Test**: Вопрос про роли в консоли → ссылка `https://console.inappstory.ru/docs/roles-management` (не `resources.csv#id`).

### Implementation for User Story 2

- [x] T008 [US2] Читать колонку `slug` и записывать `metadata.slug` + `metadata.sourceUrl` в `src/rag/chunkers/csvResources.ts`
- [x] T009 [US2] Дополнить `SYSTEM_PROMPT` в `src/rag/prompts.ts`: шаблон ссылок на консоль (`console.inappstory.ru/docs/{slug}`), запрет `resources.csv#`
- [x] T010 [P] [US2] Добавить тесты парсинга `slug` и `sourceUrl` в `tests/unit/rag/chunkers.test.ts`

**Checkpoint**: После reindex статьи консоли имеют `sourceUrl` в metadata; ответ бота не содержит `resources.csv#`.

---

## Phase 5: User Story 3 — Корректные ссылки на публичное REST API (Priority: P1)

**Goal**: Ссылки на API ведут на `https://api.inappstory.ru/pub/v1#/`.

**Independent Test**: Вопрос про эндпоинт API → ссылка на портал `api.inappstory.ru`, не на docs/console.

### Implementation for User Story 3

- [x] T011 [US3] Добавить `metadata.sourceUrl` для чанков `api_spec` через `buildApiSpecUrl` в `src/rag/chunkers/openApiYaml.ts` или `src/rag/indexKnowledge.ts`
- [x] T012 [US3] Дополнить `SYSTEM_PROMPT` в `src/rag/prompts.ts`: шаблон ссылок на REST API (`api.inappstory.ru/pub/v1#/`)

**Checkpoint**: Вопрос про API даёт ссылку на `api.inappstory.ru`; три типа источников различаются по домену.

---

## Phase 6: User Story 4 — Единообразие ссылок в истории чата (Priority: P2)

**Goal**: В `/chats` сохранён тот же Markdown с URL, что ушёл пользователю в Telegram.

**Independent Test**: Сравнить текст ответа бота в Telegram и в панели `/chats/{id}` — URL совпадают.

### Implementation for User Story 4

- [x] T013 [US4] Убедиться, что `src/telegram/processMessage.ts` в `sendBotReply` сохраняет в `chat_messages.content` исходный Markdown (до `markdownToTelegramHtml`); при необходимости зафиксировать поведение комментарием или минимальной правкой
- [x] T014 [P] [US4] Проверить, что `src/rag/unansweredSnapshot.ts` прокидывает `metadata.sourceUrl` в снимках контекста для админки

**Checkpoint**: FR-006 выполнен без расхождения URL между Telegram и историей чата.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Переиндексация, регрессии, финальная проверка.

- [x] T015 Выполнить `npm run rag:index` локально и убедиться, что `knowledge_chunks.metadata` содержит `sourceUrl` для всех трёх типов источников
- [x] T016 [P] Прогнать `npm test && npm run lint` и исправить регрессии в затронутых модулях
- [x] T017 [P] Обновить тесты `tests/unit/rag/prompts.test.ts` при изменении формата `buildUserPrompt`
- [x] T018 Выполнить ручную проверку по чеклисту `specs/014-correct-links/quickstart.md` (SDK, консоль, API, история чата)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей
- **Foundational (Phase 2)**: зависит от Phase 1 — **блокирует US1–US4**
- **US1 (Phase 3)**: зависит от Phase 2 — **MVP**
- **US2 (Phase 4)**: зависит от Phase 2; логически после US1 (общий `prompts.ts`), но chunker CSV независим от SDK
- **US3 (Phase 5)**: зависит от Phase 2; `prompts.ts` лучше завершить после US1–US2
- **US4 (Phase 6)**: зависит от US1–US3 (нужны корректные URL в ответах)
- **Polish (Phase 7)**: после всех желаемых user stories

### User Story Dependencies

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| US1 (P1) | Phase 2 | Вопрос про SDK → `docs.inappstory.ru` |
| US2 (P1) | Phase 2, reindex | Вопрос про консоль → `console.inappstory.ru/docs/{slug}` |
| US3 (P1) | Phase 2, reindex | Вопрос про API → `api.inappstory.ru/pub/v1#/` |
| US4 (P2) | US1–US3 | Сравнение URL Telegram vs `/chats` |

### Within Each User Story

1. Metadata / chunker (источник URL)
2. Промпт (инструкции модели)
3. Доставка / Telegram (для US1)
4. Тесты

### Parallel Opportunities

- **Phase 2**: T003 параллельно после T002
- **Phase 3**: T007 параллельно с T004–T006 (разные файлы; T007 после T006 по смыслу)
- **Phase 4**: T010 параллельно с T008–T009
- **Phase 6**: T014 параллельно с T013
- **Phase 7**: T016 и T017 параллельно

---

## Parallel Example: User Story 1

```bash
# После T002 (sourceUrls готов):
# Параллельно:
Task T004: metadata.sourceUrl в src/rag/indexKnowledge.ts
Task T006: дефолт .ru в src/telegram/markdownToTelegramHtml.ts
# Затем T005 (prompts) и T007 (тесты markdown)
```

## Parallel Example: User Stories 2 и 3

```bash
# После завершения US1 (prompts частично готов):
# Параллельно разными разработчиками:
Developer A: T008–T010 (csvResources + тесты)  # US2
Developer B: T011–T012 (openApiYaml + prompt)   # US3
# Затем объединить изменения prompts.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup (T001)
2. Phase 2: Foundational (T002–T003)
3. Phase 3: User Story 1 (T004–T007)
4. `npm run rag:index`
5. **STOP and VALIDATE**: вопрос про Android SDK в Telegram

### Incremental Delivery

1. Setup + Foundational → модуль URL готов
2. US1 → SDK-ссылки → reindex → demo (**MVP**)
3. US2 → статьи консоли → reindex → demo
4. US3 → API-ссылки → reindex → demo
5. US4 → консистентность истории чата
6. Polish → lint, тесты, quickstart

### Suggested MVP Scope

**User Story 1** (Phase 1–3): корректные ссылки на документацию SDK — минимальная ценность для разработчиков, использующих бота.

---

## Notes

- Миграции БД **не требуются** — используется `knowledge_chunks.metadata` (JSONB)
- После каждого изменения chunkers или `indexKnowledge.ts` нужен `npm run rag:index`
- `prompts.ts` затрагивается в US1–US3 — при параллельной работе мержить аккуратно
- Вне scope v1: рендер Markdown в UI `/chats`, блок «Источники» в конце ответа, заполнение пустых `slug` в CSV

---

## Task Summary

| Метрика | Значение |
|---------|----------|
| **Всего задач** | 18 |
| **Setup** | 1 |
| **Foundational** | 2 |
| **US1 (P1)** | 4 |
| **US2 (P1)** | 3 |
| **US3 (P1)** | 2 |
| **US4 (P2)** | 2 |
| **Polish** | 4 |
| **Параллельных [P]** | 7 |
