# Implementation Plan: Формирование правильных ссылок в ответах бота

**Branch**: `014-correct-links` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/014-correct-links/spec.md`

**Note**: Заполнено командой `/speckit.plan`.

## Summary

Фича исправляет формирование ссылок в ответах Q&A-бота для трёх типов источников знаний:

1. **SDK-документация** → `https://docs.inappstory.ru/{path}` (путь из файла без `docs/` и `.md`)
2. **Статьи консоли** → `https://console.inappstory.ru/docs/{slug}` (колонка `slug` в `resources.csv`)
3. **REST API** → `https://api.inappstory.ru/pub/v1#/`

**Технический подход** (см. [research.md](./research.md)): гибрид — вычисление `metadata.sourceUrl` при индексации, передача URL в RAG-промпт, нормализация ссылок при конвертации Markdown → Telegram HTML. Миграции БД не требуются; после деплоя — переиндексация.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+), Next.js 16 App Router  
**Primary Dependencies**: существующие `pg`, `openai`, Telegram Bot API; без новых npm-пакетов  
**Storage**: PostgreSQL — `knowledge_chunks.metadata` (JSONB); `chat_messages.content` (Markdown)  
**Testing**: Vitest — unit для `sourceUrls`, `markdownToTelegramHtml`, `csvResources`  
**Target Platform**: Linux server / local dev  
**Project Type**: Next.js monolith — `src/rag/`, `src/telegram/`  
**Performance Goals**: Без деградации latency ответа; построение URL — O(1) на чанк  
**Constraints**: Telegram HTML `parse_mode`; ссылки только на внешние домены InAppStory  
**Scale/Scope**: ~217 md + ~83 статьи + OpenAPI операции; изменения в 6–8 файлах

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Статус |
|------|--------|
| **VI (Язык)** | Все артефакты `specs/014-correct-links/` на русском ✓ |
| **I (App Router)** | Изменения только в server modules (`src/rag`, `src/telegram`); UI не меняется ✓ |
| **II (TypeScript)** | Новый модуль с явными типами; unit-тесты ✓ |
| **III (Security)** | URL строятся из доверенных метаданных индекса; без пользовательского ввода в билдеры ✓ |
| **IV (Testing)** | Unit-тесты для билдеров URL и нормализатора ссылок ✓ |
| **V (UX)** | Кликабельные корректные ссылки в Telegram; история чата хранит тот же Markdown ✓ |

**Post-design**: Нарушений нет. Сложность оправдана тремя разными доменами и типами источников.

## Project Structure

### Documentation (this feature)

```text
specs/014-correct-links/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── source-urls.md   # Phase 1
└── tasks.md             # /speckit.tasks (не создаётся /speckit.plan)
```

### Source Code (repository root)

```text
src/rag/
├── sourceUrls.ts              # NEW — buildSdkDocUrl, buildConsoleArticleUrl, buildApiSpecUrl
├── chunkers/
│   ├── csvResources.ts        # + slug, sourceUrl в metadata
│   ├── markdown.ts            # (или indexKnowledge) + sourceUrl
│   └── openApiYaml.ts         # + sourceUrl
├── indexKnowledge.ts          # enrich metadata при upsert (если не в chunkers)
└── prompts.ts                 # SYSTEM_PROMPT + URL в контекстных блоках

src/telegram/
└── markdownToTelegramHtml.ts  # default docs.inappstory.ru, нормализация .com

tests/unit/rag/
└── sourceUrls.test.ts         # NEW

tests/unit/telegram/
└── markdownToTelegramHtml.test.ts  # обновить на .ru

.env.example                   # DOCS_BASE_URL default .ru
```

**Structure Decision**: Один новый модуль `sourceUrls.ts` как единый источник правил URL; чанкеры и промпт его переиспользуют.

## Phase 0: Research

**Статус**: ✅ Завершено — [research.md](./research.md)

Ключевые решения:

- Гибрид: index metadata + prompt + delivery normalization
- Без миграций БД
- Обязательная переиндексация после деплоя
- API deep-link в Swagger — опционально, MVP = базовый URL

## Phase 1: Design

**Статус**: ✅ Завершено

| Артефакт | Путь |
|----------|------|
| Data model | [data-model.md](./data-model.md) |
| Contracts | [contracts/source-urls.md](./contracts/source-urls.md) |
| Quickstart | [quickstart.md](./quickstart.md) |

## Phase 2: Implementation Outline (для `/speckit.tasks`)

Предлагаемая последовательность задач:

1. **T1** — `src/rag/sourceUrls.ts` + unit-тесты
2. **T2** — `csvResources.ts`: читать `slug`, писать `sourceUrl`
3. **T3** — `markdown.ts` / `openApiYaml.ts` / `indexKnowledge.ts`: `sourceUrl` в metadata
4. **T4** — `prompts.ts`: обновить `SYSTEM_PROMPT` и формат блоков контекста
5. **T5** — `markdownToTelegramHtml.ts`: default `.ru`, нормализация устаревших доменов + тесты
6. **T6** — `.env.example`, документация quickstart
7. **T7** — переиндексация на staging/prod, ручная верификация по чеклисту quickstart

**Вне scope v1**:

- Рендер Markdown-ссылок в UI `/chats` (сейчас plain text)
- Программный блок «Источники» в конце каждого ответа
- Заполнение пустых `slug` в CSV

## Complexity Tracking

Нарушений конституции, требующих обоснования, нет.

## Generated Artifacts

| Файл | Описание |
|------|----------|
| `plan.md` | Этот план |
| `research.md` | Решения по стратегии ссылок |
| `data-model.md` | Расширение `metadata`, поток данных |
| `contracts/source-urls.md` | Контракты модулей и env |
| `quickstart.md` | Инструкция для разработки и проверки |

**Следующий шаг**: `/speckit.tasks` — разбивка на задачи с зависимостями.
