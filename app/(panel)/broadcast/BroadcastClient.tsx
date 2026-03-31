"use client";

import { useMemo, useState } from "react";

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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const canSend = useMemo(() => {
    if (!content.trim()) return false;
    if (mode === "subset" && selectedIds.length === 0) return false;
    return true;
  }, [content, mode, selectedIds]);

  async function send() {
    setError(null);
    setSummary(null);
    setPending(true);
    try {
      const res = await fetch("/api/broadcasts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content,
          format: "html",
          targetMode: mode,
          chatIds: mode === "subset" ? selectedIds : [],
        }),
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

      <div className="space-y-2">
        <div className="text-sm font-medium">Recipients</div>
        <ChatPicker
          chats={chats}
          mode={mode}
          onModeChange={setMode}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Message</div>
        <MessageEditor value={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={send} disabled={!canSend || pending}>
          {pending ? "Sending…" : "Send broadcast"}
        </Button>
        <a className="text-sm text-zinc-300 hover:underline" href="/broadcast/history">
          View history
        </a>
      </div>
    </div>
  );
}

