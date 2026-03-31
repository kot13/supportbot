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

## Setup Steps (high-level)

1. Start PostgreSQL and create an empty database.
2. Run database migrations to create required tables.
3. Seed a single admin user (login/password).
4. Start the web application.
5. Sign in to the admin panel and set the bot token on the bot settings page.
6. Add the bot to a Telegram chat and trigger at least one update so the chat appears in the chat list.
7. Open the broadcast page, select the chat (or all chats), compose a formatted message, and send.
8. Verify:
   - The message is delivered in Telegram.
   - The broadcast appears in history with per-chat delivery results.

## Smoke Test Checklist

- Can sign in with seeded admin credentials.
- Can save bot token and see confirmation.
- Can see at least one chat in `/chats` after adding the bot.
- Can send a broadcast and see a success/failure summary.
- Can view the broadcast record in history with per-chat outcomes.
