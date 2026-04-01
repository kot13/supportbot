"use client";

import Link from "next/link";

import { DataTable, type DataTableColumn } from "@/src/ui/Table";

type Row = {
  id: number;
  status: string;
  recipients_total: number;
  success_count: number;
  failure_count: number;
  error_code_summary: string | null;
  attachments_count: number;
};

const columns: Array<
  DataTableColumn<
    | "id"
    | "status"
    | "recipients_total"
    | "success_count"
    | "failure_count"
    | "attachments_count"
    | "error_code_summary"
  >
> = [
  { key: "id", label: "ID" },
  { key: "status", label: "Status" },
  { key: "recipients_total", label: "Recipients" },
  { key: "success_count", label: "Success" },
  { key: "failure_count", label: "Failed" },
  { key: "attachments_count", label: "Images" },
  { key: "error_code_summary", label: "Error code" },
];

export function BroadcastHistoryTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        emptyContent="No broadcasts yet."
        renderCell={(r, k) => {
          switch (k) {
            case "id":
              return (
                <Link
                  className="text-indigo-600 hover:underline"
                  href={`/broadcast/history/${r.id}`}
                >
                  #{r.id}
                </Link>
              );
            case "status":
              return r.status;
            case "recipients_total":
              return r.recipients_total;
            case "success_count":
              return r.success_count;
            case "failure_count":
              return r.failure_count;
            case "attachments_count":
              return r.attachments_count ? `+${r.attachments_count}` : "-";
            case "error_code_summary":
              return (
                <span className="font-mono text-xs opacity-90">
                  {r.error_code_summary ?? "-"}
                </span>
              );
            default:
              return "-";
          }
        }}
      />
    </div>
  );
}
