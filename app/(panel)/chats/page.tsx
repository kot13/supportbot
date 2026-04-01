import { requireAuth } from "@/src/auth/requireAuth";
import { listChats } from "@/src/db/chats";

import { ChatsPageClient } from "./ChatsPageClient";

export default async function ChatsPage() {
  await requireAuth();
  const chats = await listChats();

  const initialChats = chats.map((c) => ({
    id: c.id,
    title: c.title,
    telegram_chat_id: c.telegram_chat_id,
    type: c.type,
    is_active: c.is_active,
    last_seen_at: c.last_seen_at ? new Date(c.last_seen_at).toISOString() : null,
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Chats</h1>
        <p className="text-sm text-zinc-400">
          Read-only list of chats where the bot is present. The list refreshes automatically every
          few seconds.
        </p>
      </div>

      <ChatsPageClient initialChats={initialChats} />
    </div>
  );
}
