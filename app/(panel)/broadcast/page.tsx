import { requireAuth } from "@/src/auth/requireAuth";
import { listChats } from "@/src/db/chats";

import { BroadcastClient } from "./BroadcastClient";

type PageProps = {
  searchParams: Promise<{
    from?: string;
    failedOnly?: string;
    draftId?: string;
  }>;
};

export default async function BroadcastPage({ searchParams }: PageProps) {
  await requireAuth();
  const sp = await searchParams;
  const chats = await listChats();

  const uiChats = chats.map((c) => ({
    id: Number(c.id),
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
      <BroadcastClient
        chats={uiChats}
        initialFrom={sp.from}
        initialFailedOnly={sp.failedOnly === "1"}
        initialDraftId={sp.draftId}
      />
    </div>
  );
}
