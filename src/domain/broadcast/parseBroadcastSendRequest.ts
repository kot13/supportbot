import type { TelegramImageInput } from "@/src/telegram/sendPhoto";
import type { TelegramVideoInput } from "@/src/telegram/sendVideo";
import { validateBroadcastImages } from "@/src/domain/broadcast/validateImages";
import {
  normalizeVideoMimeType,
  validateBroadcastVideos,
} from "@/src/domain/broadcast/validateVideos";

export type ParsedBroadcastSendBody = {
  content: string;
  format: "html" | "plain";
  targetMode: "all" | "subset";
  chatIds: string[];
  images: TelegramImageInput[];
  videos: TelegramVideoInput[];
};

export function parseChatIdsFromFormData(fd: FormData): string[] | null {
  const all = fd.getAll("chatIds");
  const values = all.length > 0 ? all : [fd.get("chatIds")].filter((v) => v !== null);

  const direct: string[] = [];
  for (const v of values) {
    if (typeof v === "string" && v.trim() && !v.trim().startsWith("[")) {
      const parts = v.includes(",") ? v.split(",") : [v];
      for (const p of parts) {
        const s = p.trim();
        if (!s) continue;
        direct.push(s);
      }
    }
  }
  if (direct.length > 0) return direct;

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

export async function parseBroadcastSendRequest(
  request: Request,
): Promise<ParsedBroadcastSendBody> {
  const contentType = request.headers.get("content-type") ?? "";

  let content = "";
  let format: "html" | "plain" = "html";
  let targetMode: "all" | "subset" = "all";
  let chatIds: string[] = [];
  const images: TelegramImageInput[] = [];
  const videos: TelegramVideoInput[] = [];

  if (contentType.startsWith("multipart/form-data")) {
    const fd = await request.formData();

    content = String(fd.get("content") ?? "").trim();
    format = (String(fd.get("format") ?? "html") as "html" | "plain") ?? "html";
    targetMode = (String(fd.get("targetMode") ?? "all") as "all" | "subset") ?? "all";

    if (targetMode === "subset") {
      const parsed = parseChatIdsFromFormData(fd);
      if (!parsed || parsed.length === 0) {
        throw Object.assign(new Error("Invalid chatIds"), { code: "VALIDATION", status: 400 });
      }
      chatIds = parsed;
    }

    const imageFiles = fd
      .getAll("images")
      .filter((f): f is File => typeof f === "object" && f instanceof File);
    const videoFiles = fd
      .getAll("videos")
      .filter((f): f is File => typeof f === "object" && f instanceof File);

    if (imageFiles.length > 0 && videoFiles.length > 0) {
      throw Object.assign(
        new Error("Cannot attach images and videos in the same broadcast."),
        { code: "VALIDATION", status: 400 },
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
        throw Object.assign(new Error(vv.message), { code: vv.code, status: 400 });
      }
      for (const f of videoFiles) {
        const ab = await f.arrayBuffer();
        videos.push({
          filename: f.name || "video",
          mimeType: normalizeVideoMimeType({ type: f.type, name: f.name }),
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
        throw Object.assign(new Error(v.message), { code: v.code, status: 400 });
      }
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
    throw Object.assign(new Error("Message content is required"), { code: "VALIDATION", status: 400 });
  }

  const hasMedia = images.length > 0 || videos.length > 0;
  const maxLen = hasMedia ? 1024 : 2048;
  if (content.length > maxLen) {
    const msg = hasMedia
      ? "Message is too long for a caption with attachments (max 1024 characters)"
      : "Message is too long (max 2048 characters)";
    throw Object.assign(new Error(msg), { code: "VALIDATION", status: 400 });
  }

  if (targetMode === "subset" && chatIds.length === 0) {
    throw Object.assign(new Error("Select at least one chat"), { code: "VALIDATION", status: 400 });
  }

  return { content, format, targetMode, chatIds, images, videos };
}
