"use client";

import { useCallback, useEffect, useState } from "react";

import { Modal, useOverlayState } from "@heroui/react";

type OverlayState = ReturnType<typeof useOverlayState>;

import { Button } from "@/src/ui/Button";
import { formatChatDateTime } from "@/src/utils/formatDateTime";
import { formatUnansweredReason } from "@/src/utils/unansweredReason";

import type {
  UnansweredContextSnapshot,
  UnansweredDialogMessage,
  UnansweredRetrievedChunkSnapshot,
} from "@/src/db/unansweredContextSnapshots";

type ContextResponse = {
  ok: boolean;
  data?: {
    messageId: number;
    reason: string;
    createdAt: string;
    snapshot: UnansweredContextSnapshot | null;
  };
  error?: { code: string; message: string };
};

function ChunkCard({ chunk, index }: { chunk: UnansweredRetrievedChunkSnapshot; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const previewLen = 280;
  const needsExpand = chunk.content.length > previewLen;
  const displayContent =
    expanded || !needsExpand ? chunk.content : `${chunk.content.slice(0, previewLen)}…`;

  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
        <span className="font-medium text-zinc-800">#{index + 1}</span>
        <span>{chunk.sourceType}</span>
        <span className="truncate" title={chunk.sourcePath}>
          {chunk.sourcePath}
        </span>
        <span>distance {chunk.distance.toFixed(3)}</span>
      </div>
      {chunk.title ? <div className="mb-1 font-medium text-zinc-800">{chunk.title}</div> : null}
      <pre className="whitespace-pre-wrap font-sans text-zinc-800">{displayContent}</pre>
      {needsExpand ? (
        <button
          type="button"
          className="mt-2 text-xs text-indigo-600 hover:underline"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Show full text"}
        </button>
      ) : null}
      {chunk.metadata && Object.keys(chunk.metadata).length > 0 ? (
        <pre className="mt-2 overflow-x-auto rounded border border-zinc-200 bg-white p-2 text-xs text-zinc-600">
          {JSON.stringify(chunk.metadata, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

function DialogContext({ messages }: { messages: UnansweredDialogMessage[] }) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-zinc-800">Dialog context</h3>
      <ul className="space-y-2">
        {messages.map((m, i) => (
          <li key={i} className="rounded-md border border-zinc-200 bg-white p-2 text-sm">
            <span className="font-medium text-zinc-600">
              {m.role === "user" ? "User" : "Bot"}:
            </span>{" "}
            <span className="whitespace-pre-wrap text-zinc-800">{m.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SnapshotBody({ snapshot }: { snapshot: UnansweredContextSnapshot }) {
  if (!snapshot.searchPerformed) {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Поиск по базе знаний не выполнялся.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-zinc-200 bg-white p-3 text-sm">
        <div className="font-medium text-zinc-800">Search summary</div>
        <div className="mt-1 text-zinc-600">
          Fragments returned: {snapshot.chunkCount}
          {snapshot.bestDistance !== null ? (
            <>
              {" "}
              · Best distance: {snapshot.bestDistance.toFixed(3)}
            </>
          ) : null}
        </div>
      </div>

      {snapshot.retrievedChunks.length === 0 ? (
        <p className="text-sm text-zinc-600">
          Поиск выполнен, но релевантные фрагменты не найдены.
        </p>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-800">Retrieved chunks</h3>
          {snapshot.retrievedChunks.map((chunk, i) => (
            <ChunkCard key={`${chunk.chunkId}-${i}`} chunk={chunk} index={i} />
          ))}
        </div>
      )}

      <DialogContext messages={snapshot.recentMessages} />
    </div>
  );
}

export function UnansweredContextModal({
  messageId,
  reason,
  createdAt,
  state,
}: {
  messageId: number | null;
  reason: string;
  createdAt: string;
  state: OverlayState;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ContextResponse["data"] | null>(null);

  const load = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/unanswered/${id}/context`);
      const json = (await res.json()) as ContextResponse;
      if (!res.ok || !json.ok || !json.data) {
        setError(json.error?.message ?? "Failed to load context");
        setData(null);
        return;
      }
      setData(json.data);
    } catch {
      setError("Failed to load context");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (state.isOpen && messageId !== null) {
      void load(messageId);
    }
    if (!state.isOpen) {
      setData(null);
      setError(null);
    }
  }, [state.isOpen, messageId, load]);

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable>
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog aria-labelledby="unanswered-context-title">
            <Modal.Header>
              <Modal.Heading id="unanswered-context-title">Answer context</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="max-h-[70vh] space-y-4 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-700">
                  {formatUnansweredReason(reason)}
                </span>
                <span className="text-zinc-500">{formatChatDateTime(createdAt)}</span>
                {data?.snapshot ? (
                  <span
                    className={
                      data.snapshot.searchPerformed
                        ? "rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800"
                        : "rounded-full bg-amber-100 px-2 py-0.5 text-amber-900"
                    }
                  >
                    {data.snapshot.searchPerformed ? "Search performed" : "Search skipped"}
                  </span>
                ) : null}
              </div>

              {loading ? <p className="text-sm text-zinc-500">Loading context…</p> : null}
              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              {!loading && !error && data?.snapshot === null ? (
                <p className="text-sm text-zinc-600">Снимок контекста недоступен (запись до обновления).</p>
              ) : null}

              {!loading && !error && data?.snapshot ? (
                <SnapshotBody snapshot={data.snapshot} />
              ) : null}
            </Modal.Body>
            <Modal.Footer>
              <Button type="button" variant="secondary" onPress={() => state.close()}>
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
