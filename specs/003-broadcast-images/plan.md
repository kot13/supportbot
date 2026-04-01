# Implementation Plan: Broadcast images

**Branch**: `003-broadcast-images` | **Date**: 2026-04-01 | **Spec**: `./spec.md`
**Input**: Feature specification from `/specs/003-broadcast-images/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Extend the broadcast feature to support attaching **1–10 images** and sending them together with the broadcast text to Telegram chats. The system should validate attachment count/type, keep text-only broadcast behavior unchanged, and persist attachment **metadata** for history and delivery results (without necessarily persisting the original image bytes).

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (Node.js 20+)  
**Primary Dependencies**: Next.js (App Router), Tailwind CSS + HeroUI, `pg`  
**Storage**: PostgreSQL  
**Testing**: Vitest (unit/integration), Playwright (E2E smoke)  
**Target Platform**: Linux server / container deployment  
**Project Type**: Next.js web application (admin panel + API routes)  
**Performance Goals**: Admin can attach 10 images and send without UI stalls; server avoids holding large buffers longer than necessary  
**Constraints**:
- Telegram albums require **2–10** media items for `sendMediaGroup`; single image must be sent as a single-media message.
- Caption limits apply (Telegram caption limit \(0–1024\) chars after entities parsing).
- Must not leak secrets (bot token) or store raw images in logs.
**Scale/Scope**: Admin-only tool; limited concurrent usage; focus on correctness and clear error feedback

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router first)**: Keep heavy processing server-side; client only for file picking/preview and request submission.
- **Gate B (TypeScript strict + linting)**: Define explicit types for attachment validation and API contract; keep `lint/build` green.
- **Gate C (Security & privacy)**: Never expose bot token; validate attachments and avoid logging raw files.
- **Gate D (DB migrations safe)**: If DB schema changes (attachments metadata), add a forward-only migration.
- **Gate E (Perf/UX/accessibility)**: Clear UI states; avoid freezing UI when selecting multiple images; maintain mobile usability.

## Project Structure

### Documentation (this feature)

```text
specs/003-broadcast-images/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
```text
app/
├── (panel)/
│   └── broadcast/                # UI composer (will add image picker)
└── api/
    └── broadcasts/               # POST contract will accept text-only JSON OR multipart with images

src/
├── domain/
│   └── broadcast/                # sendBroadcast extended to support optional attachments
├── telegram/                     # add sendPhoto/sendMediaGroup support
├── db/                           # migration + persistence helpers for attachment metadata
└── ui/                           # shared UI helpers for validation feedback

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Keep the existing single Next.js app. Add attachment handling in the broadcast UI + API route, persist metadata in Postgres, and extend Telegram adapter(s) to send either a single photo or an album depending on attachment count.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

No constitution violations expected for this feature.
