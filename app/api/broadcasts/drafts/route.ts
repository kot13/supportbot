import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { createDraft } from "@/src/db/broadcasts";
import { draftSaveBodySchema } from "@/src/domain/broadcast/broadcastDraftSchemas";
import { canSaveDraft } from "@/src/domain/broadcast/saveDraft";
import { toPublicError } from "@/src/observability/errors";

export async function POST(request: Request) {
  const session = await requireAuth();

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

    if (body.targetMode === "subset" && body.chatIds.length === 0 && !body.content.trim()) {
      return NextResponse.json(
        { ok: false, error: { message: "Select at least one chat", code: "VALIDATION" } },
        { status: 400 },
      );
    }

    const { id } = await createDraft({
      content: body.content,
      format: body.format,
      targetMode: body.targetMode,
      chatIds: body.targetMode === "subset" ? body.chatIds : [],
      attachmentMeta: body.attachmentMeta?.map((a) => ({
        originalFilename: a.originalFilename ?? null,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes,
      })),
      createdByAdminUserId: session.adminUserId,
    });

    return NextResponse.json({ ok: true, data: { id } }, { status: 201 });
  } catch (err) {
    const pub = toPublicError(err);
    return NextResponse.json({ ok: false, error: pub }, { status: 400 });
  }
}
