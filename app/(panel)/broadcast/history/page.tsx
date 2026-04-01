import Link from "next/link";

import { requireAuth } from "@/src/auth/requireAuth";
import { listBroadcasts } from "@/src/db/broadcasts";
import { BroadcastHistoryTable } from "./BroadcastHistoryTable";

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
        <Link className="text-sm text-indigo-600 hover:underline" href="/broadcast">
          Back to composer
        </Link>
      </div>

      <BroadcastHistoryTable rows={rows} />
    </div>
  );
}
