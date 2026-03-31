# Contracts: Admin Panel

**Branch**: `001-telegram-broadcast-panel`  
**Date**: 2026-03-31  
**Spec**: `../spec.md`  

This document describes the user-visible and server-side contracts for the admin panel.

## Routes (UI)

- `/login`
  - Purpose: sign in using login + password.
- `/bot`
  - Purpose: view/update bot name + token.
- `/chats`
  - Purpose: view chats where the bot is present (read-only).
- `/broadcast`
  - Purpose: compose a message, select recipients, send, and view history.

## Server Contracts (conceptual)

### Authentication
- **Sign-in**
  - **Input**: login, password
  - **Output**: authenticated session established, or a generic error message
  - **Rules**:
    - Never reveal whether login exists.
    - Protect against brute force with basic throttling (v1 can be minimal).

- **Protected access**
  - **Rule**: Any request to admin features must require an authenticated session.

### Bot settings
- **Read settings**
  - **Output**: bot name (and token presence indicator), never return raw token secret.
- **Update settings**
  - **Input**: bot name, bot token
  - **Output**: success confirmation or validation error

### Chats (read-only)
- **List chats**
  - **Output**: array of chats with title + telegram chat id, plus status fields if available.
  - **Rule**: No create/edit/delete operations in the UI.

### Broadcast
- **Compose/send**
  - **Input**:
    - content
    - format (v1 default html)
    - recipients: all OR subset list
  - **Output**:
    - broadcast id
    - immediate validation errors, if any
    - send summary (success count, failure count) when completed
- **History**
  - **Output**: list of broadcasts and ability to inspect per-chat delivery results.
