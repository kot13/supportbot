# Implementation Plan: Chats and History improvements

**Branch**: `005-chats-history-improvements` | **Date**: 2026-04-01 | **Spec**: `./spec.md`  
**Input**: Feature specification from `/specs/005-chats-history-improvements/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Improve the admin **broadcast history** and **chats** areas:

- **History table**: Remove the **Preview** column; add an **Error code** column derived from failed deliveries (aggregated distinct codes when multiple failures exist; placeholder when none).
- **Broadcast details**: Replace the raw JSON **API** link on ID with navigation to a **dedicated App Router page** that shows full broadcast fields and per-chat delivery results (including error codes), reusing `getBroadcastDetails` and existing `GET /api/broadcasts/[id]` semantics.
- **Chats list**: **Auto-refresh** the list on `/chats` via **polling** `GET /api/chats` on a reasonable interval (no WebSockets in v1), with graceful handling of transient failures.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+)  
**Primary Dependencies**: Next.js (App Router), Tailwind CSS + HeroUI, `pg`  
**Storage**: PostgreSQL (existing `broadcast_messages`, `delivery_results`, `broadcast_recipients`, `chats`)  
**Testing**: Vitest (unit/integration), Playwright (E2E smoke where applicable)  
**Target Platform**: Linux server / container deployment  
**Project Type**: Next.js web application (admin panel + API routes)  
**Performance Goals**: History list remains fast (limit 100); polling should not hammer the server (single interval, backoff optional)  
**Constraints**:
- Auth gating unchanged (`requireAuth` on pages and APIs).
- Details page must handle missing broadcast (`notFound`) and empty deliveries.
- Error code column: show `-` when no code is stored for failures (per spec edge cases).
**Scale/Scope**: Admin-only; three UI/query touchpoints (history table, new details route, chats polling wrapper)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router first)**: History page stays a Server Component where possible; details page loads data on the server; chats polling lives in a small Client Component boundary.
- **Gate B (TypeScript strict + linting)**: Extend `BroadcastListRow` and table props explicitly; no implicit `any`.
- **Gate C (Security & privacy)**: Do not expose new unauthenticated routes; API responses remain admin-session gated.
- **Gate E (Perf/UX/accessibility)**: Long message content on details page should scroll/read safely; polling errors must not brick the page.

## Project Structure

### Documentation (this feature)

```text
specs/005-chats-history-improvements/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (panel)/
│   ├── broadcast/
│   │   └── history/
│   │       ├── page.tsx                 # Server: listBroadcasts → table
│   │       ├── BroadcastHistoryTable.tsx
│   │       └── [id]/
│   │           └── page.tsx             # NEW: broadcast details UI
│   └── chats/
│       ├── page.tsx                     # Server + client wrapper for polling
│       └── ChatsTable.tsx
├── api/
│   ├── broadcasts/
│   │   ├── [id]/route.ts               # Existing JSON details (keep contract)
│   │   └── history/route.ts
│   └── chats/route.ts
src/
└── db/
    └── broadcasts.ts                    # listBroadcasts: add error_code aggregate; types

tests/
├── unit/
└── e2e/
```

**Structure Decision**: Single Next.js app. Extend `listBroadcasts` in `src/db/broadcasts.ts` for the new column; add `app/(panel)/broadcast/history/[id]/page.tsx` using `getBroadcastDetails`; implement chats auto-refresh via a thin client parent that polls `/api/chats` and passes rows into the existing `ChatsTable`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations expected for this feature.
