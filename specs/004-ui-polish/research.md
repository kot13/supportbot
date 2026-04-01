# Research: UI polish

**Feature**: `004-ui-polish`  
**Date**: 2026-04-01  
**Spec**: `./spec.md`  

## Findings to confirm in code

- **Root route**: Identify whether `app/page.tsx` exists and whether it renders content or already redirects.
- **Chats route**: Confirm the canonical chats page path is `/chats` in the deployed panel routes.
- **Navigation source of truth**: Locate where sidebar items are defined and confirm moving `Bots` to the end does not break permissions/active link highlighting.
- **Broadcast composer**:
  - Locate textarea container sizing and whether it is constrained by wrapper grid/flex classes.
  - Locate preview rendering and ensure it can render with `white-space: pre-wrap` (or equivalent) to preserve line breaks.
  - Locate any “tip” element shown under preview and confirm it can be removed without losing critical guidance.
- **Message length validation**:
  - Determine current max length limits for:
    - message without images (2048)
    - caption with images (1024)
  - Ensure both client and server validations exist (or add missing side) so UI cannot send invalid payloads.
- **Light theme**:
  - Identify where the current dark palette is applied (layout wrapper, global CSS, Tailwind base classes, shared UI components).
  - Ensure focus rings and disabled states remain visible after switching to light background.

## Decisions (defaults)

- **Redirect behavior**: Use server-side redirect from `/` → `/chats` for authenticated users, relying on existing auth gating mechanisms to handle unauthenticated requests correctly.
- **Preview newline behavior**: Preserve newlines using styling rather than HTML entity conversions, so what you type is what you see.
- **Length rules**: Use conditional limits: max 2048 for text-only messages; max 1024 when images are attached (caption).
- **Theme strategy**: Prefer a single “panel shell” change (layout-level background/text) + fix-ups in shared UI components, instead of patching each page individually.

