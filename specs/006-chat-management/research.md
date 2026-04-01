# Research: Chat management & automatic registration

**Branch**: `006-chat-management`  
**Date**: 2026-04-01  

## Decision 1 — Откуда брать «чат добавлен»

**Контекст**: Telegram шлёт `Update` с полями `message`, `my_chat_member`, `chat_member` и др.

**Решение**: Оставить извлечение чата из message-like обновлений и из `my_chat_member` / `chat_member` (как сейчас в `normalizeUpdateToChat`), чтобы чат появлялся и при первом сообщении, и при смене статуса участника (в т.ч. когда бота добавили в группу без сообщения — часто приходит `my_chat_member`).

**Альтернативы**: Только сообщения — отвергнута: чат мог не написать ни слова после добавления бота.

## Decision 2 — Как выставлять `is_active` (FR-005)

**Контекст**: Сейчас `handleTelegramUpdate` всегда передаёт `isActive: true`.

**Решение**: Для обновлений типа **`my_chat_member`** анализировать **`new_chat_member`** для **пользователя-бота** (совпадение `user.id` с id бота из настроек или универсально: если в апдейте один участник-бот): если `status` ∈ {`left`, `kicked`} → `isActive: false`; если статус означает присутствие в чате (`member`, `administrator`, `creator`, `restricted` и т.д. по Bot API) → `isActive: true`. Для message-like обновлений без явного выхода — **true** (чат жив).

**Альтернатива**: Всегда true — не закрывает US3.

**Заметка**: Точный список статусов — из [Telegram Bot API ChatMember](https://core.telegram.org/bots/api#chatmember); реализация держит allowlist/denylist для «присутствует» / «нет».

## Decision 3 — Дубликаты (FR-002)

**Решение**: Уже обеспечено `UNIQUE(telegram_chat_id)` + `ON CONFLICT DO UPDATE` в `upsertChat`. Дополнительных миграций не требуется.

## Decision 4 — Отображение имени (US2)

**Решение**: Для групп/supergroup — `chat.title`; для private — при отсутствии `title` использовать `username` или запасной текст (уже частично в `normalizeChat`). При необходимости расширить извлечение из `chat.first_name` только если это не ломает типизацию и соответствует данным Telegram.

## Decision 5 — Регистрация webhook из админки (US4, FR-006–007)

**Контекст**: Спека требует полный URL **вручную** и регистрацию без инструментов вне панели.

**Решение**:

- UI: страница **`/bot`** (`BotSettingsForm`) — отдельное поле ввода **полного HTTPS URL** webhook и кнопка (например «Register webhook»), без автоподстановки по умолчанию.
- Сервер: новый защищённый endpoint (например `POST /api/bot-settings/webhook` или `POST /api/telegram/set-webhook`) с `requireAuth`, телом `{ "url": "<string>" }`; сервер валидирует URL (`https`), читает токен из `getBotSettings()`, вызывает `https://api.telegram.org/bot<token>/setWebhook` с `url` и при наличии переменной окружения — `secret_token` для согласования с заголовком webhook.
- Ответ: `{ ok: true }` или `{ ok: false, error: { message } }` с **санитизированным** текстом (FR-007); не возвращать сырой ответ Telegram с токеном в URL.

**Альтернатива**: Только CLI/curl — отвергнута спекой.

## Open points (не блокируют план)

- Подтверждение `bot id` для сравнения в `my_chat_member` — из env или `getMe` кэш; для MVP достаточно сравнения `new_chat_member.user.is_bot` и что это единственный целевой участник в событии о боте.
- Опционально сохранять последний успешно зарегистрированный URL в БД для отображения «последний раз» — не требуется спекой v1.
