"use client";

import { useEffect, useMemo, useState } from "react";

import { Alert } from "@/src/ui/Alert";
import { Button } from "@/src/ui/Button";
import { Input } from "@/src/ui/Input";
import { Loading } from "@/src/ui/Loading";

type BotSettingsResponse =
  | { ok: true; data: { botName: string | null; tokenSet: boolean } }
  | { ok: false; error: { message: string } };

export function BotSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [botName, setBotName] = useState("");
  const [tokenSet, setTokenSet] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const tokenPlaceholder = useMemo(() => {
    return tokenSet ? "Token is set (enter a new token to rotate)" : "Enter bot token";
  }, [tokenSet]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/bot-settings", { method: "GET" });
        const json = (await res.json()) as BotSettingsResponse;
        if (!res.ok || !json.ok) {
          setError(!json.ok ? json.error.message : "Failed to load settings");
          return;
        }
        if (cancelled) return;
        setBotName(json.data.botName ?? "");
        setTokenSet(json.data.tokenSet);
      } catch {
        setError("Failed to load settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    setSaved(false);
    setError(null);
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { botName };
      if (botToken.trim()) payload.botToken = botToken.trim();

      const res = await fetch("/api/bot-settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as BotSettingsResponse;
      if (!res.ok || !json.ok) {
        setError(!json.ok ? json.error.message : "Failed to save settings");
        return;
      }
      setTokenSet(true);
      setBotToken("");
      setSaved(true);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading label="Loading bot settings…" />;
  }

  return (
    <div className="space-y-4">
      {error ? <Alert title="Error" message={error} /> : null}
      {saved ? <Alert title="Saved" message="Bot settings updated." /> : null}

      <Input
        label="Bot name"
        value={botName}
        onChange={(e) => setBotName(e.target.value)}
        placeholder="supportbot"
      />

      <Input
        label="Bot token"
        value={botToken}
        onChange={(e) => setBotToken(e.target.value)}
        placeholder={tokenPlaceholder}
        type="password"
        description="The token is never shown after saving. Enter a new token to rotate it."
        endContent={
          <span className="text-xs opacity-70">{tokenSet ? "set" : "not set"}</span>
        }
      />

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

