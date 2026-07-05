# Implementation Plan: Выбор моделей эмбеддинга и ответов в настройках бота

**Branch**: `013-bot-model-settings` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/013-bot-model-settings/spec.md`

**Note**: Filled by `/speckit.plan`.

## Summary

Фича **013** расширяет настройки бота и RAG-пайплайн (`009-bot-qa-rag`):

1. **Модели в БД**: `bot_settings.answer_model` и `bot_settings.embedding_model` с дефолтами `gpt-4.1` / `text-embedding-3-small`.
2. **UI**: селекторы моделей, блок статуса индекса (устарел / актуален / выполняется), кнопка переиндексации на странице `/bot`.
3. **RAG**: `embed.ts`, `answer.ts`, `indexKnowledge()` читают модели из настроек; `dimensions: 1536` для обеих embedding-моделей.
4. **Статус индекса**: `knowledge_index_runs.embedding_model` + `GET /api/knowledge/index-status`; polling 3 с во время reindex.
5. **Безопасность устаревшего индекса**: `processMessage` не выполняет RAG при `state = outdated`.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+), Next.js 16 App Router  
**Primary Dependencies**: `pg`, `zod`, `openai`, `@heroui/react`, существующие `src/rag/*`, `src/db/botSettings.ts`, `POST /api/knowledge/reindex`  
**Storage**: PostgreSQL — расширение `bot_settings` + `knowledge_index_runs.embedding_model`; миграция `007`; `knowledge_chunks.embedding vector(1536)` без изменения размерности  
**Testing**: Vitest — unit (model validation, index status logic, embed model param); integration (bot-settings API, index-status, reindex metadata)  
**Target Platform**: Linux server / local dev; Postgres + pgvector  
**Project Type**: Next.js monolith — `app/api`, `app/(panel)/bot`, `src/rag`, `scripts/rag-index.ts`  
**Performance Goals**: Polling index status ≤ 3 с интервал; reindex duration unchanged from 009; settings page load ≤ 1 с  
**Constraints**: Server-only OpenAI calls; `requireAuth` on all new/changed admin APIs; no secrets in index-status response  
**Scale/Scope**: Singleton bot settings; ~сотни–тысячи chunks; 4 фиксированные модели

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router)**: `BotSettingsForm` — Client Component; новый `GET /api/knowledge/index-status` — route handler; polling на клиенте только для админ-страницы.
- **Gate B (TypeScript)**: Константы `ANSWER_MODELS` / `EMBEDDING_MODELS`; zod на PUT; явный тип `KnowledgeIndexState`.
- **Gate C (Security)**: Модели — не секреты; валидация enum на сервере; reindex только для авторизованного админа; ошибки reindex без stack traces в UI.
- **Gate D (Testing)**: Unit на `getKnowledgeIndexStatus` и валидацию; integration на расширенный bot-settings API.
- **Gate E (UX)**: Состояния loading / stale / running / error / success на форме; предупреждение при смене embedding-модели; disabled reindex while running.

**Post-design**: Нарушений нет. Polling — осознанный компромисс для редкой админ-операции без SSE.

## Project Structure

### Documentation (this feature)

```text
specs/013-bot-model-settings/
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
└── 007_bot_model_settings.sql

src/domain/botSettings/
├── models.ts                    # NEW — allowed models + defaults
└── validate.ts                  # extend zod schema

src/db/
├── botSettings.ts               # extend row type + upsert/get
└── knowledgeIndexRuns.ts        # embedding_model, getLatestCompleted, getRunning

src/rag/
├── embed.ts                     # dynamic model from settings
├── answer.ts                    # dynamic chat model from settings
├── indexKnowledge.ts            # pass embedding_model to completeIndexRun
└── knowledgeIndexStatus.ts      # NEW — getKnowledgeIndexStatus()

app/api/bot-settings/
└── route.ts                     # GET/PUT extended fields

app/api/knowledge/
├── reindex/route.ts             # unchanged contract; uses updated indexKnowledge
└── index-status/route.ts        # NEW GET

app/(panel)/bot/
└── BotSettingsForm.tsx          # model selects, index status, reindex + polling

src/telegram/
└── processMessage.ts            # skip RAG when index outdated

tests/unit/domain/
└── botSettingsModels.test.ts

tests/unit/rag/
└── knowledgeIndexStatus.test.ts

tests/integration/
├── botSettingsModels.test.ts
└── knowledgeIndexStatus.test.ts
```

**Structure Decision**: Минимальный diff поверх 009: одна миграция, расширение существующих модулей RAG и bot settings, один новый API route, один helper для статуса индекса.

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

1. **DB**: migration `007_bot_model_settings.sql`
2. **Domain**: `src/domain/botSettings/models.ts`; extend `validate.ts`
3. **DB layer**: `botSettings.ts`, `knowledgeIndexRuns.ts` (complete with embedding_model, queries for status)
4. **RAG core**: `embed.ts` (resolve model + dims 1536), `answer.ts` (resolve model), `indexKnowledge.ts` (record embedding_model)
5. **Index status**: `src/rag/knowledgeIndexStatus.ts` + `GET /api/knowledge/index-status`
6. **API**: extend `GET/PUT /api/bot-settings` with models + `embeddingModelChanged`
7. **Telegram**: `processMessage.ts` — guard outdated index before retrieve
8. **UI**: `BotSettingsForm.tsx` — Selects, status Alert, reindex button, 3s polling loop
9. **Tests**: unit + integration per quickstart
10. **Docs**: update `.cursor/rules/specify-rules.mdc` Active Technologies on merge

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Cross-model search on stale index | `outdated` guard in `processMessage` |
| `text-embedding-3-large` dim mismatch | Force `dimensions: 1536` in API calls |
| Stale `running` row after crash | Document dev cleanup; optional future stale-run timeout |
| Reindex clears chunks then fails | Existing behavior; status `failed` / `never_indexed`; admin retries reindex |
| `gpt-5.5` unavailable on API key | Existing `openai_error` fallback + `/unanswered` |

## Post-design Constitution re-check

All gates pass. DB-backed configuration aligns with «сервер — источник истины». Client polling scoped to single admin form.
