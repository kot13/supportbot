"use client";

import Link from "next/link";
import { useState } from "react";

import { useOverlayState } from "@heroui/react";

import { DataTable, type DataTableColumn } from "@/src/ui/Table";
import { Button } from "@/src/ui/Button";
import { chatMessageHref } from "@/src/utils/chatMessageLink";
import { formatChatDateTime } from "@/src/utils/formatDateTime";
import { formatTelegramUserDisplayName, telegramUserHref } from "@/src/utils/telegramUser";
import { formatUnansweredReason } from "@/src/utils/unansweredReason";

import { UnansweredContextModal } from "./UnansweredContextModal";

export type UnansweredRow = {
  id: number;
  chatId: number;
  content: string;
  reason: string;
  createdAt: string;
  chatTitle: string | null;
  chatType: string | null;
  telegramUserId: number | null;
  telegramUsername: string | null;
  telegramUserFirstName: string | null;
};

const columns: Array<
  DataTableColumn<"createdAt" | "question" | "reason" | "chat" | "user" | "actions">
> = [
  { key: "createdAt", label: "When" },
  { key: "question", label: "Question" },
  { key: "reason", label: "Reason" },
  { key: "chat", label: "Chat" },
  { key: "user", label: "User" },
  { key: "actions", label: "" },
];

export function UnansweredTable({ rows }: { rows: UnansweredRow[] }) {
  const modalState = useOverlayState();
  const [selectedRow, setSelectedRow] = useState<UnansweredRow | null>(null);

  const openContext = (row: UnansweredRow) => {
    setSelectedRow(row);
    modalState.open();
  };

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        emptyContent="No unanswered questions yet. Messages appear here when the bot could not answer from the knowledge base."
        renderCell={(r, k) => {
          switch (k) {
            case "createdAt":
              return formatChatDateTime(r.createdAt);
            case "question":
              return (
                <span className="line-clamp-3 whitespace-pre-wrap" title={r.content}>
                  {r.content}
                </span>
              );
            case "reason":
              return formatUnansweredReason(r.reason);
            case "chat":
              return (
                <Link className="text-indigo-600 hover:underline" href={chatMessageHref(r.chatId, r.id)}>
                  {r.chatTitle ?? "Untitled chat"}
                  {r.chatType ? ` (${r.chatType})` : ""}
                </Link>
              );
            case "user": {
              const label = formatTelegramUserDisplayName({
                firstName: r.telegramUserFirstName,
                username: r.telegramUsername,
                telegramUserId: r.telegramUserId,
              });
              const href = telegramUserHref({
                username: r.telegramUsername,
                telegramUserId: r.telegramUserId,
              });
              if (!href) return label;
              return (
                <a href={href} className="text-indigo-600 hover:underline" target="_blank" rel="noreferrer">
                  {label}
                </a>
              );
            }
            case "actions":
              return (
                <Button type="button" variant="secondary" onPress={() => openContext(r)}>
                  View context
                </Button>
              );
            default:
              return "-";
          }
        }}
      />

      <UnansweredContextModal
        messageId={selectedRow?.id ?? null}
        reason={selectedRow?.reason ?? ""}
        createdAt={selectedRow?.createdAt ?? ""}
        state={modalState}
      />
    </>
  );
}
