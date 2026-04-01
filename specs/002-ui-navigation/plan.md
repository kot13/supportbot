# Implementation Plan: UI navigation and styling

**Branch**: `002-ui-navigation` | **Date**: 2026-03-31 | **Spec**: `./spec.md`
**Input**: Feature specification from `/specs/002-ui-navigation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Improve the admin panel UX by:
- Ensuring consistent sidebar navigation + sign-out action on all authenticated admin pages (and not on `/login`).
- Standardizing UI styling and component usage via a UI kit/design system, to achieve a stricter modern look and consistent empty/loading/error states.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (Node.js 20+)  
**Primary Dependencies**: Next.js (App Router), Tailwind CSS, UI kit (React Hero UI or equivalent)  
**Storage**: PostgreSQL  
**Testing**: Vitest (unit/integration), Playwright (E2E smoke)  
**Target Platform**: Linux server / container deployment  
**Project Type**: Next.js web application (admin panel)  
**Performance Goals**: Navigation between admin screens is instant-feeling under normal usage  
**Constraints**:
- Sidebar must not render on `/login`.
- Sign out must invalidate server-side session.
- UI changes must not introduce sensitive data leakage (tokens, secrets).
**Scale/Scope**: UI-only changes; no new persistent entities

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router first)**: Use Server Components by default; keep interactive nav components as Client Components only where needed.
- **Gate B (TypeScript strict + linting)**: UI kit integration must keep lint/build green.
- **Gate C (Security & privacy)**: Sign-out must invalidate session; UI must not expose secrets (bot token).
- **Gate E (Perf/UX/accessibility)**: Navigation must stay responsive on mobile; consistent empty/error states.

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-navigation/
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
├── (auth)/
├── (panel)/
└── api/

src/
├── ui/
└── auth/

tests/
├── unit/
└── e2e/
```

**Structure Decision**: Keep a single Next.js project. Implement navigation and styling through shared UI components under `src/ui/` and the panel layout under `app/(panel)/layout.tsx`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
