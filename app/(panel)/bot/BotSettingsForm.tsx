"use client";

import { useEffect, useMemo, useState } from "react";

import { Alert } from "@/src/ui/Alert";
import { Button } from "@/src/ui/Button";
import { Input } from "@/src/ui/Input";
import { Loading } from "@/src/ui/Loading";

type BotSettingsResponse =
  | { ok: true; data: { botName: string | null; tokenSet: boolean } }
  | { ok: false; error: { message: string } };

type WebhookRegisterResponse =
  | { ok: true; data: { registered: boolean } }
  | { ok: false; error: { message: string; code?: string } };

export function BotSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [botName, setBotName] = useState("");
  const [tokenSet, setTokenSet] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState("");
  const [registeringWebhook, setRegisteringWebhook] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [webhookRegistered, setWebhookRegistered] = useState(false);

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

  async function registerWebhook() {
    setWebhookRegistered(false);
    setWebhookError(null);
    setRegisteringWebhook(true);
    try {
      const res = await fetch("/api/bot-settings/webhook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: webhookUrl.trim() }),
      });
      const json = (await res.json()) as WebhookRegisterResponse;
      if (!res.ok || !json.ok) {
        setWebhookError(!json.ok ? json.error.message : "Failed to register webhook");
        return;
      }
      setWebhookRegistered(true);
    } catch {
      setWebhookError("Failed to register webhook");
    } finally {
      setRegisteringWebhook(false);
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

      <div className="border-t border-default-200 pt-4 space-y-3">
        <h2 className="text-sm font-semibold text-default-700">Telegram webhook</h2>
        <p className="text-sm text-default-600">
          Enter the full public HTTPS URL Telegram should call (for example your app&apos;s{" "}
          <code className="rounded bg-default-100 px-1 py-0.5 text-xs">/api/telegram/webhook</code>
          ). Save the bot token above first.
        </p>
        {webhookError ? <Alert title="Webhook error" message={webhookError} /> : null}
        {webhookRegistered ? (
          <Alert title="Webhook registered" message="Telegram accepted this webhook URL." />
        ) : null}
        <Input
          label="Webhook URL"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://your-domain.example/api/telegram/webhook"
        />
        <Button onClick={registerWebhook} disabled={registeringWebhook || !webhookUrl.trim()}>
          {registeringWebhook ? "Registering…" : "Register webhook"}
        </Button>
      </div>
    </div>
  );
}

