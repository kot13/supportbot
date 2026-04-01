---
description: "Actionable task list for implementing the feature"
---

# Tasks: Chat management & automatic registration

**Input**: Design documents from `/specs/006-chat-management/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/api.md`

**Organization**: Phases by user story / risk; task IDs sequential; `[ ]` until implemented.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no hard dependency)
- **[Story]**: US1–US4 from `spec.md`
- Paths are repo-relative from project root

---

## Phase 1: User Story 3 — `is_active` from Telegram membership (FR-005)

**Goal**: При `my_chat_member` (и при необходимости связанных апдейтах) выставлять `is_active` в `upsertChat`: **false** для статусов «бот не в чате» (`left`, `kicked` и т.д.), **true** при активном членстве; message-like апдейты по-прежнему подразумевают активный чат.

**Checkpoint**: После удаления бота из группы в БД `chats.is_active = false` после обработки апдейта.

- [x] T001 [US3] Extend `src/telegram/updates.ts`: из `my_chat_member` извлекать `new_chat_member` для бота (сопоставление с ботом по `user.is_bot` / id из `getMe` или env `TELEGRAM_BOT_USER_ID` при необходимости) и вычислять `isActive: boolean` по списку статусов ChatMember.
- [x] T002 [US3] Update `src/telegram/handleUpdate.ts`: передавать вычисленный `isActive` в `upsertChat` вместо константы `true`; для апдейтов без информации о членстве — сохранять разумное поведение (например `true` для message-like).
- [x] T003 [P] [US3] Unit tests in `tests/unit/` (or `tests/integration/` with fixtures): JSON-фикстуры `my_chat_member` с `left` / `member` → ожидаемый флаг для нормализации / хелпера статуса.

---

## Phase 2: User Story 2 — Отображаемое имя чата (FR-003, optional polish)

**Goal**: Для private и прочих чатов без `title` — согласованный запасной текст (например `first_name`, `username`).

**Checkpoint**: Список `/chats` показывает не пустое бессмысленное имя там, где Telegram отдаёт поля.

- [x] T004 [US2] Extend `normalizeChat` / сбор полей в `src/telegram/updates.ts`: при отсутствии `title` использовать `username` / `first_name` по данным Telegram для отображаемой строки (без ломания типов).

---

## Phase 3: User Story 4 — Регистрация webhook из настроек бота (FR-006, FR-007)

**Goal**: Поле **полного URL вручную** + кнопка; `POST` с `requireAuth` → `setWebhook` у Telegram; успех/ошибка без утечки токена; при `TELEGRAM_WEBHOOK_SECRET` передавать `secret_token` в запросе к Telegram.

**Checkpoint**: Админ регистрирует webhook из `/bot` без curl; ответы безопасны.

- [x] T005 [US4] Add `src/telegram/setWebhook.ts` (или `src/domain/telegram/setWebhook.ts`): функция `registerWebhook({ token, url, secretToken? })` → `fetch` к `api.telegram.org`, разбор `{ ok, description }`, возврат результата без включения токена в исключения на клиент.
- [x] T006 [US4] Add `app/api/bot-settings/webhook/route.ts` (или согласованный путь из `contracts/api.md`): `POST`, `requireAuth`, Zod/валидация тела `{ url: string }` (HTTPS, max length), загрузка токена через `getBotSettings()`, вызов `registerWebhook`, JSON `{ ok: true }` / `{ ok: false, error: { message, code } }`.
- [x] T007 [US4] Update `app/(panel)/bot/BotSettingsForm.tsx`: поле ввода полного URL (без автоподстановки по умолчанию), кнопка регистрации, отображение успеха/ошибки; `fetch` на новый endpoint с credentials.
- [x] T008 [P] [US4] Align ответа API с `specs/006-chat-management/contracts/api.md` (при необходимости поправить контракт одной строкой под выбранный путь роута).

---

## Phase 4: User Story 1 — Регрессия и наблюдаемость (FR-001, FR-002)

**Goal**: Убедиться, что существующий поток webhook → `handleTelegramUpdate` → `upsertChat` не сломан; дубликатов нет.

- [x] T009 [US1] Integration test (при `DATABASE_URL`): фикстура апдейта с `message` → строка в `chats` с ожидаемым `telegram_chat_id`; повторный upsert не создаёт вторую строку (опционально расширить существующий файл в `tests/integration/`).

---

## Phase 5: Tests & quality gates

- [x] T010 [P] Run `npm test`, `npm run lint`, `npm run build`; исправить регрессии.
- [ ] T011 [P] Manual pass по `specs/006-chat-management/quickstart.md` (webhook URL вручную, чаты, inactive).
- [ ] T012 [P] При необходимости короткая заметка в `README` или только quickstart — не дублировать спеку без запроса.

**Final checkpoint**: SC-001–SC-004 и FR-001–FR-007 по смыслу закрыты.

---

## Dependencies & execution order

| Phase | Depends on | Notes |
|--------|------------|--------|
| Phase 1 | — | Основа для корректного Active в UI |
| Phase 2 | — | Можно параллельно с Phase 3 |
| Phase 3 | — | Независим от Phase 1 по файлам; общий PR допустим |
| Phase 4 | Phase 1 стабилен | |
| Phase 5 | Основной код готов | |

**Parallel**: T003 с T005–T007 после контрактов; T004 с Phase 3.

---

## Implementation strategy

1. **Сначала** Phase 1 (T001–T003) — корректный `is_active`.
2. **Параллельно или следом** Phase 3 (T005–T008) — webhook из `/bot`.
3. **Полировка** Phase 2 (T004) по времени.
4. **Закрытие** Phase 4–5 (T009–T012).

---

## Notes

- Не класть токен бота в ответы API и в сообщения об ошибках (FR-007).
- Спека требует **ручной полный URL** — не добавлять автозаполнение по умолчанию в UI.
