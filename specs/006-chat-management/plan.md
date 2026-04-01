# Implementation Plan: Управление чатами и автоматическая регистрация

**Branch**: `006-chat-management` | **Date**: 2026-04-01 | **Spec**: `./spec.md`  
**Input**: Feature specification from `/specs/006-chat-management/spec.md` (включая Clarifications: webhook из настроек бота, **полный URL только вручную**)

**Note**: Filled by `/speckit.plan`.

## Summary

Спека **006** требует:

1. **Авторегистрация чатов** при событиях Telegram (US1, FR-001–004) — в коде уже есть цепочка webhook/polling → `handleTelegramUpdate` → `upsertChat` с уникальностью по `telegram_chat_id`.
2. **Корректный `is_active`** при выходе бота из чата (US3, FR-005) — сейчас везде передаётся `true`; нужно выводить из `my_chat_member` / статуса участника бота.
3. **Регистрация webhook из UI** (US4, FR-006–007): на странице **настроек бота** — поле для **полного URL вручную** и действие «зарегистрировать»; сервер вызывает **Telegram `setWebhook`** с этим URL, показывает успех или **безопасное** сообщение об ошибке (без утечки токена/секретов).

**План доработки**: `src/telegram/updates.ts` + `handleUpdate.ts` (статусы + при необходимости bot id); UI + route handler для `setWebhook`; валидация HTTPS URL на сервере; тесты; артефакты `research.md`, `data-model.md`, `contracts/`, `quickstart.md`.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+)  
**Primary Dependencies**: Next.js (App Router), Telegram Bot API (`getUpdates`, `setWebhook`, updates JSON), `pg`  
**Storage**: PostgreSQL — `chats`; `bot_settings` для токена; новые таблицы для v1 webhook UI не обязательны (опционально «последний URL» в `bot_settings`).  
**Testing**: Vitest (unit/integration), ручная проверка с ботом и публичным HTTPS  
**Target Platform**: Linux server / container с публичным HTTPS для webhook  
**Project Type**: Next.js + `app/api/telegram/webhook` + админ `/bot`  
**Performance Goals**: Один запрос `setWebhook` по действию админа; обработка апдейта — один upsert  
**Constraints**: URL webhook только из тела запроса / формы (спека 006, вариант A); валидация `https://`; при `TELEGRAM_WEBHOOK_SECRET` — передать в `setWebhook` как `secret_token`, не показывать в UI.  
**Scale/Scope**: Админ-панель, один бот на развёртывание

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router)**: Форма настроек бота — Client при необходимости; `setWebhook` только в route handler / server action; токен не на клиенте.
- **Gate B (TypeScript)**: Явные типы для результата разбора апдейта (`isActive`, статусы участника).
- **Gate C (Security)**: Валидация URL; ошибки Telegram — санитизированные; `GET /api/bot-settings` не отдаёт сырой токен.
- **Gate E (UX)**: Success/error после регистрации webhook; таблица чатов отражает Active после правок `is_active`.

**Post-design**: Нарушений нет.

## Project Structure

### Documentation (this feature)

```text
specs/006-chat-management/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api.md
└── tasks.md              # /speckit.tasks
```

### Source Code (repository root)

```text
src/telegram/
├── handleUpdate.ts       # isActive из нормализации / my_chat_member
├── updates.ts            # статус бота, опционально bot id
└── setWebhook.ts         # NEW: вызов api.telegram.org/setWebhook

app/api/telegram/webhook/route.ts

app/api/bot-settings/
├── route.ts
└── webhook/route.ts      # NEW: POST { url } → setWebhook

app/(panel)/bot/
├── BotSettingsForm.tsx
└── page.tsx

src/db/chats.ts
tests/unit/
tests/integration/
```

**Structure Decision**: Расширение существующих модулей Telegram; новый защищённый API для регистрации webhook; без лишних таблиц в v1.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

No constitution violations expected.
