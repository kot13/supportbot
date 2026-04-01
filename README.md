# supportbot

Telegram bot broadcast panel + admin UI.

## Requirements

- PostgreSQL (local or container)
- Telegram bot token (via BotFather)
- At least one Telegram chat where the bot can be added

## Quickstart

1. Install dependencies

```bash
npm install
```

2. Create `.env` from `.env.example` and set `DATABASE_URL`.

3. Start PostgreSQL and create an empty database.

4. Run migrations:

```bash
npm run db:migrate
```

5. Seed a single admin user:

```bash
npm run db:seed
```

6. Run dev server

```bash
npm run dev
```

7. Open the app

- `http://localhost:3000`

8. Sign in at `/login` using the seeded credentials.

9. Open `/bot` and save the Telegram bot token.

10. Add the bot to a Telegram chat and trigger an update:
   - Either configure webhook to `/api/telegram/webhook` (recommended for prod-like setups)
   - Or run the long-polling runner (dev fallback) to ingest updates

11. Confirm the chat appears on `/chats`.

12. Open `/broadcast`, select the chat (or all chats), compose a formatted message, and send.

## Smoke test checklist

- Can sign in with seeded admin credentials.
- Can save bot token and see confirmation.
- Can see at least one chat in `/chats` after adding the bot.
- Can send a broadcast and see a success/failure summary.
- Can view the broadcast record in history with per-chat outcomes.

## UI kit / design system usage

This project uses **HeroUI** (`@heroui/react` + `@heroui/styles`). Please prefer the shared wrappers in `src/ui/` over ad-hoc Tailwind styling.

- **Buttons**: use `src/ui/Button.tsx` (`variant="primary" | "secondary"`). Use `disabled` (mapped to HeroUI `isDisabled`).
- **Inputs**: use `src/ui/Input.tsx`. For simple cases prefer `label`, `description`, `endContent` props (wrapper-level), and native `onChange` for state updates.
- **Alerts / messages**: use `src/ui/Alert.tsx`.
- **Tables**: use `src/ui/Table.tsx` (`DataTable`) for consistent header/row/empty state styling.
- **Loading state**: use `src/ui/Loading.tsx`.

## E2E tests (Playwright)

Playwright requires browser binaries installed locally:

```bash
npx playwright install
```

Run e2e tests (expects the app is running at `E2E_BASE_URL` (default `http://localhost:3000`) and DB is migrated + seeded):

```bash
npm run test:e2e
```

Credentials used by the smoke tests:
- `ADMIN_LOGIN` (default `admin`)
- `ADMIN_PASSWORD` (default `change-me`)

