# Quickstart: Chat management

**Branch**: `006-chat-management`  

## Prerequisites

- Bot token configured in admin **Bots** (`/bot`).
- Public **HTTPS** URL reachable by Telegram if using webhook.
- `DATABASE_URL` and migrations applied.

## Register webhook from admin (US4, SC-004)

1. Open **Bots** (`/bot`).
2. Enter the **full** webhook URL manually (must be `https://…` and point to this app’s webhook route, e.g. `https://<your-host>/api/telegram/webhook`).
3. Use **Register webhook** (or equivalent) and confirm success message.
4. Optionally verify with Telegram Bot API `getWebhookInfo` externally — not required for pass/fail of product test.

## Verify automatic chat registration (US1)

1. With webhook or long-polling delivering updates, add the bot to a **new** group or message the bot.
2. Open **Chats** (`/chats`) — the chat should appear without manual import.

## Verify no duplicates (SC-002)

Send multiple messages from the same chat; confirm **one** row per `telegram_chat_id`.

## Verify inactive after bot removed (US3)

Remove the bot from the group; after `my_chat_member` is processed, **Active** should become **no** / inactive when implementation is complete.

## Automated checks

```bash
npm test && npm run lint
```

Run integration tests when `DATABASE_URL` is set.
