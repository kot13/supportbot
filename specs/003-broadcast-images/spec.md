# Feature Specification: Broadcast images

**Feature Branch**: `003-broadcast-images`  
**Created**: 2026-04-01  
**Status**: Draft  
**Input**: User description: "следующий этап - добавляем возможность отправлять картинки в телеграм-сообщении. К сообщению можно добавить от 1 до 10 картинок. Они отправляются вместе с сообщением."

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

### User Story 1 - Send a broadcast with images (Priority: P1)

Администратор может прикрепить к сообщению рассылки изображения (от 1 до 10) и отправить их вместе с текстом в выбранные чаты.

**Why this priority**: Картинки — частый формат контента; возможность отправлять их вместе с текстом повышает полезность рассылок.

**Independent Test**: Открыть экран рассылки, добавить 1–10 картинок, отправить в один тестовый чат и убедиться, что в чате пришло сообщение с картинками и текстом.

**Acceptance Scenarios**:

1. **Given** администратор авторизован и есть хотя бы один активный чат, **When** он добавляет 1 картинку и отправляет рассылку в выбранный чат, **Then** в чате появляется сообщение с картинкой и текстом.
2. **Given** администратор авторизован и есть хотя бы один активный чат, **When** он добавляет несколько картинок (2–10) и отправляет рассылку, **Then** в чате появляется сообщение с набором картинок и текстом.
3. **Given** администратор авторизован, **When** он пытается отправить рассылку с 0 картинок (не добавляя картинки), **Then** поведение соответствует текущей текстовой рассылке (изображения не требуются).
4. **Given** администратор прикрепил ровно 1 картинку, **When** он отправляет рассылку, **Then** в чат приходит одно медиа‑сообщение с этой картинкой, а текст рассылки добавлен как подпись (caption) к картинке.
5. **Given** администратор прикрепил 2–10 картинок, **When** он отправляет рассылку, **Then** в чат приходит альбом из картинок, а текст рассылки добавлен как подпись (caption) к первой картинке альбома.

---

### User Story 2 - Validation and feedback for image attachments (Priority: P2)

Администратор получает понятную обратную связь при ошибках добавления/отправки изображений и не может превысить лимит вложений.

**Why this priority**: Снижает количество ошибок и повторных попыток отправки, экономит время.

**Independent Test**: Попытаться добавить 11-ю картинку и убедиться, что интерфейс не позволяет; попытаться отправить с некорректным файлом и увидеть ошибку.

**Acceptance Scenarios**:

1. **Given** администратор добавил 10 картинок, **When** он пытается добавить 11-ю, **Then** система не принимает 11-ю картинку и показывает понятное сообщение.
2. **Given** администратор прикрепляет файл, который не является изображением, **When** система валидирует вложения, **Then** система отклоняет файл и показывает понятную ошибку.
3. **Given** при отправке возникает ошибка доставки изображения в конкретный чат, **When** рассылка завершается, **Then** результат по этому чату фиксируется как ошибка и отображается в истории рассылок.

---

### User Story 3 - Broadcast history preserves attachments metadata (Priority: P3)

Администратор может открыть историю рассылок и видеть, что рассылка содержала изображения (без необходимости повторно показывать сами файлы).

**Why this priority**: История нужна для контроля и повторяемости; важно понимать, что именно отправлялось.

**Independent Test**: Отправить рассылку с картинками и убедиться, что в истории видны признаки вложений (например, количество изображений).

**Acceptance Scenarios**:

1. **Given** была отправлена рассылка с изображениями, **When** администратор открывает историю, **Then** он видит, что у сообщения были вложения (например, “Images: 3”).

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- Что происходит, если администратор добавляет картинки и затем удаляет часть из них перед отправкой?
- Что происходит при попытке прикрепить очень большой файл (превышающий допустимый размер)?
- Что происходит при отправке картинок в чат, где бот не имеет прав отправлять медиа?
- Что происходит, если часть картинок отправилась, а часть — нет (частичный успех)?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST allow an authenticated admin to attach **1 to 10** images to a broadcast message.
- **FR-002**: System MUST include the broadcast text together with images as a caption (caption for a single image; caption on the first image for 2–10 image albums).
- **FR-003**: System MUST prevent attaching more than 10 images and provide a clear user-facing error.
- **FR-004**: System MUST accept only image files as attachments and reject non-image files with a clear user-facing error.
- **FR-005**: System MUST store sent broadcast records such that it is possible to tell whether images were attached (e.g., count of images).
- **FR-006**: System MUST record per-recipient delivery outcomes for broadcasts with images, including failures.
- **FR-007**: System MUST keep the existing behavior for text-only broadcasts unchanged.
- **FR-008**: If the broadcast text cannot be sent together with images due to caption limits, the system MUST show a clear error and MUST NOT partially deliver the broadcast.

### Key Entities *(include if feature involves data)*

- **Broadcast message**: Message content and metadata for a sent broadcast; may include image attachments metadata (e.g., count).
- **Broadcast attachment**: An image attached to a broadcast message (file reference and ordering).
- **Delivery result**: Per-chat outcome for a broadcast attempt (success/failure and error details).

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: An admin can send a broadcast with **1 image** to a single chat in under **60 seconds** from opening the broadcast page (excluding waiting for network).
- **SC-002**: An admin can attach **10 images** without the UI becoming unusable (no crashes; clear limit enforcement).
- **SC-003**: For broadcasts with images, the system produces a delivery summary where each recipient is accounted for as success or failure.

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- Admin authentication and the existing broadcast flow remain in place; this feature extends it with image attachments.
- Images are sent to Telegram chats where the bot is already present and has permission to send media.
- The feature targets a typical admin workflow on desktop and mobile; responsive UI behavior must remain usable.
- Text formatting rules (HTML) remain as-is for the text portion of the broadcast.
