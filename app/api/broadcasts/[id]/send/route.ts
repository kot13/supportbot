import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import {
  getBroadcastStatus,
  replaceBroadcastRecipients,
  updateBroadcastMessageFields,
} from "@/src/db/broadcasts";
import { sendBroadcast } from "@/src/domain/broadcast/sendBroadcast";
import { parseBroadcastSendRequest } from "@/src/domain/broadcast/parseBroadcastSendRequest";
import { toPublicError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireAuth();
  const { id: raw } = await ctx.params;
  const broadcastId = Number(raw);
  if (!Number.isFinite(broadcastId) || broadcastId < 1) {
    return NextResponse.json(
      { ok: false, error: { message: "Invalid id", code: "VALIDATION" } },
      { status: 400 },
    );
  }

  const status = await getBroadcastStatus(broadcastId);
  if (!status) {
    return NextResponse.json(
      { ok: false, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 },
    );
  }
  if (status !== "draft") {
    return NextResponse.json(
      { ok: false, error: { message: "Broadcast is not a draft", code: "NOT_DRAFT" } },
      { status: 409 },
    );
  }

  try {
    const parsed = await parseBroadcastSendRequest(request);

    await updateBroadcastMessageFields(broadcastId, {
      content: parsed.content,
      format: parsed.format,
      targetMode: parsed.targetMode,
    });

    if (parsed.targetMode === "subset") {
      const numericIds = parsed.chatIds.map((c) => Number(c)).filter((n) => Number.isFinite(n));
      await replaceBroadcastRecipients(broadcastId, numericIds);
    } else {
      await replaceBroadcastRecipients(broadcastId, []);
    }

    const summary = await sendBroadcast({
      broadcastMessageId: broadcastId,
      content: parsed.content,
      format: parsed.format,
      targetMode: parsed.targetMode,
      chatIds: parsed.chatIds,
      images: parsed.images.length > 0 ? parsed.images : undefined,
      videos: parsed.videos.length > 0 ? parsed.videos : undefined,
    });

    return NextResponse.json({ ok: true, data: { id: broadcastId, summary } }, { status: 200 });
  } catch (err) {
    const pub = toPublicError(err);
    logger.warn("broadcast_draft_send_failed", { code: pub.code, broadcastId });
    const statusCode = (err as { status?: number }).status ?? 400;
    return NextResponse.json({ ok: false, error: pub }, { status: statusCode });
  }
}
