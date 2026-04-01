# Research: UI navigation and styling

**Branch**: `002-ui-navigation`  
**Date**: 2026-03-31  
**Spec**: `./spec.md`  

## Decisions

### 1) UI kit integration strategy
- **Decision**: Integrate a UI kit to provide consistent primitives (buttons/inputs/tables/alerts) and reduce bespoke styling.
- **Rationale**: Current UI is functional but inconsistent; a UI kit accelerates future screens and enforces consistency.
- **Alternatives considered**:
  - Continue with Tailwind-only custom components: feasible but higher maintenance and drift risk.

### 2) Navigation placement & behavior
- **Decision**: Use the existing panel layout (`app/(panel)/layout.tsx`) as the single source of truth for sidebar + sign out; ensure `/login` uses an auth-only layout without sidebar.
- **Rationale**: Centralizing navigation reduces duplication and prevents regressions.
- **Alternatives considered**:
  - Per-page navigation: duplicates logic and increases risk of missing pages.

### 3) Sign out contract
- **Decision**: Sign out is a single action that invalidates server-side session and returns the user to `/login`.
- **Rationale**: Matches security expectations and simplifies UX.
- **Alternatives considered**:
  - Client-only “logout”: insufficient because session persists server-side.

## Notes

- UI changes must preserve the constitution requirements: server-side auth, no secret leakage, responsive UX.
