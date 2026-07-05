import { NextResponse } from "next/server";

import { handleTelegramUpdate } from "@/src/telegram/handleUpdate";

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const header = request.headers.get("x-telegram-bot-api-secret-token");
  if (secret && header !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = (await request.json()) as unknown;
  void handleTelegramUpdate(update).catch(() => {
    // Errors logged inside handleTelegramUpdate / processIncomingMessage
  });
  return NextResponse.json({ ok: true }, { status: 200 });
}
