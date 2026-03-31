import { requireAuth } from "@/src/auth/requireAuth";
import { listChats } from "@/src/db/chats";

import { BroadcastClient } from "./BroadcastClient";

export default async function BroadcastPage() {
  await requireAuth();
  const chats = await listChats();

  const uiChats = chats.map((c) => ({
    id: c.id,
    telegramChatId: c.telegram_chat_id,
    title: c.title,
    isActive: c.is_active,
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Broadcast</h1>
        <p className="text-sm text-zinc-400">
          Create and send a message to all or selected chats.
        </p>
      </div>
      <BroadcastClient chats={uiChats} />
    </div>
  );
}

