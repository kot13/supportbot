"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, Link, Modal, useOverlayState } from "@heroui/react";
import { Alert } from "@/src/ui/Alert";
import { Button } from "@/src/ui/Button";
import { truncateBroadcastBody } from "@/src/ui/broadcastConfirmationPreview";
import { canSaveDraft } from "@/src/domain/broadcast/saveDraft";
import {
  BROADCAST_VIDEO_MAX_COUNT,
  BROADCAST_VIDEO_MAX_FILE_BYTES,
  MSG_VIDEO_COUNT,
  MSG_VIDEO_SIZE,
  MSG_VIDEO_TYPE,
  isAllowedVideoMimeType,
  normalizeVideoMimeType,
} from "@/src/domain/broadcast/validateVideos";
import { ChatPicker } from "@/src/ui/ChatPicker";
import { MessageEditor } from "@/src/ui/MessageEditor";

type Chat = {
  id: number;
  telegramChatId: string;
  title: string | null;
  isActive: boolean;
};

type SavedAttachmentMeta = {
  ordinal: number;
  original_filename: string | null;
  mime_type: string;
  size_bytes: number;
};

type BroadcastClientProps = {
  chats: Chat[];
  initialFrom?: string;
  initialFailedOnly?: boolean;
  initialDraftId?: string;
};

const PREVIEW_MAX_CHARS = 600;

