"use client";

import { DataTable, type DataTableColumn } from "@/src/ui/Table";

type ChatRow = {
  id: number;
  title: string | null;
  telegram_chat_id: string;
  type: string | null;
  is_active: boolean;
  last_seen_at: string | null;
};

const columns: Array<DataTableColumn<"title" | "telegram_chat_id" | "type" | "is_active" | "last_seen_at">> =
  [
    { key: "title", label: "Title" },
    { key: "telegram_chat_id", label: "telegram_chat_id" },
    { key: "type", label: "Type" },
    { key: "is_active", label: "Active" },
    { key: "last_seen_at", label: "Last seen" },
  ];

export function ChatsTable({ chats }: { chats: ChatRow[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-zinc-800">
      <DataTable
        columns={columns}
        rows={chats}
        rowKey={(c) => c.id}
        emptyContent="No chats yet. Add the bot to a chat and send any message to generate an update."
        renderCell={(c, k) => {
          switch (k) {
            case "title":
              return c.title ?? "Untitled chat";
            case "telegram_chat_id":
              return <span className="font-mono text-xs opacity-80">{c.telegram_chat_id}</span>;
            case "type":
              return c.type ?? "-";
            case "is_active":
              return c.is_active ? "yes" : "no";
            case "last_seen_at":
              return c.last_seen_at ? new Date(c.last_seen_at).toISOString() : "-";
            default:
              return "-";
          }
        }}
      />
    </div>
  );
}

