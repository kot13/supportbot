# Implementation Plan: UI polish

**Branch**: `004-ui-polish` | **Date**: 2026-04-01 | **Spec**: `./spec.md`  
**Input**: Feature specification from `/specs/004-ui-polish/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Polish the admin panel UI by:
- Removing the dedicated `/` page and redirecting `/` → `/chats` (keeping existing auth behavior).
- Reordering sidebar navigation so `Bots` is the last item.
- Improving the broadcast composer layout: full-width textarea, same-sized preview, preview preserves line breaks, remove tips, and add a live character counter.
- Aligning message length rules:
  - text-only message: max **2048**
  - message with images (caption): max **1024**
- Switching the panel to a **light** color scheme (light background, dark text) with readable contrast and focus states.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (Node.js 20+)  
**Primary Dependencies**: Next.js (App Router), Tailwind CSS + HeroUI  
**Storage**: PostgreSQL (existing)  
**Testing**: Vitest (unit/integration), Playwright (E2E smoke)  
**Target Platform**: Linux server / container deployment  
**Project Type**: Next.js web application (admin panel + API routes)  
**Performance Goals**: Instant-feeling navigation; composer remains responsive while typing  
**Constraints**:
- Auth gating must remain intact for `/` redirect behavior.
- Preview must match textarea line breaks (no “collapsed” newlines).
- Message length limits must be consistent across UI + server:
  - no images → 2048
  - images attached → 1024
**Scale/Scope**: Admin-only tool; focus on UX correctness and consistent styling

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router first)**: Use Server Components by default; keep interactive components client-only where necessary.
- **Gate B (TypeScript strict + linting)**: Keep lint/build green; no implicit `any`.
- **Gate C (Security & privacy)**: Do not bypass auth due to redirect changes; do not leak secrets.
- **Gate E (Perf/UX/accessibility)**: Maintain contrast, focus states, and responsive layout in the light theme.

## Project Structure

### Documentation (this feature)

```text
specs/004-ui-polish/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
app/
├── (panel)/
│   ├── layout.tsx                  # Sidebar/navigation (ordering + theme wrapper)
│   ├── broadcast/                  # Composer textarea + preview + counter
│   └── chats/                      # Target redirect page
├── page.tsx                        # Root route redirect
└── api/
    └── broadcasts/route.ts          # Server-side validation (1024/2048)

src/
├── ui/                              # Shared UI components used by the panel
└── domain/broadcast/                # Domain validation (1024/2048 with/without images)

tests/
├── unit/
└── e2e/
```

**Structure Decision**: Keep the existing single Next.js app. Apply redirect at `app/page.tsx`, reorder nav in `src/ui/Sidebar.tsx`, update broadcast composer UI in `src/ui/MessageEditor.tsx` + `app/(panel)/broadcast/BroadcastClient.tsx`, and enforce conditional length validation in both API and domain layers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

No constitution violations expected for this feature.
