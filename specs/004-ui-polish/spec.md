# Feature Specification: UI Polish

**Feature Branch**: `004-ui-polish`  
**Created**: 2026-04-01  
**Status**: Draft  
**Input**: User description: "улучшаем ui"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Consistent entry point to the panel (Priority: P1)

As an admin, I want the panel to open on the chats page (instead of a blank/unused landing page) so that I can immediately see the main working area.

**Why this priority**: Reduces friction and removes an unused route from the primary workflow.

**Independent Test**: Can be fully tested by visiting the root panel URL and verifying it ends up on the chats page without showing the removed page.

**Acceptance Scenarios**:

1. **Given** I am authenticated, **When** I navigate to `/`, **Then** I am redirected to `/chats`.
2. **Given** I am authenticated, **When** I open a new tab to `/`, **Then** I still land on `/chats` and do not see a dedicated `/` page.

---

### User Story 2 - Faster navigation (Priority: P2)

As an admin, I want the navigation items ordered to match my most frequent actions so that I can move around the panel faster.

**Why this priority**: Improves daily usability without changing business logic.

**Independent Test**: Can be fully tested by opening the sidebar and verifying item ordering with a visual check.

**Acceptance Scenarios**:

1. **Given** I can see the sidebar navigation, **When** I view the list of navigation items, **Then** the `Bots` item appears at the end of the list.

---

### User Story 3 - More usable message composer (Priority: P3)

As an admin, I want the message composer and its preview to be visually consistent, full-width, and preserve line breaks so that I can confidently compose and review messages before sending.

**Why this priority**: Reduces formatting surprises and makes composing messages easier.

**Independent Test**: Can be fully tested by entering multi-line text in the message field and verifying the preview renders the same line breaks and occupies the same width.

**Acceptance Scenarios**:

1. **Given** I am on the broadcast page, **When** I type a multi-line message into the message field, **Then** the preview shows the same line breaks as entered.
2. **Given** I am on the broadcast page, **When** I view the message field and preview, **Then** both occupy the full available width of their container and appear visually aligned in size.
3. **Given** I am composing a message, **When** I view the preview area, **Then** there is no tip/help text shown directly under the preview.
4. **Given** I have a long message without images attached, **When** I enter up to 2048 characters, **Then** the UI accepts it and sending is allowed (subject to any existing validation errors unrelated to length).
5. **Given** I have images attached, **When** I enter up to 1024 characters, **Then** the UI accepts it and sending is allowed (subject to any existing validation errors unrelated to length).

---

### Edge Cases

- **Unauthenticated access**: Visiting `/` while unauthenticated should continue to follow existing authentication rules (no accidental bypass due to redirect).
- **Whitespace-only messages**: Existing behavior for empty/whitespace content remains unchanged.
- **Line breaks**: Messages containing multiple consecutive line breaks should preserve those breaks in preview.
- **Length boundary**:
  - Without images: exactly 2048 characters is accepted; 2049+ characters is rejected (with a clear validation error).
  - With images: exactly 1024 characters is accepted; 1025+ characters is rejected (with a clear validation error).
- **Delivery/format limits**: If downstream delivery systems reject content due to formatting/entity constraints, the user should receive a clear error explaining the delivery constraint (instead of a generic failure).
- **Theme consistency**: All panel pages should remain readable and accessible in the light color scheme (contrast and focus states).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST NOT expose a dedicated page at `/` in the admin panel user flow.
- **FR-002**: System MUST redirect requests to `/` to `/chats`.
- **FR-003**: System MUST display the `Bots` navigation item at the end of the navigation list.
- **FR-004**: The message composer textarea MUST use the full available width of its container.
- **FR-005**: The message preview area MUST use the full available width and be visually comparable in size to the message textarea.
- **FR-006**: The preview MUST preserve line breaks entered in the message textarea.
- **FR-007**: The UI MUST NOT show the preview tip/help text directly under the preview area.
- **FR-008**: The UI MUST display a live character counter for the message textarea (e.g., `123/1024`).
- **FR-009**: When images are attached, the maximum allowed caption length MUST be 1024 characters.
- **FR-010**: When no images are attached, the maximum allowed message length MUST be 2048 characters.
- **FR-011**: The panel MUST use a light color scheme (light background, dark text) across all pages in scope.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Navigating to `/` results in reaching `/chats` 100% of the time for authenticated users (manual verification).
- **SC-002**: The navigation list shows `Bots` as the last item (manual verification).
- **SC-003**: A multi-line message renders with matching line breaks in preview (manual verification with at least 3 lines and an empty line between them).
- **SC-004**: When images are attached, the UI accepts captions up to 1024 characters and rejects 1025+ characters with a clear validation error (manual verification).
- **SC-005**: When no images are attached, the UI accepts messages up to 2048 characters and rejects 2049+ characters with a clear validation error (manual verification).
- **SC-006**: The panel is readable in a light theme with visible focus states on interactive elements (manual verification on at least 3 key pages: chats, broadcast, bots).

## Clarifications

### Session 2026-04-01

- Q: Вернуть ограничение на 1024 символа у caption → A: Caption limit is 1024 when images are attached.
- Q: Добавить к textarea Message счётчик символов → A: Show a live character counter for the message textarea.

## Assumptions

- Existing authentication and authorization behavior remains unchanged.
- The redirect from `/` is intended for the current application’s admin panel user experience and should not introduce a new public landing page.
- The redirect MUST NOT become a way to bypass access controls (it must not grant access to protected pages when unauthenticated).
- The same maximum length (2048) applies consistently wherever the message content is validated for sending.
- Light theme applies to the panel pages already present; no new pages are introduced by this feature.
