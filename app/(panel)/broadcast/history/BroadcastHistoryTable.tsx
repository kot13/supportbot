"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Modal, useOverlayState } from "@heroui/react";
import { Button } from "@/src/ui/Button";
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
    | "actions"
  >
> = [
  { key: "id", label: "ID" },
  { key: "status", label: "Status" },
  { key: "recipients_total", label: "Recipients" },
  { key: "success_count", label: "Success" },
  { key: "failure_count", label: "Failed" },
  { key: "attachments_count", label: "Images" },
  { key: "error_code_summary", label: "Error code" },
  { key: "actions", label: "Actions" },
];

export function BroadcastHistoryTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const deleteState = useOverlayState();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openDeleteModal(id: number) {
    setDeleteTargetId(id);
    setDeleteError(null);
    deleteState.open();
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/broadcasts/${deleteTargetId}`, { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; error?: { message: string } };
      if (!res.ok || !json.ok) {
        setDeleteError(json.error?.message ?? "Delete failed");
        return;
      }
      deleteState.close();
      setDeleteTargetId(null);
      router.refresh();
    } catch {
      setDeleteError("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          emptyContent="No broadcasts yet."
          renderCell={(r, k) => {
            const isDraft = r.status === "draft";

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
                return isDraft && r.recipients_total === 0 ? "—" : r.recipients_total;
              case "success_count":
                return isDraft ? "—" : r.success_count;
              case "failure_count":
                return isDraft ? "—" : r.failure_count;
              case "attachments_count":
                return r.attachments_count ? `+${r.attachments_count}` : "-";
              case "error_code_summary":
                return (
                  <span className="font-mono text-xs opacity-90">
                    {isDraft ? "-" : (r.error_code_summary ?? "-")}
                  </span>
                );
              case "actions":
                return (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {isDraft ? (
                      <>
                        <Link
                          className="text-indigo-600 hover:underline"
                          href={`/broadcast?draftId=${r.id}`}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="text-red-600 hover:underline"
                          onClick={() => openDeleteModal(r.id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          className="text-indigo-600 hover:underline"
                          href={`/broadcast?from=${r.id}`}
                        >
                          Resend
                        </Link>
                        {r.failure_count > 0 ? (
                          <Link
                            className="text-indigo-600 hover:underline"
                            href={`/broadcast?from=${r.id}&failedOnly=1`}
                          >
                            Retry failed
                          </Link>
                        ) : null}
                      </>
                    )}
                  </div>
                );
              default:
                return "-";
            }
          }}
        />
      </div>

      <Modal state={deleteState}>
        <span className="hidden" />
        <Modal.Backdrop isDismissable={!deleting}>
          <Modal.Container placement="center" size="sm">
            <Modal.Dialog aria-labelledby="delete-draft-title">
              <Modal.Header>
                <Modal.Heading id="delete-draft-title">Delete draft?</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="space-y-2 text-sm text-zinc-600">
                <p>
                  Delete draft #{deleteTargetId}? This cannot be undone.
                </p>
                {deleteError ? <p className="text-red-600">{deleteError}</p> : null}
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="secondary" isDisabled={deleting} onPress={() => deleteState.close()}>
                  Cancel
                </Button>
                <Button variant="primary" isDisabled={deleting} onPress={() => void confirmDelete()}>
                  {deleting ? "Deleting…" : "Delete"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
