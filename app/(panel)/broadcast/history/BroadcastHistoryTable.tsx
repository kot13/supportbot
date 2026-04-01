"use client";

import { DataTable, type DataTableColumn } from "@/src/ui/Table";

type Row = {
  id: number;
  status: string;
  recipients_total: number;
  success_count: number;
  failure_count: number;
  content_preview: string;
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
    | "content_preview"
  >
> = [
  { key: "id", label: "ID" },
  { key: "status", label: "Status" },
  { key: "recipients_total", label: "Recipients" },
  { key: "success_count", label: "Success" },
  { key: "failure_count", label: "Failed" },
  { key: "attachments_count", label: "Images" },
  { key: "content_preview", label: "Preview" },
];

export function BroadcastHistoryTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-zinc-800">
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        emptyContent="No broadcasts yet."
        renderCell={(r, k) => {
          switch (k) {
            case "id":
              return (
                <a className="text-indigo-300 hover:underline" href={`/api/broadcasts/${r.id}`}>
                  #{r.id}
                </a>
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
            case "content_preview":
              return <span className="opacity-80">{r.content_preview}</span>;
            default:
              return "-";
          }
        }}
      />
    </div>
  );
}

