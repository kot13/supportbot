# Research: Telegram bot broadcast panel

**Branch**: `001-telegram-broadcast-panel`  
**Date**: 2026-03-31  
**Spec**: `./spec.md`  

## Decisions

### 1) Bot update delivery: webhook vs long polling
- **Decision**: Start with **webhook** delivery into the application (production) and allow **long polling** for local development as a fallback.
- **Rationale**: Webhooks are operationally efficient and reliable in production; long polling is convenient locally without public ingress.
- **Alternatives considered**:
  - Long polling everywhere: simpler network-wise, but less suitable for production deployments and scaling.

### 2) Message formatting mode
- **Decision**: Support **Telegram HTML-style formatting** for the broadcast composer in v1, with a live preview in the admin UI.
- **Rationale**: HTML is easier to author for many users and less error-prone than MarkdownV2 escaping; preview improves confidence before sending.
- **Alternatives considered**:
  - MarkdownV2: powerful but high friction due to escaping rules.
  - Plain text only: simplest but contradicts the “отформатировать” requirement.

### 3) Auth model (no roles, no registration)
- **Decision**: Use a minimal **session-based** authentication model: credential check on sign-in + server-side session, with protected routes.
- **Rationale**: Matches requirements (single-level admin access) while avoiding unnecessary complexity of roles, signup, recovery flows.
- **Alternatives considered**:
  - Token-only “basic auth”: quick but poor UX and hard to rotate safely.
  - Full identity provider: overkill for stated scope.

### 4) Broadcast execution model and partial failures
- **Decision**: Treat each broadcast as a **batch job** with per-chat delivery outcomes; report a completion summary and store results.
- **Rationale**: Requirement requires per-chat status persistence and a clear admin-visible outcome even when some chats fail.
- **Alternatives considered**:
  - Best-effort fire-and-forget: simpler but provides weak observability and poor admin trust.

### 5) Rate limiting and retries (Telegram constraints)
- **Decision**: Implement an explicit **send queue** for a broadcast with controlled concurrency and basic retry policy for transient errors.
- **Rationale**: Telegram can rate-limit; controlled dispatch avoids cascading failures and produces deterministic reporting.
- **Alternatives considered**:
  - Unlimited parallel sends: risks rate limiting and inconsistent failures.

## Open Questions Resolved by Defaults (v1)
- **Multiple bots**: Out of scope; single bot configuration.
- **Chat management**: UI is read-only; chat set is driven by Telegram updates + DB.
- **Broadcast idempotency**: Duplicate sends are allowed and recorded as separate broadcasts.
