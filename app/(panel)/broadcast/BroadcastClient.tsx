"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, Link } from "@heroui/react";
import { Alert } from "@/src/ui/Alert";
import { Button } from "@/src/ui/Button";
import { ChatPicker } from "@/src/ui/ChatPicker";
import { MessageEditor } from "@/src/ui/MessageEditor";

type Chat = {
  id: number;
  telegramChatId: string;
  title: string | null;
  isActive: boolean;
};

export function BroadcastClient({ chats }: { chats: Chat[] }) {
  const [mode, setMode] = useState<"all" | "subset">("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const canSend = useMemo(() => {
    if (!content.trim()) return false;
    if (mode === "subset" && selectedIds.length === 0) return false;
    return true;
  }, [content, mode, selectedIds]);

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

  async function send() {
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

  return (
    <div className="space-y-6">
      {error ? <Alert title="Error" message={error} /> : null}
      {summary ? <Alert title="Sent" message={summary} /> : null}

      <Card className="rounded-md border border-zinc-800 bg-zinc-950/40">
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

      <Card className="rounded-md border border-zinc-800 bg-zinc-950/40">
        <CardContent className="space-y-3">
          <div className="text-sm font-medium">Message</div>
          <MessageEditor value={content} onChange={setContent} />

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
                    className="flex items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm"
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
        <Button onClick={send} disabled={!canSend || pending}>
          {pending ? "Sending…" : "Send broadcast"}
        </Button>
        <Link className="text-sm" href="/broadcast/history">
          View history
        </Link>
      </div>
    </div>
  );
}

