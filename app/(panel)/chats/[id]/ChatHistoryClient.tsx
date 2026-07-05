"use client";

import { useCallback, useEffect, useState } from "react";

import { chatMessageAnchorId } from "@/src/utils/chatMessageLink";
import { formatChatDateTime } from "@/src/utils/formatDateTime";
import { formatTelegramUserDisplayName, telegramUserHref } from "@/src/utils/telegramUser";

type MessageRow = {
  id: number;
  role: "user" | "bot";
  content: string;
  telegramUserId?: number | null;
  telegramUsername?: string | null;
  telegramUserFirstName?: string | null;
  createdAt: string;
};

function MessageAuthorLabel({
  message,
  chatTitle,
}: {
  message: MessageRow;
  chatTitle?: string | null;
}) {
  if (message.role === "bot") {
    return <>Bot</>;
  }

  const label = formatTelegramUserDisplayName({
    firstName: message.telegramUserFirstName,
    username: message.telegramUsername,
    telegramUserId: message.telegramUserId,
    fallback: chatTitle,
  });
  const href = telegramUserHref({
    username: message.telegramUsername,
    telegramUserId: message.telegramUserId,
  });

  if (!href) return <>{label}</>;

  return (
    <a href={href} className="text-indigo-600 hover:underline" target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export function ChatHistoryClient({
  chatId,
  chatTitle,
  initialMessages,
  initialNextBefore,
}: {
  chatId: number;
  chatTitle?: string | null;
  initialMessages: MessageRow[];
  initialNextBefore?: number;
}) {
  const [messages, setMessages] = useState<MessageRow[]>(initialMessages);
  const [nextBefore, setNextBefore] = useState<number | undefined>(initialNextBefore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingScrollId, setPendingScrollId] = useState<number | null>(null);
  const [highlightMessageId, setHighlightMessageId] = useState<number | null>(null);

  const loadOlder = useCallback(async () => {
    if (!nextBefore || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/chats/${chatId}/messages?before=${nextBefore}&limit=50`,
        { credentials: "include" },
      );
      const json: unknown = await res.json();
      if (!res.ok || typeof json !== "object" || json === null || !(json as { ok?: boolean }).ok) {
        throw new Error("Failed to load messages");
      }
      const data = (json as { data: { messages: MessageRow[]; nextBefore?: number } }).data;
      setMessages((prev) => [...data.messages, ...prev]);
      setNextBefore(data.nextBefore);
    } catch {
      setError("Could not load older messages.");
    } finally {
      setLoading(false);
    }
  }, [chatId, loading, nextBefore]);

  useEffect(() => {
    const readHash = () => {
      const match = /^#message-(\d+)$/.exec(window.location.hash);
      setPendingScrollId(match ? Number(match[1]) : null);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  useEffect(() => {
    if (pendingScrollId === null) return;

    const el = document.getElementById(chatMessageAnchorId(pendingScrollId));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightMessageId(pendingScrollId);
      setPendingScrollId(null);
      return;
    }

    if (!loading && nextBefore) {
      void loadOlder();
      return;
    }

    if (!nextBefore) {
      setPendingScrollId(null);
    }
  }, [pendingScrollId, messages, nextBefore, loading, loadOlder]);

  if (messages.length === 0) {
    return (
      <p className="rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-500">
        No messages yet. Send a question to the bot in this Telegram chat.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {nextBefore ? (
        <button
          type="button"
          className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
          onClick={() => void loadOlder()}
          disabled={loading}
        >
          {loading ? "Loading…" : "Load older messages"}
        </button>
      ) : null}
      {error ? (
        <p className="text-xs text-amber-800" role="status">
          {error}
        </p>
      ) : null}
      <ul className="space-y-3">
        {messages.map((m) => (
          <li
            key={m.id}
            id={chatMessageAnchorId(m.id)}
            className={`max-w-[85%] scroll-mt-24 rounded-lg px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-indigo-50 text-zinc-900"
                : "mr-auto border border-zinc-200 bg-white text-zinc-900"
            } ${highlightMessageId === m.id ? "ring-2 ring-indigo-400 ring-offset-2" : ""}`}
          >
            <div className="mb-1 text-xs font-medium text-zinc-500">
              <MessageAuthorLabel message={m} chatTitle={chatTitle} /> · {formatChatDateTime(m.createdAt)}
            </div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
