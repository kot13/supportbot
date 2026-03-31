import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { listChats } from "@/src/db/chats";

export async function GET() {
  await requireAuth();
  const chats = await listChats();
  return NextResponse.json(
    {
      ok: true,
      data: chats.map((c) => ({
        id: c.id,
        telegramChatId: c.telegram_chat_id,
        title: c.title,
        type: c.type,
        isActive: c.is_active,
        lastSeenAt: c.last_seen_at,
      })),
    },
    { status: 200 },
  );
}

