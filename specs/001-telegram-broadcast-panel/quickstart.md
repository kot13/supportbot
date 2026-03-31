# Quickstart: Telegram bot broadcast panel

**Branch**: `001-telegram-broadcast-panel`  
**Date**: 2026-03-31  
**Spec**: `./spec.md`  

## Goal

Run the admin panel + Telegram bot locally with a PostgreSQL database, then send a test broadcast to a known chat.

## Prerequisites

- PostgreSQL available locally (or via container)
- A Telegram bot token (created via BotFather)
- At least one Telegram chat where the bot can be added

## Configuration (environment)

The following configuration values are required (names may vary in implementation, but these concepts must exist):

- Database connection string
- Admin login + password secret (seeded into DB)
- Telegram bot token (stored in DB via the admin UI once the app is running)
- Optional: public base URL for webhook mode (if using webhooks locally)
 - Optional: webhook secret token (if protecting webhook)

## Setup Steps (high-level)

1. Create `.env` from `.env.example` and set `DATABASE_URL`.
2. Start PostgreSQL and create an empty database.
3. Run migrations:

```bash
npm run db:migrate
```

4. Seed a single admin user:

```bash
npm run db:seed
```

5. Start the web application:

```bash
npm run dev
```

6. Sign in at `/login` using the seeded credentials.
7. Open `/bot` and save the Telegram bot token.
8. Add the bot to a Telegram chat and trigger an update:
   - Either configure webhook to `/api/telegram/webhook` (recommended for prod-like setups)
   - Or run the long-polling runner (dev fallback) to ingest updates
9. Confirm the chat appears on `/chats`.
10. Open `/broadcast`, select the chat (or all chats), compose a formatted message, and send.
11. Verify:
   - The message is delivered in Telegram.
   - The broadcast appears in history with per-chat delivery results.

## Smoke Test Checklist

- Can sign in with seeded admin credentials.
- Can save bot token and see confirmation.
- Can see at least one chat in `/chats` after adding the bot.
- Can send a broadcast and see a success/failure summary.
- Can view the broadcast record in history with per-chat outcomes.
