# Implementation Plan: Telegram bot broadcast panel

**Branch**: `001-telegram-broadcast-panel` | **Date**: 2026-03-31 | **Spec**: `./spec.md`
**Input**: Feature specification from `/specs/001-telegram-broadcast-panel/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a web application consisting of:
- An admin panel to authenticate, configure a Telegram bot, view known chats, compose formatted messages, broadcast to all/selected chats, and view send history.
- A Telegram bot component that detects chats where it is added and enables message delivery.

All operational data is persisted in PostgreSQL. The design prioritizes strict/modern UI with a responsive sidebar layout, secure handling of secrets (bot token), and observable/batch-safe message sending with per-chat results.

## Technical Context

**Language/Version**: TypeScript (Node.js LTS)  
**Primary Dependencies**: Next.js (App Router), Telegram Bot SDK, ORM/DB client, UI component primitives  
**Storage**: PostgreSQL  
**Testing**: Unit/integration tests + E2E for primary admin flows  
**Target Platform**: Linux server (container-friendly deployment)  
**Project Type**: Web application (admin panel + backend routes) + Telegram bot worker/service  
**Performance Goals**:
- Broadcast to 50 chats per operation with clear completion summary.
- Admin pages remain responsive on desktop/mobile and load without noticeable delays under normal usage.
**Constraints**:
- Must not leak secrets (bot token, password secrets) to client, logs, or error pages.
- Must handle Telegram rate limits and partial failures during broadcast.
- Chat list is read-only from admin UI; source of truth is Telegram updates + DB.
**Scale/Scope**:
- Single bot configuration (one bot per installation) for v1.
- One or a small number of admins; no roles/permissions/registration flows.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router first)**: Default to Server Components; use Client Components only when required for forms/interactive UI.
- **Gate B (TypeScript strict + linting)**: Plan assumes strict typing, consistent lint/format, and explicit contracts at boundaries (admin auth, bot updates, broadcast requests).
- **Gate C (Security & privacy)**: All auth checks and token handling occur server-side; secrets never rendered to clients; logs redact sensitive data.
- **Gate D (Test strategy by risk)**: Unit/integration for business rules and send recording; E2E for sign-in + broadcast happy path.
- **Gate E (Perf/UX/accessibility)**: Responsive sidebar layout, clear error/empty states, avoid unnecessary client JS.

## Project Structure

### Documentation (this feature)

```text
specs/001-telegram-broadcast-panel/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
```text
app/                          # Next.js App Router pages/layouts
├── (auth)/login/             # Login screen route group
├── (panel)/layout.tsx        # Sidebar layout
├── (panel)/bot/              # Bot settings screen
├── (panel)/chats/            # Read-only chats list
├── (panel)/broadcast/        # Compose & send broadcast + history
└── api/                      # Server route handlers (auth, bot updates, etc.)

src/
├── db/                       # DB client, migrations, query helpers
├── domain/                   # Business rules (broadcast orchestration, validation)
├── telegram/                 # Bot update handling, send adapter, rate-limit handling
├── auth/                     # Session + credential verification (server-only)
├── ui/                       # Shared UI components (sidebar, forms, table, alerts)
└── observability/            # Structured logging helpers + error normalization

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Single Next.js project in repository root, plus a bot runtime that can run either:
- in the same process as the web app (route-handlers-based webhook), or
- as a separate worker/service sharing the same `src/telegram` + `src/db` modules (recommended for operational separation).
The code layout above supports both approaches without splitting into multiple repos.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
