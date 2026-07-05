import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import {
  deleteDraft,
  getBroadcastDetails,
  listBroadcastRecipientChatIds,
  updateDraft,
} from "@/src/db/broadcasts";
import { listBroadcastAttachments } from "@/src/db/broadcastAttachments";
import { draftSaveBodySchema } from "@/src/domain/broadcast/broadcastDraftSchemas";
import { canSaveDraft } from "@/src/domain/broadcast/saveDraft";
import { toPublicError } from "@/src/observability/errors";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireAuth();
  const { id } = await ctx.params;
  const broadcastId = Number(id);
  if (!Number.isFinite(broadcastId)) {
    return NextResponse.json(
      { ok: false, error: { message: "Invalid id", code: "VALIDATION" } },
      { status: 400 },
    );
  }

  const data = await getBroadcastDetails(broadcastId);
  if (!data.broadcast) {
    return NextResponse.json(
      { ok: false, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 },
    );
  }

  const recipientChatIds =
    data.broadcast.status === "draft"
      ? await listBroadcastRecipientChatIds(broadcastId)
      : [];

  const attachments =
    data.broadcast.status === "draft"
      ? (await listBroadcastAttachments(broadcastId)).map((a) => ({
          ordinal: a.ordinal,
          original_filename: a.original_filename,
          mime_type: a.mime_type,
          size_bytes: Number(a.size_bytes),
        }))
      : [];

  return NextResponse.json(
    {
      ok: true,
      data: {
        ...data,
        recipient_chat_ids: recipientChatIds,
        attachments,
      },
    },
    { status: 200 },
  );
}

export async function PATCH(
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

  try {
    const body = draftSaveBodySchema.parse(await request.json());

    if (
      !canSaveDraft({
        content: body.content,
        targetMode: body.targetMode,
        chatIds: body.chatIds,
      })
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            message: "Add message text or select recipients before saving a draft",
            code: "VALIDATION",
          },
        },
        { status: 400 },
      );
    }

    await updateDraft(broadcastId, {
      content: body.content,
      format: body.format,
      targetMode: body.targetMode,
      chatIds: body.targetMode === "subset" ? body.chatIds : [],
      attachmentMeta: body.attachmentMeta?.map((a) => ({
        originalFilename: a.originalFilename ?? null,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes,
      })),
    });

    return NextResponse.json({ ok: true, data: { id: broadcastId } }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return NextResponse.json(
          { ok: false, error: { message: "Not found", code: "NOT_FOUND" } },
          { status: 404 },
        );
      }
      if (err.message === "NOT_DRAFT") {
        return NextResponse.json(
          { ok: false, error: { message: "Broadcast is not a draft", code: "NOT_DRAFT" } },
          { status: 409 },
        );
      }
    }
    const pub = toPublicError(err);
    return NextResponse.json({ ok: false, error: pub }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
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

  try {
    await deleteDraft(broadcastId);
    return NextResponse.json({ ok: true, data: { id: broadcastId } }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return NextResponse.json(
          { ok: false, error: { message: "Not found", code: "NOT_FOUND" } },
          { status: 404 },
        );
      }
      if (err.message === "NOT_DRAFT") {
        return NextResponse.json(
          { ok: false, error: { message: "Broadcast is not a draft", code: "NOT_DRAFT" } },
          { status: 409 },
        );
      }
    }
    throw err;
  }
}
