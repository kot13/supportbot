# Implementation Plan: Видео в рассылке вместе с сообщением

**Branch**: `008-broadcast-video` | **Date**: 2026-04-30 | **Spec**: `./spec.md`  
**Input**: Feature specification from `/specs/008-broadcast-video/spec.md`

**Note**: Filled by `/speckit.plan`.

## Summary

Спека **008** расширяет массовую рассылку: оператор прикрепляет **видеофайлы** к тому же сценарию, что сегодня поддерживает текст и **изображения** (`POST /api/broadcasts`, `sendBroadcast`, `sendTelegramBroadcast`, `dispatchQueue`).

**Техническая стратегия (MVP, согласовано с FR-006 и допущениями спеки):**

- **В одной рассылке в v1: либо изображения, либо видео** (взаимоисключение). Это упрощает UI, валидацию длины подписи и ветвление доставки в Telegram без смешанного `sendMediaGroup` (фото+видео) в первой поставке.
- **Несколько видео**: как и для фото — до **10** вложений в одной отправке на чат; один элемент — `sendVideo` с подписью; несколько — `sendMediaGroup` с элементами типа `video` и подписью на первом элементе (аналог текущего паттерна для фото).
- **Хранилище метаданных**: таблица **`broadcast_attachments`** уже содержит `mime_type`, `size_bytes`, `ordinal`; видео сохраняются как строки с `video/*` без обязательной новой таблицы (опционально миграция с `kind`/CHECK — см. `data-model.md`).
- **Новый адаптер Telegram**: модуль отправки видео (по аналогии с `sendPhoto` / `sendMediaGroup`) и расширение роутинга в `sendTelegramBroadcast` + очередь доставки.
- **Панель**: `BroadcastClient` — выбор видео, список имён, правила взаимного исключения с изображениями; модалка подтверждения (007) — строка **Videos: N**.

**Артефакты**: `research.md`, `data-model.md`, `contracts/`, `quickstart.md`.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+)  
**Primary Dependencies**: Next.js (App Router), `@heroui/react`, Telegram Bot API (`sendVideo`, `sendMediaGroup` с видео), `pg`  
**Storage**: PostgreSQL — `broadcast_attachments` (расширение использования), `broadcast_messages` без обязательного изменения контракта контента  
**Testing**: Vitest (unit: валидация MIME/размера; integration: route + мок Telegram при необходимости); Playwright — опционально happy-path с фиктивным маленьким mp4  
**Target Platform**: Сервер приложения + браузер оператора  
**Project Type**: Next.js web app + route handlers  
**Performance Goals**: Передача крупных файлов через `multipart/form-data`; разумный таймаут HTTP к Telegram (согласовать с существующими вызовами)  
**Constraints**: Лимит размера файла на сервере (body size / отдельная проверка); лимит подписи **1024** символа при наличии любого медиа с подписью (как для изображений); авторизация `requireAuth` на `POST /api/broadcasts`  
**Scale/Scope**: Один экран `/broadcast`, те же получатели, что у текущей рассылки

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate I (App Router)**: Загрузка файлов и вызов Telegram только на сервере; клиент не видит токен бота.
- **Gate II (TypeScript)**: Общие типы для «байтов + mime + имя» для видео; явные union веток доставки (только фото / только видео / только текст).
- **Gate III (Security)**: Валидация MIME, размера и количества на route handler; ошибки без утечки секретов.
- **Gate V (UX)**: Понятные ошибки при смене типа вложения; подтверждение показывает число видео.

**Post-design**: Нарушений нет при условии серверной валидации и сохранения модели «сервер — источник истины» для доставки.

## Project Structure

### Documentation (this feature)

```text
specs/008-broadcast-video/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── broadcast-api.md
└── tasks.md              # /speckit.tasks
```

### Source Code (repository root)

```text
app/(panel)/broadcast/
└── BroadcastClient.tsx          # state видео, взаимоисключение с images, FormData videos

app/api/broadcasts/
└── route.ts                     # разбор videos из FormData, валидация

src/domain/broadcast/
├── sendBroadcast.ts             # параметры videos, ветвление max caption, insert attachments
├── validateImages.ts            # или общий validateBroadcastMedia / новый validateVideos
└── validateVideos.ts            # NEW (или объединённый модуль)

src/telegram/
├── sendPhoto.ts                 # TelegramImageInput (существующий)
├── sendVideo.ts                 # NEW: отправка одного видео с caption
├── sendMediaGroup.ts            # расширить поддержкой video entries (или отдельный helper)
└── sendBroadcast.ts             # маршрутизация: text | images | videos

tests/unit/broadcast/            # валидация, при необходимости
tests/integration/             # POST multipart с видео (при наличии фикстур)
tests/e2e/                       # опционально сценарий с видео
```

**Structure Decision**: Минимум новых файлов; точечное расширение существующей цепочки рассылки и одного нового модуля `sendVideo`.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

Нет отклонений от конституции.
