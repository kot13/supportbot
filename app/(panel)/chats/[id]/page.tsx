import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAuth } from "@/src/auth/requireAuth";
import { listChatMessages } from "@/src/db/chatMessages";
import { getChatById } from "@/src/db/chats";

import { ChatHistoryClient } from "./ChatHistoryClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function ChatDetailPage({ params }: PageProps) {
  await requireAuth();
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id) || id < 1) notFound();

  const chat = await getChatById(id);
  if (!chat) notFound();

  const messages = await listChatMessages(id, { limit: 50 });
  const initialMessages = messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    telegramUserId: m.telegram_user_id,
    telegramUsername: m.telegram_username,
    telegramUserFirstName: m.telegram_user_first_name,
    createdAt: m.created_at.toISOString(),
  }));
  const nextBefore =
    messages.length >= 50 && messages[0] ? messages[0].id : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{chat.title ?? "Untitled chat"}</h1>
          <p className="text-sm text-zinc-500">
            Telegram ID: <span className="font-mono text-xs">{chat.telegram_chat_id}</span>
            {" · "}
            Type: {chat.type ?? "—"}
            {" · "}
            Active: {chat.is_active ? "yes" : "no"}
          </p>
        </div>
        <Link className="text-sm text-indigo-600 hover:underline" href="/chats">
          ← Back to chats
        </Link>
      </div>

      <ChatHistoryClient
        chatId={id}
        chatTitle={chat.title}
        initialMessages={initialMessages}
        initialNextBefore={nextBefore}
      />
    </div>
  );
}
