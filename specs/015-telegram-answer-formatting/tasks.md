---
description: "Список задач для фичи «Улучшение внешнего вида ответа в Telegram»"
---

# Tasks: Улучшение внешнего вида ответа в Telegram

**Input**: Design documents from `/specs/015-telegram-answer-formatting/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/telegram-formatting.md`, `quickstart.md`  
**Язык**: русский (Конституция, принцип VI)

**Organization**: Setup → Foundational → US1 (P1, MVP) → US2 (P1) → US3 (P2) → US4 (P3) → Polish. ID `T###`; `[P]` = можно выполнять параллельно.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: разные файлы, нет жёсткой зависимости от незавершённых задач в той же фазе
- **[Story]**: `[US1]` / `[US2]` / `[US3]` / `[US4]`
- Пути от корня репозитория

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Подготовка к изменениям без новых зависимостей и миграций.

- [x] T001 [P] Сверить контракт `specs/015-telegram-answer-formatting/contracts/telegram-formatting.md` с текущей реализацией `src/telegram/markdownToTelegramHtml.ts`, `src/telegram/send.ts`, `src/telegram/processMessage.ts`, `src/rag/prompts.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Функция санитизации Markdown — **блокирует US1, US2, US4** (пайплайн доставки).

**Checkpoint**: `sanitizeMarkdownForTelegram` экспортирована; `npm test -- tests/unit/telegram/markdownToTelegramHtml.test.ts` проходит для кейсов санитизации.

- [x] T002 Реализовать `sanitizeMarkdownForTelegram(markdown: string): string` в `src/telegram/markdownToTelegramHtml.ts` по контракту `specs/015-telegram-answer-formatting/contracts/telegram-formatting.md` (плейсхолдеры для fenced code, заголовки → жирный, таблицы → списки, `---`/`***`/`___` → пустая строка, сноски и `![alt](url)` удалить/упростить)
- [x] T003 [P] Добавить unit-тесты санитизации в `tests/unit/telegram/markdownToTelegramHtml.test.ts`: заголовки `##`, GFM-таблица, горизонтальный разделитель, code block с `#` внутри не ломается, идемпотентность повторного вызова

---

## Phase 3: User Story 1 — Читаемый ответ без «сырой» разметки (Priority: P1) 🎯 MVP

**Goal**: В ответах бота в Telegram нет сырых `#`, `|`, `---` и другой неподдерживаемой разметки.

**Independent Test**: Пропустить типовой ответ модели с `## Шаги`, таблицей и `---` через `sanitizeMarkdownForTelegram` — на выходе только читаемый текст со списками и `**жирным**`.

### Implementation for User Story 1

- [x] T004 [US1] Доработать преобразование GFM-таблиц в `sanitizeMarkdownForTelegram` в `src/telegram/markdownToTelegramHtml.ts`: строка заголовков → `- col1 — col2`, разделитель `|---|` удалять, строки данных → маркированный список
- [x] T005 [P] [US1] Добавить в `tests/unit/telegram/markdownToTelegramHtml.test.ts` интеграционный кейс «смешанный ответ» (заголовок + таблица + абзац + `---`) — на выходе нет `|`, `#`, `---`

**Checkpoint**: FR-001, FR-003 выполняются на уровне unit-тестов санитизации.

---

## Phase 4: User Story 2 — Выделение важного через поддерживаемое форматирование (Priority: P1)

**Goal**: Жирный, курсив, код, блоки кода, ссылки и зачёркивание корректно отображаются в Telegram HTML.

**Independent Test**: `markdownToTelegramHtml` для строки с `**bold**`, `*italic*`, `` `code` ``, `~~strike~~`, ссылкой и fenced block возвращает валидный HTML с экранированием `<`, `>`, `&`.

### Implementation for User Story 2

- [x] T006 [US2] Расширить `markdownToTelegramHtml` в `src/telegram/markdownToTelegramHtml.ts`: конвертация `~~текст~~` → `<s>текст</s>` после bold/italic, до `escapeHtml`; сохранить существующие `resolveDocUrl` и нормализацию доменов из фичи `014-correct-links`
- [x] T007 [P] [US2] Добавить тесты в `tests/unit/telegram/markdownToTelegramHtml.test.ts`: strikethrough, смешанное форматирование (bold + link + code), экранирование `a < b` вне тегов

**Checkpoint**: FR-002, FR-004, FR-005, FR-007 покрыты конвертером; ссылки не регрессируют.

---

## Phase 5: User Story 3 — Структурированный ответ без заголовков Markdown (Priority: P2)

**Goal**: Модель генерирует структурированные ответы (списки, жирные подзаголовки) без таблиц и `#`-заголовков.

**Independent Test**: `SYSTEM_PROMPT` содержит явные запреты (таблицы, `#`, `---`) и разрешения (жирный, списки, код, ссылки); блок правил ссылок из `014-correct-links` сохранён.

### Implementation for User Story 3

- [x] T008 [US3] Заменить секцию форматирования в `SYSTEM_PROMPT` в `src/rag/prompts.ts`: запрет таблиц/заголовков/горизонтальных линий/изображений/сносок; разрешение `**жирный**`, `*курсив*`, код, ссылки, нумерованные и маркированные списки; подзаголовки — жирным на отдельной строке; сравнения — списком
- [x] T009 [P] [US3] Обновить `tests/unit/rag/prompts.test.ts`: проверить наличие правил Telegram-оформления и сохранение правил ссылок (`docs.inappstory.ru`, `console.inappstory.ru`, `api.inappstory.ru`)

