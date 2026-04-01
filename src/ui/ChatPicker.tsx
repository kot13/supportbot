"use client";

import { useMemo } from "react";

type Chat = {
  id: number;
  telegramChatId: string;
  title: string | null;
  isActive: boolean;
};

export function ChatPicker({
  chats,
  mode,
  onModeChange,
  selectedIds,
  onSelectedIdsChange,
}: {
  chats: Chat[];
  mode: "all" | "subset";
  onModeChange: (m: "all" | "subset") => void;
  selectedIds: number[];
  onSelectedIdsChange: (ids: number[]) => void;
}) {
  const activeChats = useMemo(() => chats.filter((c) => c.isActive), [chats]);

  function toggle(chatId: number) {
    if (selectedIds.includes(chatId)) {
      onSelectedIdsChange(selectedIds.filter((id) => id !== chatId));
    } else {
      onSelectedIdsChange([...selectedIds, chatId]);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={mode === "all"}
            onChange={() => onModeChange("all")}
          />
          <span>All chats ({activeChats.length})</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={mode === "subset"}
            onChange={() => onModeChange("subset")}
          />
          <span>Selected</span>
        </label>
      </div>

      {mode === "subset" ? (
        <div className="max-h-56 overflow-auto rounded-md border border-zinc-200 bg-white">
          {activeChats.length === 0 ? (
            <div className="p-3 text-sm text-zinc-500">No active chats</div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {activeChats.map((c) => (
                <li key={c.id} className="flex items-center gap-3 p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggle(c.id)}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm">{c.title ?? "Untitled chat"}</div>
                    <div className="truncate text-xs text-zinc-500">{c.telegramChatId}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

