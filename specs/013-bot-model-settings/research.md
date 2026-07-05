# Research: Bot model settings & knowledge reindex

**Branch**: `013-bot-model-settings`  
**Date**: 2026-07-05  

## Decision 1 — Хранение моделей в `bot_settings`

**Контекст**: Сейчас `bot_settings` содержит только `bot_name` и `bot_token_secret`; модели захардкожены в `src/rag/embed.ts` (`text-embedding-3-small`) и `src/rag/answer.ts` (`gpt-4.1`).

**Решение**: Миграция `007_bot_model_settings.sql` добавляет в singleton-таблицу `bot_settings`:

- `answer_model text not null default 'gpt-4.1'`
- `embedding_model text not null default 'text-embedding-3-small'`

CHECK-ограничения на допустимые значения (два варианта на поле).

**Rationale**: Единый источник истины для UI, API, CLI и RAG-пайплайна; соответствует существующему паттерну singleton `bot_settings`.

**Альтернатива**: Отдельная таблица `bot_model_settings` — отклонена как избыточная для пары полей.

---

## Decision 2 — Размерность векторов при смене embedding-модели

**Контекст**: `knowledge_chunks.embedding` — `vector(1536)`; HNSW-индекс построен под 1536. `text-embedding-3-large` поддерживает до 3072 измерений.

**Решение**: Для **обеих** моделей эмбеддингов передавать в OpenAI API параметр `dimensions: 1536`. Схема `vector(1536)` **не меняется**.

**Rationale**: Избегаем `ALTER COLUMN` + пересоздания HNSW; обе модели остаются совместимы с одной колонкой; достаточно для RAG на текущем объёме документации.

**Альтернатива**: Нативная размерность `large` (3072) — отклонена: потребовала бы миграции pgvector и усложнила переключение моделей.

---

## Decision 3 — Метаданные переиндексации

**Контекст**: FR-016–FR-018 требуют сравнивать текущую `embedding_model` с моделью последней успешной переиндексации.

**Решение**: Добавить в `knowledge_index_runs` колонку `embedding_model text null`. Заполнять при `completeIndexRun(runId, chunkCount, embeddingModel)`. Для исторических успешных run без значения — трактовать как `text-embedding-3-small` (исторический дефолт).

**Rationale**: Минимальное расширение существующей таблицы аудита индексации; не дублируем состояние в отдельной таблице.

**Альтернатива**: Хранить только в `bot_settings.last_index_embedding_model` — отклонена: теряется история run'ов и усложняется отладка.

---

## Decision 4 — Определение статуса индекса (UI)

**Контекст**: Нужны состояния: актуален / устарел / выполняется / ошибка / никогда не индексировался.

**Решение**: Серверная функция `getKnowledgeIndexStatus()`:

| Условие | `state` |
|---------|---------|
| Есть run со `status = 'running'` | `running` |
| Нет успешного completed run или `chunk_count = 0` | `never_indexed` |
| `bot_settings.embedding_model` ≠ `lastCompleted.embedding_model` (с backfill default) | `outdated` |
| Последний completed run failed и нет более нового completed | `failed` (если нет running/outdated/never) — опционально показывать `lastError` |
| Иначе | `current` |

Публичный API: `GET /api/knowledge/index-status` (`requireAuth`).

**Rationale**: Отдельный лёгкий endpoint для polling (FR-019) без перегрузки `GET /api/bot-settings`; переиспользует `knowledge_index_runs`.

**Альтернатива**: Включить статус в `GET /api/bot-settings` — отклонена для polling: лишняя нагрузка и смешение concerns.

---

## Decision 5 — Переиндексация из UI

**Контекст**: Уже есть `POST /api/knowledge/reindex` (202 + async `indexKnowledge()`).

**Решение**: Кнопка на `BotSettingsForm` вызывает существующий endpoint; после 202 — polling `GET /api/knowledge/index-status` каждые **3 с** до `current` / `failed` / `outdated` (после failed).

**Rationale**: Минимальный diff; соответствует clarify Q1 (UI + CLI) и Q3 (auto-update).

**Альтернатива**: WebSocket/SSE — отклонена как избыточная для редкой админ-операции.

---

## Decision 6 — Поведение бота при устаревшем индексе

**Контекст**: После смены embedding-модели без reindex поиск по старым векторам даёт мусор.

**Решение**: В `processMessage` перед `retrieveContext` проверять `isKnowledgeIndexCurrent()` (та же логика, что `state !== 'outdated' && state !== 'never_indexed'`). При `outdated` — ответ как при `no_knowledge_index` / fallback «база знаний требует переиндексации» (обновить copy, не раскрывая технические детали).

**Rationale**: Явное соответствие FR edge case «не выдавать уверенные ответы на несовместимом индексе».

**Альтернатива**: Полагаться только на `RAG_MAX_DISTANCE` — отклонена: кросс-модельный поиск ненадёжен.

---

## Decision 7 — Доменные константы и валидация

**Решение**: `src/domain/botSettings/models.ts`:

```typescript
export const ANSWER_MODELS = ["gpt-4.1", "gpt-5.5"] as const;
export const EMBEDDING_MODELS = ["text-embedding-3-small", "text-embedding-3-large"] as const;
export const DEFAULT_ANSWER_MODEL = "gpt-4.1";
export const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
```

Zod-схема `BotSettingsUpdateSchema` расширяется опциональными `answerModel`, `embeddingModel` с `z.enum(...)`.

**Rationale**: Единый каталог для API, DB CHECK, UI options; TypeScript exhaustiveness.

---

## Decision 8 — UI-компоненты выбора модели

**Решение**: HeroUI `Select` (или нативный `<select>` в обёртке `src/ui/`) на `BotSettingsForm`; секция «База знаний» с Alert для stale index, timestamp, кнопка reindex.

**Rationale**: Соответствует существующему UI kit (`@heroui/react`); форма уже Client Component.

---

## Decision 9 — Предупреждение при смене embedding-модели (FR-007)

**Решение**: После успешного PUT, если `embeddingModel` изменился — клиентский `Alert` «Требуется переиндексация» + акцент на кнопке reindex; сервер возвращает флаг `embeddingModelChanged: boolean` в response.

**Rationale**: Явное UX без блокирующего modal; соответствует spec (предупреждение, не автозапуск).

---

## Open questions resolved

| Question | Resolution |
|----------|------------|
| Vector dim for `text-embedding-3-large` | `dimensions: 1536`, no schema migration |
| Where to store index embedding model | `knowledge_index_runs.embedding_model` |
| Polling interval | 3 seconds |
| CLI reads settings | `indexKnowledge()` → `getBotSettings().embedding_model` |
