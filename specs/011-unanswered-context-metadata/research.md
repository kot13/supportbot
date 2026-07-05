# Research: Unanswered context snapshots

**Branch**: `011-unanswered-context-metadata`  
**Date**: 2026-07-05  

## Decision 1 — Хранение снимка: отдельная таблица с JSONB

**Решение**: Таблица `unanswered_context_snapshots` с FK `chat_message_id` (UNIQUE, ON DELETE CASCADE) и структурированными колонками + JSONB для массивов фрагментов и диалога.

**Rationale**:

- Список `/unanswered` загружает до 200 строк — не тянуть крупный JSON в каждый row list query.
- Снимок загружается лениво при открытии деталей (модалка + API).
- 1:1 с неотвеченным сообщением; каскадное удаление вместе с `chat_messages` (FR-009).

**Alternatives considered**:

| Вариант | Почему отклонён |
|---------|-----------------|
| JSONB-колонка на `chat_messages` | Утяжеляет все SELECT по сообщениям; смешивает транспорт истории и диагностический снимок |
| Нормализованные таблицы `snapshot_chunks` | Избыточно для read-only снимка; больше JOIN без выигрыша |
| Логи / внешнее хранилище | Не соответствует FR-006 (просмотр из `/unanswered`); сложнее эксплуатация |

## Decision 2 — Формат снимка

**Решение**: Тип `UnansweredContextSnapshot` (TypeScript) / JSON schema в контракте:

- `searchPerformed: boolean` — `false` для `no_knowledge_index` и случаев до этапа retrieval; `true` если вызывался `retrieveContext` (включая пустой результат и ошибку embedding).
- `chunkCount: number` — число фрагментов в `retrievedChunks`.
- `bestDistance: number | null` — `retrievedChunks[0]?.distance` при `searchPerformed`; иначе `null`.
- `recentMessages: { role, content }[]` — диалоговый контекст, переданный в `answerQuestion` (пустой, если не загружался).
- `retrievedChunks: { chunkId, sourceType, sourcePath, title, content, metadata, distance }[]` — полная копия полей `RetrievedChunk` на момент обработки (без embedding).

**Rationale**: Покрывает FR-002–FR-004 и FR-008; администратор видит «почти прошёл порог» vs «мимо» по `bestDistance` и списку кандидатов.

**Не сохраняем**: embedding-векторы, сырой prompt, `OPENAI_API_KEY`, полный stack trace (Assumptions spec).

## Decision 3 — Момент записи и идемпотентность

**Решение**: Одна транзакция (или последовательные вызовы с `ON CONFLICT DO NOTHING` на snapshot):

1. `UPDATE chat_messages SET unanswered_reason = $reason WHERE id = $id AND unanswered_reason IS NULL`
2. `INSERT INTO unanswered_context_snapshots ... ON CONFLICT (chat_message_id) DO NOTHING`

Вызывается из `processMessage` сразу после отправки fallback пользователю.

**Rationale**: FR-001, edge case «дубликат update» — `tryMarkProcessed` уже отсекает повторную обработку; дополнительная защита на уровне БД не перезаписывает снимок.

## Decision 4 — Поведение по причинам неотвеченного

| Причина | `searchPerformed` | `recentMessages` | `retrievedChunks` |
|---------|-------------------|------------------|-------------------|
| `no_knowledge_index` | `false` | `[]` | `[]` |
| `not_configured` | `false`* | `[]` | `[]` |
| `no_context` | `true` | заполнен | все top-k кандидаты (в т.ч. ниже порога) |
| `openai_error` (после retrieval) | `true` | заполнен | как при retrieval |
| `openai_error` (на embedding) | `true` | заполнен** | `[]` |

\* `not_configured` сегодня практически не достигается отдельно от ошибки embedding (нет ключа → exception в `embedText` → `openai_error`). Снимок всё равно поддерживает флаг для контракта `answerQuestion`.

\** `recentMessages` загружаются до `retrieveContext` в текущем pipeline.

## Decision 5 — UI: модальное окно + lazy API

**Решение**: В `UnansweredTable` кнопка «Details» / клик по причине → HeroUI `Modal` (паттерн `BroadcastClient`) → `GET /api/unanswered/[messageId]/context`.

**Rationale**: FR-007 (компактная таблица), Gate E (UX), Gate A (данные с сервера по запросу).

**Alternatives**: expand row inline — хуже для длинных фрагментов; отдельная страница — лишняя навигация для v1.

## Decision 6 — Тестирование

**Решение**:

- **Unit**: `buildUnansweredContextSnapshot` — маппинг `RetrievedChunk[]` + flags по причинам.
- **Integration**: insert snapshot + get by message id; `markMessageUnanswered` idempotency.
- **Без E2E** в v1 (достаточно API + unit по уровню риска фичи).

## Open points (не блокируют реализацию)

- Точный label в UI для `searchPerformed=false` vs пустой список при `searchPerformed=true` — копирайт в компоненте.
- Обратное заполнение старых записей — вне scope (Assumptions spec).
