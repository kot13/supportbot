import { requireAuth } from "@/src/auth/requireAuth";

import { BotSettingsForm } from "./BotSettingsForm";

export default async function BotSettingsPage() {
  await requireAuth();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Bot settings</h1>
        <p className="text-sm text-zinc-400">
          Configure the Telegram bot name and token used for broadcasts.
        </p>
      </div>
      <BotSettingsForm />
    </div>
  );
}

