import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { createBroadcastMessage } from "@/src/db/broadcasts";
import { toPublicError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";
import { sendBroadcast } from "@/src/domain/broadcast/sendBroadcast";
import { validateBroadcastImages } from "@/src/domain/broadcast/validateImages";
import type { TelegramImageInput } from "@/src/telegram/sendPhoto";

function parseChatIdsFromFormData(fd: FormData): string[] | null {
  const all = fd.getAll("chatIds");
  const values = all.length > 0 ? all : [fd.get("chatIds")].filter((v) => v !== null);

  // Repeated fields: chatIds=1&chatIds=2
  const direct: string[] = [];
  for (const v of values) {
    if (typeof v === "string" && v.trim() && !v.trim().startsWith("[")) {
      // allow chatIds="1" (single) or chatIds="1,2,3" (csv)
      const parts = v.includes(",") ? v.split(",") : [v];
      for (const p of parts) {
        const s = p.trim();
        if (!s) continue;
        direct.push(s);
      }
    }
  }
  if (direct.length > 0) return direct;

  // JSON string: chatIds="[1,2,3]" or chatIds="[\"1\",\"2\"]"
  const raw = fd.get("chatIds");
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const out: string[] = [];
    for (const item of parsed) {
      if (typeof item === "number" && Number.isFinite(item)) out.push(String(item));
      else if (typeof item === "string" && item.trim()) out.push(item.trim());
      else return null;
    }
    return out;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const session = await requireAuth();

  try {
    const contentType = request.headers.get("content-type") ?? "";

    let content = "";
    let format: "html" | "plain" = "html";
    let targetMode: "all" | "subset" = "all";
    let chatIds: string[] = [];
    let images: TelegramImageInput[] = [];

    if (contentType.startsWith("multipart/form-data")) {
      const fd = await request.formData();

      content = String(fd.get("content") ?? "").trim();
      format = (String(fd.get("format") ?? "html") as "html" | "plain") ?? "html";
      targetMode = (String(fd.get("targetMode") ?? "all") as "all" | "subset") ?? "all";

      if (targetMode === "subset") {
        const parsed = parseChatIdsFromFormData(fd);
        if (!parsed || parsed.length === 0) {
          return NextResponse.json(
            { ok: false, error: { message: "Invalid chatIds", code: "VALIDATION" } },
            { status: 400 },
          );
        }
        chatIds = parsed;
      }

      const files = fd.getAll("images");
      const imageFiles = files.filter((f): f is File => typeof f === "object" && f instanceof File);

      if (imageFiles.length > 0) {
        const v = validateBroadcastImages({
          content,
          images: imageFiles.map((f) => ({ mimeType: f.type })),
        });
        if (!v.ok) {
          return NextResponse.json({ ok: false, error: v }, { status: 400 });
        }

        images = [];
        for (const f of imageFiles) {
          const ab = await f.arrayBuffer();
          images.push({
            filename: f.name || "image",
            mimeType: f.type || "application/octet-stream",
            bytes: new Uint8Array(ab),
          });
        }
      }
    } else {
      const body = (await request.json()) as {
        content?: string;
        format?: "html" | "plain";
        targetMode?: "all" | "subset";
        chatIds?: number[];
      };

      content = String(body.content ?? "").trim();
      format = body.format ?? "html";
      targetMode = body.targetMode ?? "all";
      chatIds = Array.isArray(body.chatIds) ? body.chatIds.map((n) => String(n)) : [];
    }

    if (!content) {
      return NextResponse.json(
        { ok: false, error: { message: "Message content is required", code: "VALIDATION" } },
        { status: 400 },
      );
    }

    {
      const maxLen = images.length > 0 ? 1024 : 2048;
      if (content.length > maxLen) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              message:
                images.length > 0
                  ? "Message is too long for an image caption (max 1024 characters)"
                  : "Message is too long (max 2048 characters)",
              code: "VALIDATION",
            },
          },
          { status: 400 },
        );
      }
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
      images: images.length > 0 ? images : undefined,
    });

    return NextResponse.json({ ok: true, data: { id, summary } }, { status: 200 });
  } catch (err) {
    const pub = toPublicError(err);
    logger.warn("broadcast_create_failed", { code: pub.code });
    const status = (err as { status?: number }).status ?? 400;
    return NextResponse.json({ ok: false, error: pub }, { status });
  }
}

