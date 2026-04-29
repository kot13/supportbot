"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, Link, Modal, useOverlayState } from "@heroui/react";
import { Alert } from "@/src/ui/Alert";
import { Button } from "@/src/ui/Button";
import { truncateBroadcastBody } from "@/src/ui/broadcastConfirmationPreview";
import { ChatPicker } from "@/src/ui/ChatPicker";
import { MessageEditor } from "@/src/ui/MessageEditor";

type Chat = {
  id: number;
  telegramChatId: string;
  title: string | null;
  isActive: boolean;
};

const PREVIEW_MAX_CHARS = 600;

export function BroadcastClient({ chats }: { chats: Chat[] }) {
  const [mode, setMode] = useState<"all" | "subset">("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const confirmState = useOverlayState();
  const { close: closeConfirmModal } = confirmState;

  const maxLen = images.length > 0 ? 1024 : 2048;

  const canSend = useMemo(() => {
    if (!content.trim()) return false;
    if (content.length > maxLen) return false;
    if (mode === "subset" && selectedIds.length === 0) return false;
    return true;
  }, [content, maxLen, mode, selectedIds]);

  useEffect(() => {
    if (!canSend) {
      closeConfirmModal();
    }
  }, [canSend, closeConfirmModal]);

  function removeImage(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  function onPickImages(files: FileList | null) {
    if (!files) return;
    setError(null);
    const next = [...images];
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

  const recipientSummary = useMemo(() => {
    if (mode === "all") {
      return `All chats (${chats.length} recipients — matches server broadcast list)`;
    }
    const selected = chats.filter((c) => selectedIds.includes(c.id));
    const titles = selected
      .slice(0, 5)
      .map((c) => c.title ?? "Untitled chat")
      .join(", ");
    const extra = selected.length > 5 ? ` … +${selected.length - 5} more` : "";
    return `Selected chats: ${selectedIds.length}${titles ? ` — ${titles}${extra}` : ""}`;
  }, [chats, mode, selectedIds]);

  const previewParts = useMemo(() => truncateBroadcastBody(content, PREVIEW_MAX_CHARS), [content]);

  async function executeBroadcastSend() {
    setError(null);
    setSummary(null);
    setPending(true);
    try {
      const res =
        images.length === 0
          ? await fetch("/api/broadcasts", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                content,
                format: "html",
                targetMode: mode,
                chatIds: mode === "subset" ? selectedIds : [],
              }),
            })
          : await fetch("/api/broadcasts", {
              method: "POST",
              body: (() => {
                const fd = new FormData();
                fd.set("content", content);
                fd.set("format", "html");
                fd.set("targetMode", mode);
                if (mode === "subset") fd.set("chatIds", JSON.stringify(selectedIds));
                for (const img of images) fd.append("images", img, img.name);
                return fd;
              })(),
            });
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
      setSelectedIds([]);
      setMode("all");
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

  return (
    <div className="space-y-6">
      {error ? <Alert title="Error" message={error} /> : null}
      {summary ? <Alert title="Sent" message={summary} /> : null}

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
          {content.length > maxLen ? (
            <Alert
              title="Error"
              message={
                images.length > 0
                  ? "Message is too long for an image caption (max 1024 characters)."
                  : "Message is too long (max 2048 characters)."
              }
            />
          ) : null}

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
              disabled={pending || images.length >= 10}
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
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Modal state={confirmState}>
          <Button type="button" variant="primary" isDisabled={!canSend || pending}>
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
