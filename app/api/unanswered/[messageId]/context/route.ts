import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/src/auth/requireAuth";
import { getUnansweredUserMessageById } from "@/src/db/chatMessages";
import {
  getUnansweredContextSnapshot,
  rowToSnapshot,
} from "@/src/db/unansweredContextSnapshots";

const ParamsSchema = z.object({
  messageId: z.coerce.number().int().positive(),
});

type RouteContext = { params: Promise<{ messageId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  await requireAuth();

  const { messageId: rawId } = await context.params;
  const parsed = ParamsSchema.safeParse({ messageId: rawId });
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION", message: "Invalid message id" } },
      { status: 400 },
    );
  }

  const message = await getUnansweredUserMessageById(parsed.data.messageId);
  if (!message) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Unanswered message not found" } },
      { status: 404 },
    );
  }

  const row = await getUnansweredContextSnapshot(message.id);
  const snapshot = row ? rowToSnapshot(row) : null;

  return NextResponse.json({
    ok: true,
    data: {
      messageId: message.id,
      reason: message.unanswered_reason,
      createdAt: message.created_at.toISOString(),
      snapshot,
    },
  });
}