**Checkpoint**: FR-006 на уровне промпта; модель реже генерирует запрещённую разметку.

---

## Phase 6: User Story 4 — Согласованность при просмотре истории чата (Priority: P3)

**Goal**: Пайплайн доставки применяет санитизацию; в `chat_messages.content` сохраняется санитизированный Markdown; длинные ответы не режутся внутри code block.

**Independent Test**: После ответа бота в `/chats` текст без `#`, `|---|`, сырой таблицы; совпадает с тем, что прошло через `sanitizeMarkdownForTelegram`.

### Implementation for User Story 4

- [x] T010 [US4] Обновить `sendBotReply` в `src/telegram/processMessage.ts`: `sanitizeMarkdownForTelegram(text)` → `splitLongTelegramText` → `markdownToTelegramHtml` → отправка; в `insertChatMessage` сохранять полный **санитизированный** Markdown (не сырой вывод модели)
- [x] T011 [US4] Улучшить `splitLongTelegramText` в `src/telegram/send.ts`: не разрезать внутри fenced code block (сдвиг границы к закрывающим ` ``` `)
- [x] T012 [P] [US4] Создать `tests/unit/telegram/splitLongTelegramText.test.ts`: разбиение длинного текста по абзацам; длинный ответ с code block не режется посередине блока

**Checkpoint**: FR-008, FR-009 выполнены; fallback plain text при ошибке HTML без изменений.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Регрессия, линт, ручная приёмка.

- [x] T013 [P] Запустить `npm test` и `npm run lint`; исправить ошибки в затронутых файлах
- [x] T014 Выполнить ручную проверку по чеклисту `specs/015-telegram-answer-formatting/quickstart.md` (§3–§5): структура, код, таблицы, длинные ответы, история `/chats`, регрессия ссылок `014-correct-links`

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup)
    ↓
Phase 2 (Foundational: sanitizeMarkdownForTelegram)  ← BLOCKS US1–US4
    ↓
Phase 3 (US1) ──┐
Phase 4 (US2) ──┼── можно частично параллельно после Phase 2
Phase 5 (US3) ──┤   (US2 не зависит от US1; US3 не зависит от US2)
    ↓           │
Phase 6 (US4) ←─┘   (интеграция пайплайна — после T002, желательно после T006)
    ↓
Phase 7 (Polish)
```

### User Story Dependencies

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| **US1** (P1) | Phase 2 (T002) | Unit-тесты `sanitizeMarkdownForTelegram` |
| **US2** (P1) | Phase 2 (санитизированный ввод) | Unit-тесты `markdownToTelegramHtml` |
| **US3** (P2) | Нет (только `prompts.ts`) | `prompts.test.ts` |
| **US4** (P3) | T002, T006 (рекомендуется) | `splitLongTelegramText.test.ts` + `/chats` |

### Parallel Opportunities

```bash
# После T002 — параллельно:
T005 [US1]  # тесты смешанного ответа
T007 [US2]  # тесты strikethrough
T009 [US3]  # тесты промпта

# После T010 — параллельно:
T012 [US4]  # тесты split
T013        # lint + full test suite
```

---

## Parallel Example: User Story 2 + User Story 3

```bash
# Разные файлы, можно параллельно после Phase 2:
Task T006: расширить markdownToTelegramHtml в src/telegram/markdownToTelegramHtml.ts
Task T008: обновить SYSTEM_PROMPT в src/rag/prompts.ts
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup (T001)
2. Phase 2: Foundational (T002–T003)
3. Phase 3: User Story 1 (T004–T005)
4. **STOP и VALIDATE**: unit-тесты санитизации; при необходимости временно вызвать `sanitizeMarkdownForTelegram` в REPL/тесте на реальном ответе модели
5. Деплой возможен с ручным вызовом санитизации в пайплайне (T010) как минимальная интеграция

### Incremental Delivery

1. Setup + Foundational → санитизация готова
2. US1 → нет сырой разметки (MVP на уровне функции)
3. US2 → полное HTML-форматирование
4. US3 → меньше мусора от модели
5. US4 → пайплайн + история чата + split
6. Polish → quickstart

### Рекомендуемая последовательность для одного разработчика

```text
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014
```

---

## Notes

- Новые npm-пакеты и миграции БД **не требуются**
- Переиндексация базы знаний **не требуется**
- Правила ссылок `014-correct-links` **не менять**; только регрессионная проверка в T014
- Системные сообщения (`START_GREETING`, `HELP_TOPICS_REPLY`) вне scope — не трогать
- Каждая задача содержит явный путь к файлу для выполнения без дополнительного контекста

---

## Task Summary

| Метрика | Значение |
|---------|----------|
| **Всего задач** | 14 |
| **Setup** | 1 |
| **Foundational** | 2 |
| **US1** | 2 |
| **US2** | 2 |
| **US3** | 2 |
| **US4** | 3 |
| **Polish** | 2 |
| **Параллельных [P]** | 7 |
| **MVP scope** | Phase 1–3 (T001–T005) |
