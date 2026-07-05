# Implementation Plan: Редактирование, повторная отправка и черновики broadcast-рассылки

**Branch**: `012-broadcast-edit-resend` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/012-broadcast-edit-resend/spec.md`

**Note**: Filled by `/speckit.plan`.

## Summary

Расширить админ-панель рассылок тремя связанными потоками:

1. **Редактировать и повторить** — из истории/деталей открыть `/broadcast` с предзаполнением из прошлой отправленной рассылки (без записи в БД до сохранения черновика или отправки).
2. **Повторить неудачным** — то же предзаполнение, но получатели = чаты с `delivery_results.status = failure`.
3. **Черновики** — сохранение на сервере в `broadcast_messages` со `status = draft`, отображение в общей таблице истории, редактирование, отправка (переход в `sending` → `completed`), удаление с подтверждением.

Технически: новые route handlers для draft CRUD/send/compose, расширение `src/db/broadcasts.ts`, рефакторинг `BroadcastClient` (query params `draftId` / `from` / `failedOnly`), кнопки в `BroadcastHistoryTable` и на странице деталей. Миграция схемы **не требуется** — поле `status` и таблицы `broadcast_recipients` / `broadcast_attachments` уже есть; черновики используют их при сохранении (получатели + метаданные вложений без бинарников).

## Technical Context

**Language/Version**: TypeScript (Node.js 20+)  
**Primary Dependencies**: Next.js 16 App Router, React, `@heroui/react` (Modal), `pg`, `zod`, существующие `sendBroadcast`, `POST /api/broadcasts`  
**Storage**: PostgreSQL — `broadcast_messages`, `broadcast_recipients`, `broadcast_attachments`, `delivery_results` (без новых таблиц)  
**Testing**: Vitest (unit: валидация черновика, compose mapping); integration (draft save/update/send/delete, compose); Playwright E2E (resend, draft lifecycle, delete confirm)  
**Target Platform**: Браузер, админ-панель `/broadcast`, `/broadcast/history`  
**Project Type**: Next.js web app (panel + API routes)  
**Performance Goals**: Список истории остаётся с `limit 100`; compose/draft API — один round-trip на действие  
**Constraints**:
- `requireAuth` на всех новых маршрутах.
- Отправленные записи **immutable**; resend всегда создаёт новую запись (или переводит существующий **draft** в отправку).
- Вложения в черновике — только метаданные в `broadcast_attachments` (без `bytes` / file storage).
- Подтверждение перед отправкой (007) сохраняется для всех send-путей.
**Scale/Scope**: ~8–10 файлов в `app/` + `src/db/` + тесты; без фоновых воркеров

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate I (App Router)**: История и детали — Server Components; интерактив (редактор, модалки удаления/подтверждения) — Client boundary в `BroadcastClient` и таблице истории.
- **Gate II (TypeScript)**: Zod-схемы для draft/compose request bodies; явные типы `BroadcastComposePayload`, `DraftSaveInput`.
- **Gate III (Security)**: Удаление и PATCH только для `status = draft`; send из чужого draft не применим (single-tenant admin). Валидация id и статуса на сервере.
- **Gate IV (Testing)**: Integration для draft lifecycle и compose; E2E для resend + draft save/open/send.
- **Gate V (UX)**: Модал подтверждения удаления черновика; баннер «Based on broadcast #N» при prefill; пустые метрики доставки для draft в таблице (`-`).

**Post-design**: Нарушений нет. Отдельное blob-хранилище для вложений **отклонено** по clarify (метаданные only).

## Project Structure

### Documentation (this feature)

```text
specs/012-broadcast-edit-resend/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api.md
└── tasks.md              # /speckit.tasks — не создаётся этой командой
```

### Source Code (repository root)

```text
app/
├── (panel)/broadcast/
│   ├── page.tsx                          # передать searchParams в BroadcastClient
│   ├── BroadcastClient.tsx               # prefill, save draft, send draft/resend
│   └── history/
│       ├── BroadcastHistoryTable.tsx     # actions: open draft, resend, retry failed, delete draft
│       └── [id]/page.tsx                 # кнопки resend / retry failed / open draft
├── api/broadcasts/
│   ├── route.ts                          # POST: опционально без немедленного send (или только send path)
│   ├── [id]/
│   │   ├── route.ts                      # GET (existing), PATCH draft, DELETE draft
│   │   ├── send/route.ts                 # POST send from draft
│   │   └── compose/route.ts              # GET prefill payload (?failedOnly=1)
│   └── drafts/route.ts                   # POST create draft
src/
├── db/broadcasts.ts                      # updateDraft, deleteDraft, getComposePayload, listRecipientChatIds
├── domain/broadcast/
│   ├── saveDraft.ts                      # validation (min content OR recipients)
│   └── sendBroadcast.ts                  # без изменений контракта send
tests/
├── unit/domain/broadcast/saveDraft.test.ts
├── integration/broadcastDrafts.test.ts
└── e2e/broadcast-edit-resend.spec.ts
```

**Structure Decision**: Расширяем существующие модули рассылок; новые API под `app/api/broadcasts/`; доменная валидация черновика в `src/domain/broadcast/`.

## Complexity Tracking

Нет отклонений от конституции.
