import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/src/auth/requireAuth";
import { listChatMessages } from "@/src/db/chatMessages";
import { getChatById } from "@/src/db/chats";

const QuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    before: z.coerce.number().int().positive().optional(),
    after: z.coerce.number().int().positive().optional(),
  })
  .refine((q) => !(q.before !== undefined && q.after !== undefined), {
    message: "Use either before or after, not both",
  });

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  await requireAuth();

  const { id: rawId } = await context.params;
  const chatId = Number(rawId);
  if (!Number.isFinite(chatId) || chatId < 1) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Chat not found" } },
      { status: 404 },
    );
  }

  const chat = await getChatById(chatId);
  if (!chat) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Chat not found" } },
      { status: 404 },
    );
  }

  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
    before: url.searchParams.get("before") ?? undefined,
    after: url.searchParams.get("after") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION", message: "Invalid query parameters" } },
      { status: 400 },
    );
  }

  const limit = parsed.data.limit ?? 50;
  const messages = await listChatMessages(chatId, {
    limit,
    before: parsed.data.before,
    after: parsed.data.after,
  });

  const oldestId = messages[0]?.id;
  const nextBefore =
    parsed.data.after === undefined && messages.length >= limit && oldestId !== undefined
      ? oldestId
      : undefined;

  return NextResponse.json({
    ok: true,
    data: {
      chat: {
        id: chat.id,
        telegramChatId: chat.telegram_chat_id,
        title: chat.title,
        type: chat.type,
        isActive: chat.is_active,
      },
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        telegramMessageId: m.telegram_message_id,
        telegramUserId: m.telegram_user_id,
        telegramUsername: m.telegram_username,
        telegramUserFirstName: m.telegram_user_first_name,
        createdAt: m.created_at.toISOString(),
      })),
      nextBefore,
    },
  });
}
