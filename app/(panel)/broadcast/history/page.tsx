import Link from "next/link";

import { requireAuth } from "@/src/auth/requireAuth";
import { listBroadcasts } from "@/src/db/broadcasts";

export default async function BroadcastHistoryPage() {
  await requireAuth();
  const rows = await listBroadcasts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Broadcast history</h1>
          <p className="text-sm text-zinc-400">Recent broadcasts and outcomes.</p>
        </div>
        <Link className="text-sm text-indigo-300 hover:underline" href="/broadcast">
          Back to composer
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950/40 text-zinc-300">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Recipients</th>
              <th className="px-3 py-2">Success</th>
              <th className="px-3 py-2">Failed</th>
              <th className="px-3 py-2">Preview</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-zinc-400" colSpan={6}>
                  No broadcasts yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-950/30">
                  <td className="px-3 py-2">
                    <a className="text-indigo-300 hover:underline" href={`/api/broadcasts/${r.id}`}>
                      #{r.id}
                    </a>
                  </td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2">{r.recipients_total}</td>
                  <td className="px-3 py-2">{r.success_count}</td>
                  <td className="px-3 py-2">{r.failure_count}</td>
                  <td className="px-3 py-2 text-zinc-300">{r.content_preview}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-zinc-500">
        Tip: open any item via the API link to see per-chat results (UI details page can be added next).
      </div>
    </div>
  );
}

