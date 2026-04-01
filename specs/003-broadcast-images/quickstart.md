# Quickstart: Broadcast images

**Branch**: `003-broadcast-images`  
**Date**: 2026-04-01  

## Prerequisites

- App is running locally
- DB migrated + seeded
- Bot token is saved in `/bot`
- At least one chat is present in `/chats`

## Try it

1. Open `/broadcast`
2. Enter message text (HTML formatting as before)
3. Attach **1–10** images
4. Choose recipients (all or selected)
5. Send the broadcast
6. Confirm:
   - The chat receives the images and the text
   - `/broadcast/history` shows the broadcast and indicates attachments were present (e.g., image count)

## Troubleshooting

- If sending **one** image: it is sent as a single-media message.
- If sending **2–10** images: they are sent as an album.
- If Telegram returns an error, check whether the bot can send media in that chat and whether images exceed Telegram limits.

