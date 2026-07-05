# Quickstart: Редактирование, повторная отправка и черновики broadcast-рассылки

**Branch**: `012-broadcast-edit-resend`  
**Date**: 2026-07-05  

## Prerequisites

- Node.js 20+, PostgreSQL с применёнными миграциями (`npm run db:migrate`)
- `.env` с `DATABASE_URL`, авторизация в панели
- Хотя бы один чат в `chats` для тестовой отправки

## Run locally

```bash
npm install
npm run db:migrate
npm run dev
```

Откройте `http://localhost:3000/broadcast` (после логина).

## Manual test flows

### 1. Save and resume draft

1. На `/broadcast` введите текст или выберите получателей.
2. Нажмите **Save draft** — должно появиться сообщение с id.
3. Откройте `/broadcast/history` — строка со статусом `draft`.
4. Откройте черновик → `/broadcast?draftId=N`.
5. Отредактируйте и **Send broadcast** → подтверждение → статус в истории `completed`.

### 2. Edit and resend (sent broadcast)

1. В истории откройте отправленную рассылку.
2. **Edit and resend** → редактор с предзаполнением, баннер «Based on #N».
3. Убедитесь, что в истории **нет** новой строки до отправки.
4. Измените текст, отправьте с подтверждением — новая строка, старая без изменений.

### 3. Retry failed only

1. Для рассылки с `failure_count > 0` нажмите **Retry failed**.
2. В редакторе режим subset, выбраны только чаты с ошибкой.
3. Отправьте и проверьте доставку только им.

### 4. Delete draft

1. Создайте черновик.
2. В истории **Delete** → модал подтверждения → отмена (остался) / подтверждение (удалён).

### 5. Draft with attachments metadata

1. Прикрепите изображение, сохраните черновик.
2. Откройте снова — видны метаданные, файлы нужно прикрепить заново перед send.

## API smoke (curl)

```bash
# Compose prefill (session cookie required)
curl -s -b cookies.txt "http://localhost:3000/api/broadcasts/1/compose"

# Create draft
curl -s -b cookies.txt -X POST http://localhost:3000/api/broadcasts/drafts \
  -H 'content-type: application/json' \
  -d '{"content":"test","format":"html","targetMode":"all","chatIds":[]}'
```

## Tests

```bash
npm test
npm run lint
# E2E (if configured)
npx playwright test tests/e2e/broadcast-edit-resend.spec.ts
```

## Key files

| Area | Path |
|------|------|
| Editor | `app/(panel)/broadcast/BroadcastClient.tsx` |
| History actions | `app/(panel)/broadcast/history/BroadcastHistoryTable.tsx` |
| Draft API | `app/api/broadcasts/drafts/route.ts` |
| Compose API | `app/api/broadcasts/[id]/compose/route.ts` |
| DB | `src/db/broadcasts.ts` |
