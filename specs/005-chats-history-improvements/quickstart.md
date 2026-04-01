# Quickstart: Chats and History improvements

**Branch**: `005-chats-history-improvements`  

## Prerequisites

- Same as project root: Node 20+, PostgreSQL, env vars for DB and admin auth.
- Dependencies installed: `npm install`.

## Run the app

```bash
npm run dev
```

Sign in to the admin panel as usual.

## Manual verification

### History table (US2)

1. Open **Broadcast → History** (`/broadcast/history`).
2. Confirm there is **no Preview** column.
3. Confirm an **Error code** (or equivalent) column shows aggregated codes for broadcasts with failed deliveries, or `-` when not applicable.

### Broadcast details (US1)

1. On the history page, click a broadcast **ID** link.
2. Confirm navigation goes to **`/broadcast/history/<id>`** (in-panel page), not raw JSON.
3. Confirm the page shows full message content, status, counts/timestamps, and a **deliveries** section with error codes where present.
4. Open a non-existent ID (e.g. `/broadcast/history/999999`) and confirm a clear **not found** experience.

### Chats auto-refresh (US3)

1. Open **Chats** (`/chats`).
2. With another client or Telegram, trigger chat discovery (e.g. add bot to a chat / send an update) so a new row appears in DB.
3. Without full page reload, confirm the new chat appears within the **polling interval** (implementation-defined, e.g. ≤30s).

## Automated checks

```bash
npm test && npm run lint
```

Add/adjust tests in implementation phase for `listBroadcasts` aggregation, details page behavior, and chats polling helper if extracted.
