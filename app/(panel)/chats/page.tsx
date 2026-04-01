import { requireAuth } from "@/src/auth/requireAuth";
import { listChats } from "@/src/db/chats";
import { ChatsTable } from "./ChatsTable";

export default async function ChatsPage() {
  await requireAuth();
  const chats = await listChats();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Chats</h1>
        <p className="text-sm text-zinc-400">
          Read-only list of chats where the bot is present.
        </p>
      </div>

      <ChatsTable
        chats={chats.map((c) => ({
          ...c,
          last_seen_at: c.last_seen_at ? new Date(c.last_seen_at).toISOString() : null,
        }))}
      />
    </div>
  );
}

