import { requireAuth } from "@/src/auth/requireAuth";
import { listChats } from "@/src/db/chats";

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

      <div className="overflow-hidden rounded-md border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950/40 text-zinc-300">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">telegram_chat_id</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Last seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {chats.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-zinc-400" colSpan={5}>
                  No chats yet. Add the bot to a chat and send any message to generate an update.
                </td>
              </tr>
            ) : (
              chats.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-950/30">
                  <td className="px-3 py-2">{c.title ?? "Untitled chat"}</td>
                  <td className="px-3 py-2 font-mono text-xs text-zinc-300">
                    {c.telegram_chat_id}
                  </td>
                  <td className="px-3 py-2">{c.type ?? "-"}</td>
                  <td className="px-3 py-2">{c.is_active ? "yes" : "no"}</td>
                  <td className="px-3 py-2 text-zinc-400">
                    {c.last_seen_at ? new Date(c.last_seen_at).toISOString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

