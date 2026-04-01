import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAuth } from "@/src/auth/requireAuth";
import { getBroadcastDetails } from "@/src/db/broadcasts";

type PageProps = { params: Promise<{ id: string }> };

export default async function BroadcastHistoryDetailPage({ params }: PageProps) {
  await requireAuth();
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id) || id < 1) {
    notFound();
  }

  const { broadcast, deliveries } = await getBroadcastDetails(id);
  if (!broadcast) {
    notFound();
  }

  const successCount = deliveries.filter((d) => d.status === "success").length;
  const failureCount = deliveries.filter((d) => d.status === "failure").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Broadcast #{broadcast.id}</h1>
          <p className="text-sm text-zinc-500">
            Status: <span className="text-zinc-800">{broadcast.status}</span>
            {" · "}
            Format: {broadcast.format} · Target: {broadcast.target_mode}
          </p>
        </div>
        <Link className="text-sm text-indigo-600 hover:underline" href="/broadcast/history">
          ← Back to history
        </Link>
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Created</dt>
          <dd className="font-medium text-zinc-900">{broadcast.created_at.toISOString()}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Sent</dt>
          <dd className="font-medium text-zinc-900">
            {broadcast.sent_at ? broadcast.sent_at.toISOString() : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Recipients (delivery rows)</dt>
          <dd className="font-medium text-zinc-900">{deliveries.length}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Success / failed</dt>
          <dd className="font-medium text-zinc-900">
            {successCount} / {failureCount}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Images attached</dt>
          <dd className="font-medium text-zinc-900">{broadcast.attachments_count}</dd>
        </div>
      </dl>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-zinc-700">Message</h2>
        <div className="max-h-96 overflow-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 whitespace-pre-wrap">
          {broadcast.content}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-zinc-700">Delivery results</h2>
        {deliveries.length === 0 ? (
          <p className="text-sm text-zinc-500">No delivery results yet for this broadcast.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Chat</th>
                  <th className="px-3 py-2 font-medium">Telegram ID</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Attempts</th>
                  <th className="px-3 py-2 font-medium">Sent</th>
                  <th className="px-3 py-2 font-medium">Error code</th>
                  <th className="px-3 py-2 font-medium">Error message</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d) => (
                  <tr key={d.chat_id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-3 py-2">{d.title ?? "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs">{d.telegram_chat_id}</td>
                    <td className="px-3 py-2">{d.status}</td>
                    <td className="px-3 py-2">{d.attempt_count}</td>
                    <td className="px-3 py-2 text-xs">
                      {d.sent_at ? d.sent_at.toISOString() : "—"}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{d.error_code ?? "—"}</td>
                    <td className="px-3 py-2 text-xs text-zinc-700">{d.error_message ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
