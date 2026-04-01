# Feature Specification: Chats and History improvements

# **Feature Branch**: `005-chats-history-improvements`  
**Created**: 2026-04-01  
**Status**: Draft  
**Input**: User description: "улучшаем раздел с чатами и историей"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inspect broadcast details from history (Priority: P1)

As an admin, I want to open a broadcast message from the history table and see all available details so that I can understand what was sent and what happened.

**Why this priority**: Debugging and auditability are core admin workflows; history should lead to detailed inspection.

**Independent Test**: Can be tested by opening the history page, clicking a message ID, and verifying a details page shows complete information for that message.

**Acceptance Scenarios**:

1. **Given** I am on the broadcast history page, **When** I click the ID link for a message, **Then** I am taken to a dedicated message details page in the admin panel.
2. **Given** I am on a broadcast message details page, **When** the message exists, **Then** I see all available fields for that message (content, status, recipients counts, timestamps, and delivery results including error codes when present).

---

### User Story 2 - Cleaner, more informative history table (Priority: P2)

As an admin, I want the broadcast history table to show the most important operational fields so I can quickly scan outcomes.

**Why this priority**: The history table is a primary dashboard; removing low-signal columns and adding error code improves triage.

**Independent Test**: Can be tested by viewing the history page and verifying the Preview column is removed and Error code column is present.

**Acceptance Scenarios**:

1. **Given** I am on the broadcast history page, **When** I view the table columns, **Then** there is no Preview column.
2. **Given** there are failed deliveries for a broadcast, **When** I view the history-related data, **Then** an error code is visible (where available) in the table.

---

### User Story 3 - Auto-refresh chats list (Priority: P3)

As an admin, I want the chats list to update automatically so that new chats appear without manual steps.

**Why this priority**: Reduces operational friction; admins shouldn't need to guess when to refresh or trigger sync manually.

**Independent Test**: Can be tested by triggering chat ingestion through normal bot usage and verifying the chats page updates after a short interval without a full page reload.

**Acceptance Scenarios**:

1. **Given** I am on the chats page, **When** a new chat is ingested by the system, **Then** the new chat appears on the page automatically within a reasonable interval.

---

### Edge Cases

- **Missing broadcast**: Opening a details page for a non-existent message shows a clear "not found" state.
- **No delivery results**: Details page renders even if there are no deliveries (e.g., not sent yet) with clear empty state.
- **Missing error code**: If a failed delivery has no error code, UI should show a placeholder (e.g., `-`) rather than blank/misleading values.
- **Large history rows**: Removing Preview reduces clutter; details page should handle long content safely.
- **Auto-refresh failures**: If auto-refresh fails temporarily, the page should remain usable and recover on next poll/refresh.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The broadcast history table MUST NOT display a Preview column.
- **FR-002**: The broadcast history table MUST display an Error code column (showing the error code for failures when available).
- **FR-003**: The ID link in the history table MUST open a dedicated broadcast message details page within the admin panel.
- **FR-004**: The broadcast message details page MUST display all available data for the message, including delivery results and error codes where present. *Interpretation*: “all available data” means the fields returned by the server for that broadcast—specifically the `getBroadcastDetails` result (broadcast row + per-chat delivery rows), same source as `GET /api/broadcasts/[id]`.
- **FR-005**: The chats page MUST automatically refresh its data without requiring a full page reload.

### Key Entities *(include if feature involves data)*

- **Broadcast message**: The sent/queued broadcast record visible in history and on the details page.
- **Delivery result**: Per-chat delivery outcome for a broadcast (includes status and optional error code/message).
- **Chat**: A Telegram chat known to the system and shown on the chats page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: History table no longer shows Preview and shows Error code where available (manual verification).
- **SC-002**: Clicking an ID in history reliably opens a message details page showing message + delivery information (manual verification).
- **SC-003**: Chats page reflects newly ingested chats automatically within a reasonable interval (manual verification).

## Assumptions

- Admin authentication and authorization remain unchanged.
- A broadcast details API already exists or can be added; the details page will use available server-side data to render.
- Auto-refresh uses a reasonable polling interval and does not require WebSockets for v1.
