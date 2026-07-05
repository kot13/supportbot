import { requireAuth } from "@/src/auth/requireAuth";
import { listUnansweredMessages } from "@/src/db/chatMessages";

import { UnansweredTable } from "./UnansweredTable";

export default async function UnansweredPage() {
  await requireAuth();
  const rows = await listUnansweredMessages({ limit: 200 });

  const initialRows = rows.map((r) => ({
    id: r.id,
    chatId: r.chat_id,
    content: r.content,
    reason: r.unanswered_reason,
    createdAt: r.created_at.toISOString(),
    chatTitle: r.chat_title,
    chatType: r.chat_type,
    telegramUserId: r.telegram_user_id,
    telegramUsername: r.telegram_username,
    telegramUserFirstName: r.telegram_user_first_name,
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Unanswered questions</h1>
        <p className="text-sm text-zinc-400">
          User questions where the bot could not provide an answer from the knowledge base (missing
          context, OpenAI error, or index not ready).
        </p>
      </div>

      <UnansweredTable rows={initialRows} />
    </div>
  );
}
