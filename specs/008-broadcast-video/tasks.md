---
description: "Actionable task list for implementing the feature"
---

# Tasks: Видео в рассылке (broadcast video)

**Input**: Design documents from `/specs/008-broadcast-video/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/broadcast-api.md`, `quickstart.md`

**Organization**: Phases by setup → foundation (Telegram + validation) → US1 (P1) → US2 (P2) → US3 (P3) → polish. IDs `T###`; `[P]` = parallelizable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: different files, no hard ordering
- **[Story]**: `[US1]` / `[US2]` / `[US3]`
- Paths from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Зелёный baseline перед крупными правками.

- [x] T001 Run `npm test && npm run lint` on branch `008-broadcast-video` and fix only **pre-existing** failures unrelated to this feature before editing broadcast pipeline files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Изоляция отправки видео в Telegram и серверная валидация до изменений UI/API оркестрации.

**Checkpoint**: Есть вызываемый `sendVideo` и модуль валидации видео.

- [x] T002 [P] Add `src/telegram/sendVideo.ts`: multipart POST к Telegram `sendVideo`, параметры `chatId`, `video` (`Uint8Array` + `mimeType` + `filename`), `caption`, `parseMode`; результат как у `sendTelegramPhoto` (`ok`, ids / ошибки). Mirror timeouts/error mapping patterns from `src/telegram/sendPhoto.ts`
- [x] T003 [P] Add `src/domain/broadcast/validateVideos.ts`: whitelist MIME (минимум `video/mp4`, опционально `video/quicktime`), max files **10**, max bytes per file (константа, напр. 50 MiB — согласовать с `specs/008-broadcast-video/research.md`), сообщения для `VALIDATION`; экспорт функции, принимающей `{ contentLength: number; videos: Array<{ mimeType: string; sizeBytes: number }> }` и учитывающей лимит подписи **1024** при наличии видео
- [x] T004 Extend `src/telegram/sendMediaGroup.ts` (или вынести shared-хелпер): поддержка элементов `type: "video"` и multipart полей для 2–10 видео с подписью только на первом элементе; сохранить текущее поведение для только-фото

---

## Phase 3: User Story 1 — Прикрепить видео к рассылке (Priority: P1) 🎯 MVP

**Goal**: Выбор видео в панели → `POST /api/broadcasts` с `videos` → доставка в Telegram с подписью.

**Independent Test**: Один допустимый MP4 + текст → сообщение в Telegram с видео и caption; два MP4 → альбом видео с caption на первом.

### Implementation for User Story 1

- [x] T005 [US1] Extend `src/telegram/sendBroadcast.ts`: тип `TelegramBroadcastInput` — добавить опционально `videos?: TelegramVideoInput[]` (тип рядом с `TelegramImageInput` или в `sendVideo.ts`); логика: без медиа → текст; только `images` → текущая ветка; только `videos` → **одно** видео через новый `sendTelegramVideo`, **несколько** через обновлённый media group с видео; не смешивать `images` и `videos` (assert/ветка по контракту)
- [x] T006 [US1] Update `src/domain/broadcast/sendBroadcast.ts`: параметр `videos?`; при ненулевом `videos` выставлять лимит длины контента как для изображений (**1024**); вызывать `validateVideos`; записывать строки в `insertBroadcastAttachments` с `video/*` MIME; формировать входы `dispatchQueue` с полем `videos`
- [x] T007 [US1] Update `app/api/broadcasts/route.ts`: читать `fd.getAll("videos")`, собирать байты; если одновременно пришли непустые `images` и `videos` — **400** с понятным текстом; если только видео — валидация через `validateVideos` и передача в `sendBroadcast`; сохранить текущий JSON-only путь без видео (или явно документировать только multipart для видео в коде-комментарии рядом с обработчиком)
- [x] T008 [US1] Update `app/(panel)/broadcast/BroadcastClient.tsx`: состояние `videos: File[]`; отдельный `<input type="file" accept="video/*" multiple />`; при добавлении видео **очищать** `images`, при добавлении изображений **очищать** `videos`; показывать список имён видео и кнопку удаления по аналогии с изображениями; в `executeBroadcastSend` при наличии видео собирать `FormData` с полями `videos` (и без `images`); скорректировать `maxLen`/`canSend`: при `videos.length > 0` использовать лимит **1024** как для картинок

