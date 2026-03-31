import { requireAuth } from "@/src/auth/requireAuth";

export default async function PanelHome() {
  await requireAuth();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="text-sm text-zinc-400">
        Use the sidebar to configure the bot and send broadcasts.
      </p>
    </div>
  );
}

