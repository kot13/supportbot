# Research: Chats and History improvements

**Branch**: `005-chats-history-improvements`  
**Date**: 2026-04-01  

## Decisions

### 1. Error code column in history (aggregate)

**Context**: `delivery_results` already stores `error_code` / `error_message` per chat; the history list is one row per broadcast.

**Decision**: Add a derived column in `listBroadcasts` that aggregates distinct non-null `error_code` values from rows where `status = 'failure'`, e.g. comma-separated ordered string. If there are failures but no stored codes, the UI shows `-` (matches spec).

**Alternatives considered**:
- **Single “first” failure code only**: Simpler SQL but hides multiple failure reasons; rejected for triage value.
- **Separate API for codes**: Extra round-trips; rejected.

### 2. Broadcast details UX (ID link → panel page)

**Context**: `BroadcastHistoryTable` currently links ID to `GET /api/broadcasts/:id` (raw JSON). `getBroadcastDetails` and the API route already return full broadcast + deliveries.

**Decision**: Add `app/(panel)/broadcast/history/[id]/page.tsx` as a **Server Component** that calls `getBroadcastDetails`, uses `notFound()` when missing, and renders a readable layout (message body, metadata, deliveries table with error columns). Link the ID column to `/broadcast/history/[id]` via `next/link`.

**Alternatives considered**:
- **Client-only page fetching JSON**: More client JS and duplicate serialization; rejected in favor of server data loading aligned with constitution.

### 3. Chats auto-refresh (polling)

**Context**: Chats are populated by Telegram updates into `chats`; the page today is static after load.

**Decision**: Introduce a **Client Component** wrapper on `/chats` that:
- Receives initial rows from the server (SSR) for fast first paint.
- Starts an interval (e.g. 15–30s, exact value in implementation) to `fetch('/api/chats', { credentials: 'include' })` and updates local state passed to `ChatsTable`.
- On fetch failure, keep showing the last good data and optionally a subtle error hint (no full-page crash).

**Alternatives considered**:
- **`router.refresh()` on interval**: Heavier full RSC refresh; acceptable but polling JSON is lighter for a simple table.
- **WebSockets**: Explicitly out of scope for v1 per spec.

### 4. API contract changes

**Decision**: Extend **list** payloads (DB row + any JSON mirrors) with `error_codes` or `error_code_summary` (final name aligned with types in implementation). `GET /api/broadcasts/[id]` shape stays backward-compatible (`data.broadcast`, `data.deliveries`).

## Resolved clarifications

- **Preview removal**: Stop selecting / displaying `content_preview` in the table; full text remains on the details page via `getBroadcastDetails`.
