# Implementation Plan: Контекст и метаданные для неотвеченных вопросов

**Branch**: `011-unanswered-context-metadata` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/011-unanswered-context-metadata/spec.md`

**Note**: Filled by `/speckit.plan`.

## Summary

Фича **011** расширяет мониторинг неотвеченных вопросов (`009-bot-qa-rag`):

1. **Сохранение**: при `markMessageUnanswered` записывать неизменяемый снимок RAG-контекста (найденные чанки + диалог + метаданные обработки) в таблицу `unanswered_context_snapshots`.
2. **Просмотр**: в `/unanswered` — компактная таблица без изменений; детали через HeroUI Modal с lazy `GET /api/unanswered/[messageId]/context`.
3. **План**: миграция `006`; модуль `src/rag/unansweredSnapshot.ts`; расширение `processMessage` и `chatMessages`; API route; UI modal.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+), Next.js 16 App Router  
**Primary Dependencies**: `pg`, `zod`, `@heroui/react` (Modal), существующие `src/rag/*`, `src/telegram/processMessage.ts`  
**Storage**: PostgreSQL — новая таблица `unanswered_context_snapshots` (JSONB для чанков и диалога); FK на `chat_messages`  
**Testing**: Vitest — unit (`buildUnansweredContextSnapshot`), integration (snapshot CRUD + idempotency)  
**Target Platform**: Linux server / local dev; тот же Postgres + pgvector  
**Project Type**: Next.js monolith — `app/api`, `app/(panel)/unanswered`, `src/db`, `src/rag`  
**Performance Goals**: Список `/unanswered` без деградации (snapshot не в list query); загрузка деталей ≤ 1 с для типичного снимка (≤ 20 чанков)  
**Constraints**: Без embedding и секретов в снимке; immutable insert; Server Components + Client Modal  
**Scale/Scope**: До 200 строк в списке; top-k ≤ 20 чанков на снимок; без backfill исторических записей

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router)**: Список — Server Component как сейчас; модалка — Client Component; snapshot API — route handler с `requireAuth`.
- **Gate B (TypeScript)**: Явные типы `UnansweredContextSnapshot`, `UnansweredRetrievedChunkSnapshot`; zod на API response/path params.
- **Gate C (Security)**: Snapshot не содержит ключей API; доступ только админу; 404 если сообщение не unanswered.
- **Gate D (Testing)**: Unit на построение снимка по причинам; integration на insert/get/idempotency.
- **Gate E (UX)**: Различимые состояния «поиск не выполнялся» / «0 чанков после поиска» / «legacy без снимка»; длинный content с clamp + expand.

**Post-design**: Нарушений нет. Отдельная таблица и lazy API соответствуют принципу «сервер — источник истины», без лишнего JS на первой загрузке списка.

## Project Structure

### Documentation (this feature)

```text
specs/011-unanswered-context-metadata/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── api.md           # Phase 1
└── tasks.md             # /speckit.tasks
```

### Source Code (repository root)

```text
src/db/migrations/
└── 006_unanswered_context_snapshots.sql

src/db/
├── chatMessages.ts              # extend markMessageUnanswered + optional snapshot
└── unansweredContextSnapshots.ts  # insert/get types

src/rag/
└── unansweredSnapshot.ts        # buildUnansweredContextSnapshot from RetrievedChunk[]

src/telegram/
└── processMessage.ts            # pass chunks/recentMessages into mark flow

app/api/unanswered/[messageId]/context/
└── route.ts                     # GET snapshot

app/(panel)/unanswered/
├── page.tsx                     # unchanged list load
├── UnansweredTable.tsx          # add View context + modal trigger
└── UnansweredContextModal.tsx   # NEW client modal

tests/unit/rag/
└── unansweredSnapshot.test.ts

tests/integration/
└── unansweredContextSnapshots.test.ts
```

**Structure Decision**: Минимальный diff поверх `009`: новая таблица и DB-модуль, один helper в `src/rag/`, один API route, один UI-компонент модалки.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

No constitution violations expected.

## Phase 0 & 1 Outputs

| Artifact | Path | Status |
|----------|------|--------|
| Research | [research.md](./research.md) | Complete |
| Data model | [data-model.md](./data-model.md) | Complete |
| Contracts | [contracts/api.md](./contracts/api.md) | Complete |
| Quickstart | [quickstart.md](./quickstart.md) | Complete |

## Implementation sequence (for `/speckit.tasks`)

1. **DB**: migration `006_unanswered_context_snapshots.sql`
2. **Types + DB layer**: `unansweredContextSnapshots.ts`, extend `markMessageUnanswered`
3. **Snapshot builder**: `src/rag/unansweredSnapshot.ts` + unit tests
4. **Telegram pipeline**: `processMessage.ts` — собрать snapshot по веткам (`no_knowledge_index`, retrieval paths, catch)
5. **API**: `GET /api/unanswered/[messageId]/context` + zod + `requireAuth`
6. **UI**: `UnansweredContextModal.tsx`, кнопка в `UnansweredTable.tsx`
7. **Integration tests** + quickstart verification
8. **Docs**: обновить `.cursor/rules/specify-rules.mdc` Active Technologies (при merge)

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Крупные снимки (20 × full chunk text) | Lazy load only in modal; no snapshot in list query |
| Путаница «не искали» vs «ничего не нашли» | `searchPerformed` flag + distinct UI copy (FR-008) |
| Двойная запись снимка | `ON CONFLICT DO NOTHING` + `unanswered_reason IS NULL` guard |
| Legacy rows без снимка | API returns `snapshot: null`; UI fallback message |

## Implementation notes

| Area | Detail |
|------|--------|
| Chunk snapshot | Copy all `RetrievedChunk` fields except embedding |
| `bestDistance` | `chunks[0]?.distance ?? null` when `searchPerformed` |
| `no_knowledge_index` | Snapshot row still created with `searchPerformed: false` for audit consistency |
| Modal pattern | Reuse `@heroui/react` Modal + `useOverlayState` from `BroadcastClient` |
| Human reason | Reuse `formatUnansweredReason` in modal header |
