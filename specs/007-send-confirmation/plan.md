# Implementation Plan: Подтверждение перед отправкой сообщений

**Branch**: `007-send-confirmation` | **Date**: 2026-04-29 | **Spec**: `./spec.md`  
**Input**: Feature specification from `/specs/007-send-confirmation/spec.md`

**Note**: Filled by `/speckit.plan`.

## Summary

Спека **007** требует **шаг подтверждения в UI** перед тем, как клиент вызывает существующий поток массовой рассылки (`POST /api/broadcasts`). Серверная логика создания записи рассылки и доставки в Telegram **не меняется** по смыслу; добавляется только клиентский диалог со сводкой (охват получателей, число вложений, превью текста с усечением длинных сообщений) и разделение действий: первичная кнопка открывает подтверждение, во втором шаге — «Подтвердить отправку» / «Отмена». Состояние `pending` продолжает блокировать повторный запуск во время `fetch`.

**План доработки**: `app/(panel)/broadcast/BroadcastClient.tsx` (+ при необходимости маленький презентационный компонент или использование `Modal` из HeroUI); обновление/добавление E2E-сценария под новый поток; артефакты `research.md`, `data-model.md`, `contracts/`, `quickstart.md`.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+)  
**Primary Dependencies**: Next.js (App Router), React, `@heroui/react` (Card, Modal и др.), существующий `POST /api/broadcasts`  
**Storage**: N/A для фичи — без новых таблиц и миграций  
**Testing**: Vitest (при выделении чистых хелперов для сводки — опционально); Playwright E2E для потока подтверждения  
**Target Platform**: Браузер, админ-панель `/broadcast`  
**Project Type**: Next.js web app (panel + route handlers)  
**Performance Goals**: Один дополнительный клик до сети; без лишних запросов до подтверждения  
**Constraints**: Не вызывать `POST /api/broadcasts` до явного подтверждения; при открытом модальном шаге не терять локальный state формы (content, mode, selectedIds, images)  
**Scale/Scope**: Одна страница рассылки, один операторский сценарий

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate I (App Router)**: Изменения только в Client Component страницы рассылки; маршрут API без ослабления `requireAuth` и без утечки секретов на клиент.
- **Gate II (TypeScript)**: Типы для состояния диалога (`isOpen`), пропсов модалки; без неявных `any`.
- **Gate III (Security)**: Подтверждение не заменяет серверную валидацию; дополнительных доверенных данных с клиента не вводим.
- **Gate V (UX/a11y)**: Модальное окно с фокусом и явными primary/secondary действиями (спека P2); отмена не оформлена как главная кнопка.

**Post-design**: Нарушений нет; API контракт прежний, поведение сервера не расширяется для «обхода» подтверждения.

## Project Structure

### Documentation (this feature)

```text
specs/007-send-confirmation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── broadcast-send.md
└── tasks.md              # /speckit.tasks — не создаётся этой командой
```

### Source Code (repository root)

```text
app/(panel)/broadcast/
├── BroadcastClient.tsx   # шаг подтверждения, состояние модалки, вызов существующего send()

tests/e2e/
└── auth-and-broadcast.spec.ts   # расширить: поток с модалкой (или отдельный spec-файл)
```

**Structure Decision**: Одна точка изменения — клиент рассылки; без новых API и без `src/domain` для этой фичи.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

Нет отклонений от конституции.
