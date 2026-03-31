# Contracts: Telegram Bot

**Branch**: `001-telegram-broadcast-panel`  
**Date**: 2026-03-31  
**Spec**: `../spec.md`  

This document describes the functional contract of the Telegram bot component.

## Inputs (from Telegram)

The bot receives updates from Telegram that allow the system to:
- Discover chats where the bot is present.
- Update chat title/type when it changes.
- Detect removal/disablement scenarios where possible.

## Outputs (to Telegram)

The bot sends outbound messages as part of a broadcast operation:
- **Input**: chat identifier, message content, formatting mode
- **Output**: success/failure outcome + optional Telegram message id

## Chat discovery & lifecycle rules

- When the bot is added to a chat (or first observes a chat), the system must upsert a `Chat` record.
- When the bot is removed or blocked, the system should mark the chat as inactive if the platform signals it or if delivery fails with a definitive “no longer accessible” outcome.
- The admin panel only reflects the chat list; it does not mutate it directly.

## Delivery outcomes

For each attempted send:
- Persist a per-chat `DeliveryResult`.
- Store failures in a sanitized form suitable for admins (no secrets).
