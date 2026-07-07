# Implementation Plan: Улучшение внешнего вида ответа в Telegram

**Branch**: `015-telegram-answer-formatting` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/015-telegram-answer-formatting/spec.md`

**Note**: Заполнено командой `/speckit.plan`.

## Summary

Фича устраняет «сырую» неподдерживаемую Markdown-разметку (таблицы, заголовки `#`, горизонтальные линии) в ответах Q&A-бота в Telegram и усиливает читаемость через поддерживаемое форматирование: жирный, курсив, код, ссылки.

**Технический подход** (см. [research.md](./research.md)): гибрид — обновление `SYSTEM_PROMPT` + детерминированная санитизация Markdown (`sanitizeMarkdownForTelegram`) + расширение `markdownToTelegramHtml` + безопасное разбиение длинных сообщений. Миграции БД и переиндексация не требуются; в `chat_messages.content` сохраняется санитизированный Markdown.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+), Next.js 16 App Router  
**Primary Dependencies**: существующие `pg`, `openai`, Telegram Bot API; без новых npm-пакетов  
**Storage**: PostgreSQL — `chat_messages.content` (семантика: санитизированный Markdown для role=bot)  
**Testing**: Vitest — unit для санитизации, конвертера HTML, split, промпта  
**Target Platform**: Linux server / local dev; Telegram clients (HTML parse_mode)  
**Project Type**: Next.js monolith — `src/rag/`, `src/telegram/`  
**Performance Goals**: Постобработка Markdown — O(n) по длине ответа; без заметной деградации latency  
**Constraints**: Лимит Telegram 4096 символов; только HTML parse_mode; ссылки по контракту `014-correct-links`  
**Scale/Scope**: Изменения в 4–5 файлах + тесты; без UI и миграций

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Статус |
|------|--------|
| **VI (Язык)** | Все артефакты `specs/015-telegram-answer-formatting/` на русском ✓ |
| **I (App Router)** | Изменения только в server modules (`src/rag`, `src/telegram`); UI не меняется ✓ |
| **II (TypeScript)** | Новые функции с явными типами; unit-тесты для санитизации и конвертации ✓ |
| **III (Security)** | Экранирование HTML сохраняется; пользовательский ввод не проходит через санитайзер ответа ✓ |
| **IV (Testing)** | Unit-тесты для преобразований и граничных случаев (таблицы, code blocks, split) ✓ |
| **V (UX)** | Читаемые ответы в Telegram; история чата без сырой разметки ✓ |

**Post-design**: Нарушений нет. Дополнительная сложность (санитизация + промпт) оправдана требованием детерминизма FR-003.

## Project Structure

### Documentation (this feature)

```text
specs/015-telegram-answer-formatting/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── telegram-formatting.md
└── tasks.md             # /speckit.tasks (не создаётся /speckit.plan)
```

### Source Code (repository root)

```text
src/rag/
└── prompts.ts                 # SYSTEM_PROMPT — Telegram-совместимое оформление

src/telegram/
├── markdownToTelegramHtml.ts  # + sanitizeMarkdownForTelegram, ~~strike~~
├── send.ts                    # splitLongTelegramText — code-block-aware
└── processMessage.ts          # пайплайн sanitize → split → html → persist

tests/unit/telegram/
├── markdownToTelegramHtml.test.ts
└── splitLongTelegramText.test.ts   # NEW

tests/unit/rag/
└── prompts.test.ts               # обновить
```

**Structure Decision**: Санитизация и конвертация остаются в `src/telegram/` рядом с доставкой; промпт — единственное изменение в RAG-слое.

## Phase 0: Research

**Статус**: ✅ Завершено — [research.md](./research.md)

Ключевые решения:

- Гибрид: промпт + `sanitizeMarkdownForTelegram` + расширение HTML-конвертера
- Без новых npm-пакетов и миграций БД
- Сохранение в БД — санитизированный Markdown
- Разбиение длинных сообщений — не внутри fenced code blocks
- Правила ссылок `014-correct-links` без изменений

## Phase 1: Design

**Статус**: ✅ Завершено

| Артефакт | Путь |
|----------|------|
| Data model | [data-model.md](./data-model.md) |
| Contracts | [contracts/telegram-formatting.md](./contracts/telegram-formatting.md) |
| Quickstart | [quickstart.md](./quickstart.md) |

## Phase 2: Implementation Outline (для `/speckit.tasks`)

Предлагаемая последовательность задач:

1. **T1** — `sanitizeMarkdownForTelegram` + unit-тесты (заголовки, таблицы, `---`, code blocks)
2. **T2** — Расширить `markdownToTelegramHtml` (`~~strike~~`) + тесты
3. **T3** — Улучшить `splitLongTelegramText` (не резать code blocks) + тесты
4. **T4** — Обновить `sendBotReply` в `processMessage.ts`: sanitize → split → html; persist sanitized
5. **T5** — Обновить `SYSTEM_PROMPT` в `prompts.ts` + тесты
6. **T6** — Ручная верификация по [quickstart.md](./quickstart.md)

**Вне scope v1**:

- Рендер Markdown в панели `/chats`
- Spoiler, blockquote, underline в генерации модели
- Хранение сырого и санитизированного текста в двух полях БД
- Переход на MarkdownV2

## Complexity Tracking

Нарушений конституции, требующих обоснования, нет.
