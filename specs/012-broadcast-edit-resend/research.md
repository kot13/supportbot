# Research: Редактирование, повторная отправка и черновики broadcast-рассылки

**Branch**: `012-broadcast-edit-resend`  
**Date**: 2026-07-05  

## R1: Где хранить черновики

**Decision**: Использовать существующую таблицу `broadcast_messages` со `status = 'draft'`.

**Rationale**: Поле `status` и default `'draft'` уже в `001_init.sql`; `createBroadcastMessage` вставляет `'draft'`, но текущий `POST /api/broadcasts` сразу вызывает `sendBroadcast`, который переводит в `sending` → `completed`. Отдельная таблица избыточна.

**Alternatives considered**:
- Отдельная таблица `broadcast_drafts` — дублирование схемы.
- Только client state (localStorage) — не переживает закрытие вкладки (против спеки).

## R2: Получатели и вложения черновика

**Decision**:
- Получатели: записывать в `broadcast_recipients` при сохранении черновика (для `target_mode = subset`); для `all` — строки в `broadcast_recipients` не обязательны (режим хранится в `target_mode`).
- Вложения: при сохранении черновика писать строки в `broadcast_attachments` с `mime_type`, `original_filename`, `size_bytes`, `telegram_file_id = null`; бинарники не хранить.

**Rationale**: Согласовано с clarify; переиспользует существующие таблицы и `listBroadcastAttachments` для отображения метаданных при открытии черновика.

**Alternatives considered**:
- JSONB-колонка на `broadcast_messages` — новая миграция без выгоды.
- Server-side file storage — отклонено в clarify.

## R3: API для compose (prefill) при resend

**Decision**: `GET /api/broadcasts/[id]/compose?failedOnly=0|1` возвращает DTO для редактора: `content`, `format`, `targetMode`, `chatIds`, `attachments` (metadata), `sourceBroadcastId`, `skippedChatCount` (для failed-only когда чаты удалены).

**Rationale**:
- Resend **не** создаёт запись до save/send (clarify).
- Единая точка для обычного resend и retry-failed; сервер знает `broadcast_recipients` vs `delivery_results`.

**Alternatives considered**:
- Только query string с id на клиенте + `GET /api/broadcasts/[id]` — не отдаёт список chat ids для subset без доработки; deliveries не равны intended recipients для draft.

## R4: Отправка из черновика vs новая рассылка

**Decision**:
- **Новая рассылка без черновика**: `POST /api/broadcasts` (как сейчас) — create + send.
- **Черновик**: `POST /api/broadcasts/drafts` (create) или `PATCH /api/broadcasts/[id]` (update); отправка — `POST /api/broadcasts/[id]/send` с телом как у send (content, media multipart).
- **Resend из истории без промежуточного draft**: клиент собирает form → `POST /api/broadcasts` (новая запись).

**Rationale**: FR-017 — отправка из черновика переводит **ту же** запись; resend из sent — **новая** запись (FR-005/FR-024).

## R5: Удаление черновика

**Decision**: `DELETE /api/broadcasts/[id]` разрешён только при `status = 'draft'`; CASCADE на `broadcast_recipients` / `broadcast_attachments` через FK.

**Rationale**: FR-025/FR-026; sent/completed записи не удаляются.

## R6: Отображение черновиков в истории

**Decision**: `listBroadcasts` уже не фильтрует по status — черновики появятся автоматически. UI: для `status = draft` показывать `-` в колонках success/failed/recipients (или count из `broadcast_recipients`), actions: Edit, Delete.

**Rationale**: Clarify — общая таблица истории.

## R7: Валидация минимума черновика

**Decision**: Серверная функция `canSaveDraft({ content, targetMode, chatIds })` → true если `content.trim()` не пуст **или** `targetMode === 'all'` **или** `chatIds.length > 0`.

**Rationale**: FR-021/FR-022; режим «все чаты» считается выбранными получателями даже без текста.
