import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { createBroadcastMessage } from "@/src/db/broadcasts";
import { toPublicError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";
import { sendBroadcast } from "@/src/domain/broadcast/sendBroadcast";
import { validateBroadcastImages } from "@/src/domain/broadcast/validateImages";
import {
  normalizeVideoMimeType,
  validateBroadcastVideos,
} from "@/src/domain/broadcast/validateVideos";
import type { TelegramImageInput } from "@/src/telegram/sendPhoto";
import type { TelegramVideoInput } from "@/src/telegram/sendVideo";

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
    let videos: TelegramVideoInput[] = [];

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

      const imageFields = fd.getAll("images");
      const imageFiles = imageFields.filter((f): f is File => typeof f === "object" && f instanceof File);

      const videoFields = fd.getAll("videos");
      const videoFiles = videoFields.filter((f): f is File => typeof f === "object" && f instanceof File);

      if (imageFiles.length > 0 && videoFiles.length > 0) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              message:
                "Cannot attach images and videos in the same broadcast. Clear one type to use the other.",
              code: "VALIDATION",
            },
          },
          { status: 400 },
        );
      }

      if (videoFiles.length > 0) {
        const vv = validateBroadcastVideos({
          content,
          videos: videoFiles.map((f) => ({
            mimeType: normalizeVideoMimeType({ type: f.type, name: f.name }),
            sizeBytes: f.size,
          })),
        });
        if (!vv.ok) {
          return NextResponse.json({ ok: false, error: { message: vv.message, code: vv.code } }, { status: 400 });
        }

        videos = [];
        for (const f of videoFiles) {
          const ab = await f.arrayBuffer();
          const mimeType = normalizeVideoMimeType({ type: f.type, name: f.name });
          videos.push({
            filename: f.name || "video",
            mimeType,
            bytes: new Uint8Array(ab),
          });
        }
      }

      if (imageFiles.length > 0) {
        const v = validateBroadcastImages({
          content,
          images: imageFiles.map((f) => ({ mimeType: f.type })),
        });
        if (!v.ok) {
          return NextResponse.json({ ok: false, error: { message: v.message, code: v.code } }, { status: 400 });
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
      const hasMedia = images.length > 0 || videos.length > 0;
      const maxLen = hasMedia ? 1024 : 2048;
      if (content.length > maxLen) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              message: hasMedia
                ? "Message is too long for a caption with attachments (max 1024 characters)"
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
      videos: videos.length > 0 ? videos : undefined,
    });

    return NextResponse.json({ ok: true, data: { id, summary } }, { status: 200 });
  } catch (err) {
    const pub = toPublicError(err);
    logger.warn("broadcast_create_failed", { code: pub.code });
    const status = (err as { status?: number }).status ?? 400;
    return NextResponse.json({ ok: false, error: pub }, { status });
  }
}

