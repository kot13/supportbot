"use client";

import { useEffect, useState } from "react";

import { ChatsTable } from "./ChatsTable";

export type ChatsPageClientRow = {
  id: number;
  title: string | null;
  telegram_chat_id: string;
  type: string | null;
  is_active: boolean;
  last_seen_at: string | null;
};

const POLL_MS = 25_000;

type ApiChat = {
  id: number;
  telegramChatId: string;
  title: string | null;
  type: string | null;
  isActive: boolean;
  lastSeenAt: string | null;
};

function mapApiToRows(data: ApiChat[]): ChatsPageClientRow[] {
  return data.map((c) => ({
    id: c.id,
    title: c.title,
    telegram_chat_id: c.telegramChatId,
    type: c.type,
    is_active: c.isActive,
    last_seen_at: c.lastSeenAt ? new Date(c.lastSeenAt).toISOString() : null,
  }));
}

export function ChatsPageClient({ initialChats }: { initialChats: ChatsPageClientRow[] }) {
  const [chats, setChats] = useState(initialChats);
  const [pollError, setPollError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      try {
        const res = await fetch("/api/chats", { credentials: "include" });
        if (!res.ok) {
          throw new Error("poll failed");
        }
        const json: unknown = await res.json();
        if (
          typeof json !== "object" ||
          json === null ||
          !("ok" in json) ||
          !(json as { ok?: unknown }).ok ||
          !("data" in json) ||
          !Array.isArray((json as { data?: unknown }).data)
        ) {
          throw new Error("bad shape");
        }
        const rows = mapApiToRows((json as { data: ApiChat[] }).data);
        if (!cancelled) {
          setChats(rows);
          setPollError(false);
        }
      } catch {
        if (!cancelled) {
          setPollError(true);
        }
      }
    };

    const id = window.setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="space-y-2">
      {pollError ? (
        <p className="text-xs text-amber-800" role="status">
          Could not refresh the list; showing last known data. Will retry on the next interval.
        </p>
      ) : null}
      <ChatsTable chats={chats} />
    </div>
  );
}
