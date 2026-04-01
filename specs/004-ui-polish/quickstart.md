# Quickstart: UI polish

**Feature**: `004-ui-polish`  
**Date**: 2026-04-01  
**Spec**: `./spec.md`

## Manual verification checklist

### Redirect

- Open `/` while authenticated → you end up on `/chats`.
- Open `/` while unauthenticated → behavior matches existing auth rules (no accidental access).

### Navigation

- Sidebar shows `Bots` as the last item.

### Broadcast composer layout

- Textarea “Message” is full width of its container.
- Preview block is visually the same width/size as the textarea.
- The “tip” under preview is not shown.
- Preview preserves line breaks:
  - Type:
    - line 1
    - (empty line)
    - line 3
  - Preview renders the empty line too.

### Message length limit

- Without images:
  - 2048 characters is accepted (no validation error, send allowed).
  - 2049 characters shows a validation error and send is blocked (or server rejects with a clear message).
- With images attached:
  - 1024 characters is accepted.
  - 1025 characters shows a validation error and send is blocked (or server rejects with a clear message).

### Light theme

- Panel pages have light background + dark text.
- Focus states are visible on buttons/inputs/links.

