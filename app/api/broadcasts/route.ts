import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { createBroadcastMessage } from "@/src/db/broadcasts";
import { toPublicError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";
import { sendBroadcast } from "@/src/domain/broadcast/sendBroadcast";

export async function POST(request: Request) {
  const session = await requireAuth();

  try {
    const body = (await request.json()) as {
      content?: string;
      format?: "html" | "plain";
      targetMode?: "all" | "subset";
      chatIds?: number[];
    };

    const content = String(body.content ?? "").trim();
    const format = body.format ?? "html";
    const targetMode = body.targetMode ?? "all";
    const chatIds = Array.isArray(body.chatIds) ? body.chatIds : [];

    if (!content) {
      return NextResponse.json(
        { ok: false, error: { message: "Message content is required", code: "VALIDATION" } },
        { status: 400 },
      );
    }

    if (targetMode === "subset" && chatIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: { message: "Select at least one chat", code: "VALIDATION" } },
        { status: 400 },
      );
    }

    const { id } = await createBroadcastMessage({
      content,
      format,
      targetMode,
      createdByAdminUserId: session.adminUserId,
    });

    const summary = await sendBroadcast({
      broadcastMessageId: id,
      content,
      format,
      targetMode,
      chatIds,
    });

    return NextResponse.json({ ok: true, data: { id, summary } }, { status: 200 });
  } catch (err) {
    const pub = toPublicError(err);
    logger.warn("broadcast_create_failed", { code: pub.code });
    const status = (err as { status?: number }).status ?? 400;
    return NextResponse.json({ ok: false, error: pub }, { status });
  }
}