**Checkpoint**: FR-001, FR-002 закрыты для потока «только видео»; контракт см. `contracts/broadcast-api.md`.

---

## Phase 4: User Story 2 — Ограничения и ошибки (Priority: P2)

**Goal**: Блокировка до доставки и понятные сообщения (FR-003, FR-004).

**Independent Test**: Неверный MIME / превышен размер / >10 файлов → ошибка в UI и 400 с сервера.

### Implementation for User Story 2

- [x] T009 [US2] В `BroadcastClient.tsx`: при выборе файлов фильтровать/сообщать «не видео», ограничивать количество до 10, не добавлять файлы сверх лимита размера (или показывать ошибку сразу с текстом лимита)
- [x] T010 [US2] В `app/api/broadcasts/route.ts` и `validateVideos.ts`: единые тексты ошибок, код `VALIDATION`; не логировать содержимое файлов

**Checkpoint**: SC-002 и сценарии US2 из `spec.md`.

---

## Phase 5: User Story 3 — Сводка подтверждения (Priority: P3)

**Goal**: В модалке подтверждения явно видно число видео (FR-005).

**Independent Test**: С видео открыть подтверждение — строка с количеством видео.

### Implementation for User Story 3

- [x] T011 [US3] В `app/(panel)/broadcast/BroadcastClient.tsx` в теле `Modal.Body` добавить строку **Videos: {n}** (или эквивалентную английскую формулировку в стиле панели), когда `videos.length > 0`; не дублировать логику для изображений

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Тесты, регрессия, ручная проверка.

- [x] T012 [P] Add unit tests in `tests/unit/broadcast/` (или рядом) для `validateVideos.ts`: допустимый набор, превышение размера, неверный MIME, >10 файлов, длина caption с медиа
- [ ] T013 [P] Optional: integration test для `POST /api/broadcasts` с маленьким synthetic mp4 buffer в `tests/integration/` (skip если нет фикстуры/окружения)
- [ ] T014 [P] Optional: Playwright сценарий в `tests/e2e/auth-and-broadcast.spec.ts` — открыть диалог подтверждения с видео (можно мок `input[type=file]` через `setInputFiles` если доступно окружение)
- [x] T015 Run `npm test && npm run lint` и `npm run build`; исправить регрессии
- [ ] T016 [P] Пройти ручной чеклист `specs/008-broadcast-video/quickstart.md`

---

## Dependencies & Execution Order

| Phase | Depends on |
|--------|------------|
| Phase 2 | T001 optional |
| Phase 3 (US1) | T002–T004 (Telegram + validation + media group) |
| Phase 4 (US2) | Phase 3 (есть сквозной путь) |
| Phase 5 (US3) | Phase 3 (модалка уже есть от 007) |
| Phase 6 | Функциональная готовность US1–US3 |

**Parallel**: T002 и T003 в Phase 2 [P]; T012–T014 после реализации.

---

## Implementation Strategy

### MVP

1. Phase 1–2 (T001–T004)
2. Phase 3 (T005–T008)
3. Phase 4–5 (T009–T011)
4. Phase 6 минимум **T015**

### Full delivery

Включить unit (**T012**), при возможности integration/E2E (**T013–T014**), ручной **T016**.

---

## Task Summary

| Metric | Value |
|--------|--------|
| Total tasks | 16 (T001–T016) |
| US1 | 4 (T005–T008) |
| US2 | 2 (T009–T010) |
| US3 | 1 (T011) |
| Setup / foundation / polish | 9 |

**Suggested MVP task count**: through **T011** + **T015** (automated quality gate).

---

## Notes

- Смешение `images` + `videos` в одном запросе запрещено в v1 (`contracts/broadcast-api.md`).
- Расширение JSON-body для загрузки видео не требуется; видео только через multipart.