export function BroadcastClient({
  chats,
  initialFrom,
  initialFailedOnly = false,
  initialDraftId,
}: BroadcastClientProps) {
  const [mode, setMode] = useState<"all" | "subset">("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(
    Boolean(initialFrom || initialDraftId),
  );
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<number | null>(
    initialDraftId ? Number(initialDraftId) : null,
  );
  const [sourceBroadcastId, setSourceBroadcastId] = useState<number | null>(null);
  const [savedAttachmentMeta, setSavedAttachmentMeta] = useState<SavedAttachmentMeta[]>([]);
  const [skippedNotice, setSkippedNotice] = useState<string | null>(null);

  const confirmState = useOverlayState();
  const { close: closeConfirmModal } = confirmState;

  const hasMedia = images.length > 0 || videos.length > 0;
  const maxLen = hasMedia ? 1024 : 2048;

  const canSend = useMemo(() => {
    if (!content.trim()) return false;
    if (content.length > maxLen) return false;
    if (mode === "subset" && selectedIds.length === 0) return false;
    return true;
  }, [content, maxLen, mode, selectedIds]);

  const canSave = useMemo(
    () => canSaveDraft({ content, targetMode: mode, chatIds: selectedIds }),
    [content, mode, selectedIds],
  );

  useEffect(() => {
    if (!canSend) {
      closeConfirmModal();
    }
  }, [canSend, closeConfirmModal]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      if (!initialDraftId && !initialFrom) return;

      setLoadingInitial(true);
      setError(null);

      try {
        if (initialDraftId) {
          const id = Number(initialDraftId);
          if (!Number.isFinite(id)) {
            setError("Invalid draft id");
            return;
          }
          const res = await fetch(`/api/broadcasts/${id}`);
          const json = (await res.json()) as
            | {
                ok: true;
                data: {
                  broadcast: {
                    id: number;
                    content: string;
                    target_mode: string;
                    status: string;
                  };
                  recipient_chat_ids: number[];
                  attachments: SavedAttachmentMeta[];
                };
              }
            | { ok: false; error: { message: string } };

          if (!res.ok || !json.ok) {
            setError(!json.ok ? json.error.message : "Failed to load draft");
            return;
          }
          if (cancelled) return;

          if (json.data.broadcast.status !== "draft") {
            setError("Broadcast is not a draft");
            return;
          }

          setDraftId(json.data.broadcast.id);
          setContent(json.data.broadcast.content);
          setMode(json.data.broadcast.target_mode === "subset" ? "subset" : "all");
          setSelectedIds((json.data.recipient_chat_ids ?? []).map((id) => Number(id)));
          setSavedAttachmentMeta(json.data.attachments ?? []);
          setSourceBroadcastId(null);
          return;
        }

        if (initialFrom) {
          const id = Number(initialFrom);
          if (!Number.isFinite(id)) {
            setError("Invalid broadcast id");
            return;
          }
          const qs = initialFailedOnly ? "?failedOnly=1" : "";
          const res = await fetch(`/api/broadcasts/${id}/compose${qs}`);
          const json = (await res.json()) as
            | {
                ok: true;
                data: {
                  source_broadcast_id: number;
                  content: string;
                  target_mode: "all" | "subset";
                  chat_ids: number[];
                  attachments: SavedAttachmentMeta[];
                  skipped_recipients: number;
                };
              }
            | { ok: false; error: { message: string } };

          if (!res.ok || !json.ok) {
            setError(!json.ok ? json.error.message : "Failed to load broadcast");
            return;
          }
          if (cancelled) return;

          setSourceBroadcastId(json.data.source_broadcast_id);
          setContent(json.data.content);
          setMode(json.data.target_mode);
          setSelectedIds(json.data.chat_ids.map((id) => Number(id)));
          setSavedAttachmentMeta(json.data.attachments);
          if (json.data.skipped_recipients > 0) {
            setSkippedNotice(
              `${json.data.skipped_recipients} recipient(s) from the original broadcast are no longer available and were skipped.`,
            );
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load broadcast data");
      } finally {
        if (!cancelled) setLoadingInitial(false);
      }
    }

    void loadInitial();

    return () => {
      cancelled = true;
    };
  }, [initialDraftId, initialFrom, initialFailedOnly]);

  function removeImage(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  function removeVideo(idx: number) {
    setVideos(videos.filter((_, i) => i !== idx));
  }

  function onPickImages(files: FileList | null) {
    if (!files) return;
    setError(null);
    const next = [...images];
    setVideos([]);
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        continue;
      }
      if (next.length >= 10) {
        setError("You can attach up to 10 images.");
        break;
      }
      next.push(f);
    }
    setImages(next);
  }

  function onPickVideos(files: FileList | null) {
    if (!files) return;
    setError(null);
    const next = [...videos];
    setImages([]);
    for (const f of Array.from(files)) {
      const mime = normalizeVideoMimeType({ type: f.type, name: f.name });
      if (!isAllowedVideoMimeType(mime)) {
        setError(MSG_VIDEO_TYPE);
        continue;
      }
      if (f.size > BROADCAST_VIDEO_MAX_FILE_BYTES) {
        setError(MSG_VIDEO_SIZE);
        continue;
      }
      if (next.length >= BROADCAST_VIDEO_MAX_COUNT) {
        setError(MSG_VIDEO_COUNT);
        break;
      }
      next.push(f);
    }
    setVideos(next);
  }

  function buildAttachmentMeta() {
    const fromFiles = [
      ...images.map((f) => ({
        originalFilename: f.name,
        mimeType: f.type || "application/octet-stream",
        sizeBytes: f.size,
      })),
      ...videos.map((f) => ({
        originalFilename: f.name,
        mimeType: normalizeVideoMimeType({ type: f.type, name: f.name }),
        sizeBytes: f.size,
      })),
    ];
    if (fromFiles.length > 0) return fromFiles;
    return savedAttachmentMeta.map((a) => ({
      originalFilename: a.original_filename,
      mimeType: a.mime_type,
      sizeBytes: Number(a.size_bytes),
    }));
  }

  function buildDraftBody() {
    return {
      content,
      format: "html" as const,
      targetMode: mode,
      chatIds: mode === "subset" ? selectedIds : [],
      attachmentMeta: buildAttachmentMeta(),
    };
  }

  function buildSendRequest(useMultipart: boolean, sendUrl: string) {
    if (!useMultipart) {
      return fetch(sendUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content,
          format: "html",
          targetMode: mode,
          chatIds: mode === "subset" ? selectedIds : [],
        }),
      });
    }

    const fd = new FormData();
    fd.set("content", content);
    fd.set("format", "html");
    fd.set("targetMode", mode);
    if (mode === "subset") fd.set("chatIds", JSON.stringify(selectedIds));
    if (videos.length > 0) {
      for (const v of videos) fd.append("videos", v, v.name);
    } else {
      for (const img of images) fd.append("images", img, img.name);
    }
    return fetch(sendUrl, { method: "POST", body: fd });
  }

  async function saveDraft() {
    if (!canSave) {
      setError("Add message text or select recipients before saving a draft");
      return;
    }

    setSavingDraft(true);
    setError(null);
    setDraftSavedMessage(null);

    try {
      const body = buildDraftBody();
      const url = draftId ? `/api/broadcasts/${draftId}` : "/api/broadcasts/drafts";
      const method = draftId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = (await res.json()) as
        | { ok: true; data: { id: number } }
        | { ok: false; error: { message: string } };

      if (!res.ok || !json.ok) {
        setError(!json.ok ? json.error.message : "Failed to save draft");
        return;
      }

      setDraftId(json.data.id);
      setDraftSavedMessage(`Draft #${json.data.id} saved.`);
      setSourceBroadcastId(null);
    } catch {
      setError("Failed to save draft");
    } finally {
      setSavingDraft(false);
    }
  }

  const recipientSummary = useMemo(() => {
    if (mode === "all") {
      return `All chats (${chats.length} recipients — matches server broadcast list)`;
    }
    const selected = chats.filter((c) =>
      selectedIds.some((id) => Number(id) === Number(c.id)),
    );
    const titles = selected
      .slice(0, 5)
      .map((c) => c.title ?? "Untitled chat")
      .join(", ");
    const extra = selected.length > 5 ? ` … +${selected.length - 5} more` : "";
    return `Selected chats: ${selectedIds.length}${titles ? ` — ${titles}${extra}` : ""}`;
  }, [chats, mode, selectedIds]);

  const previewParts = useMemo(() => truncateBroadcastBody(content, PREVIEW_MAX_CHARS), [content]);

  const captionTooLongMessage = hasMedia
    ? "Message is too long for a caption with attachments (max 1024 characters)."
    : "Message is too long (max 2048 characters).";

  async function executeBroadcastSend() {
    setError(null);
    setSummary(null);
    setPending(true);
    try {
      const useMultipart = images.length > 0 || videos.length > 0;
      const sendUrl = draftId ? `/api/broadcasts/${draftId}/send` : "/api/broadcasts";

      const res = await buildSendRequest(useMultipart, sendUrl);
      const json = (await res.json()) as
        | { ok: true; data: { id: number; summary: { successCount: number; failureCount: number; recipientsTotal: number } } }
        | { ok: false; error: { message: string } };

      if (!res.ok || !json.ok) {
        setError(!json.ok ? json.error.message : "Send failed");
        return;
      }
      setSummary(
        `Broadcast #${json.data.id}: ${json.data.summary.successCount} success, ${json.data.summary.failureCount} failed (total ${json.data.summary.recipientsTotal}).`,
      );
      setContent("");
      setImages([]);
      setVideos([]);
      setSelectedIds([]);
      setMode("all");
      setDraftId(null);
      setSourceBroadcastId(null);
      setSavedAttachmentMeta([]);
      setSkippedNotice(null);
    } catch {
      setError("Send failed");
    } finally {
      setPending(false);
    }
  }

  async function onConfirmSend() {
    closeConfirmModal();
    await executeBroadcastSend();
  }

  const contextBanner = draftId
    ? `Editing draft #${draftId}`
    : sourceBroadcastId
      ? `Based on broadcast #${sourceBroadcastId}`
      : null;

  return (
    <div className="space-y-6">
      {loadingInitial ? (
        <p className="text-sm text-zinc-500">Loading broadcast…</p>
      ) : null}
      {contextBanner ? (
        <p className="text-sm font-medium text-indigo-700" data-testid="broadcast-context-banner">
          {contextBanner}
        </p>
      ) : null}
      {skippedNotice ? <Alert title="Note" message={skippedNotice} /> : null}
      {error ? <Alert title="Error" message={error} /> : null}
      {summary ? <Alert title="Sent" message={summary} /> : null}
      {draftSavedMessage ? <Alert title="Draft saved" message={draftSavedMessage} /> : null}

      <Card className="rounded-md border border-zinc-200 bg-white">
        <CardContent className="space-y-3">
          <div className="text-sm font-medium">Recipients</div>
          <ChatPicker
            chats={chats}
            mode={mode}
            onModeChange={setMode}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
          />
        </CardContent>
      </Card>

      <Card className="rounded-md border border-zinc-200 bg-white">
        <CardContent className="space-y-3">
          <div className="text-sm font-medium">Message</div>
          <MessageEditor value={content} onChange={setContent} maxLength={maxLen} />
          {content.length > maxLen ? <Alert title="Error" message={captionTooLongMessage} /> : null}

          {savedAttachmentMeta.length > 0 && images.length === 0 && videos.length === 0 ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-medium">Saved attachment metadata</p>
              <ul className="mt-1 list-inside list-disc text-xs">
                {savedAttachmentMeta.map((a) => (
                  <li key={a.ordinal}>
                    {a.original_filename ?? "attachment"} ({a.mime_type})
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs">Re-attach files before sending — binary files are not stored.</p>
            </div>
          ) : null}

          <p className="text-xs text-zinc-500">
            Images and videos cannot be combined in one broadcast. Selecting one type clears the other.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Images</div>
              <div className="text-xs opacity-70">{images.length}/10</div>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onPickImages(e.target.files)}
              disabled={pending || images.length >= 10 || videos.length > 0}
            />

            {images.length > 0 ? (
              <div className="space-y-1">
                {images.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    <div className="min-w-0 truncate">{f.name}</div>
                    <Button variant="secondary" onClick={() => removeImage(idx)} disabled={pending}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-2 border-t border-zinc-100 pt-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Videos</div>
              <div className="text-xs opacity-70">
                {videos.length}/{BROADCAST_VIDEO_MAX_COUNT}
              </div>
            </div>
            <input
              type="file"
              accept="video/mp4,video/quicktime,.mp4,.mov"
              multiple
              onChange={(e) => onPickVideos(e.target.files)}
              disabled={pending || videos.length >= BROADCAST_VIDEO_MAX_COUNT || images.length > 0}
            />

            {videos.length > 0 ? (
              <div className="space-y-1">
                {videos.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    <div className="min-w-0 truncate">{f.name}</div>
                    <Button variant="secondary" onClick={() => removeVideo(idx)} disabled={pending}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          isDisabled={!canSave || pending || savingDraft || loadingInitial}
          onPress={() => void saveDraft()}
        >
          {savingDraft ? "Saving…" : "Save draft"}
        </Button>

        <Modal state={confirmState}>
          <Button type="button" variant="primary" isDisabled={!canSend || pending || loadingInitial}>
            {pending ? "Sending…" : "Send broadcast"}
          </Button>
          <Modal.Backdrop isDismissable={!pending}>
            <Modal.Container placement="center" size="md">
              <Modal.Dialog
                aria-labelledby="broadcast-confirm-title"
                data-testid="broadcast-confirm-dialog"
                id="broadcast-confirm-dialog"
              >
                <Modal.Header>
                  <Modal.Heading id="broadcast-confirm-title">Confirm broadcast</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium text-zinc-700">Recipients: </span>
                    <span className="text-zinc-600">{recipientSummary}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-zinc-700">Images attached: </span>
                    <span className="text-zinc-600">{images.length}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-zinc-700">Videos attached: </span>
                    <span className="text-zinc-600">{videos.length}</span>
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-zinc-700">Message preview</div>
                    <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-zinc-200 bg-zinc-50 p-3 font-sans text-sm text-zinc-800">
                      {previewParts.preview}
                    </pre>
                    {previewParts.truncated ? (
                      <p className="mt-2 text-xs text-zinc-500">
                        Showing first {PREVIEW_MAX_CHARS} characters — full length {previewParts.totalChars}{" "}
                        characters.
                      </p>
                    ) : null}
                  </div>
                </Modal.Body>
                <Modal.Footer className="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="secondary" isDisabled={pending} onPress={() => confirmState.close()}>
                    Cancel
                  </Button>
                  <Button type="button" variant="primary" isDisabled={pending} onPress={() => void onConfirmSend()}>
                    {pending ? "Sending…" : "Confirm send"}
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
        <Link className="text-sm" href="/broadcast/history">
          View history
        </Link>
      </div>
    </div>
  );
}
