"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ANSWER_MODELS,
  EMBEDDING_MODELS,
  type AnswerModel,
  type EmbeddingModel,
} from "@/src/domain/botSettings/models";
import type { KnowledgeIndexStatus } from "@/src/rag/knowledgeIndexStatus";
import { Alert } from "@/src/ui/Alert";
import { Button } from "@/src/ui/Button";
import { Input } from "@/src/ui/Input";
import { Loading } from "@/src/ui/Loading";

type BotSettingsResponse =
  | {
      ok: true;
      data: {
        botName: string | null;
        tokenSet: boolean;
        answerModel: AnswerModel;
        embeddingModel: EmbeddingModel;
        embeddingModelChanged?: boolean;
      };
    }
  | { ok: false; error: { message: string } };

type IndexStatusResponse =
  | { ok: true; data: KnowledgeIndexStatus }
  | { ok: false; error: { message: string } };

type ReindexResponse =
  | { ok: true; data: { status: "running" } }
  | { ok: false; error: { message: string; code?: string } };

type WebhookRegisterResponse =
  | { ok: true; data: { registered: boolean } }
  | { ok: false; error: { message: string; code?: string } };

const INDEX_POLL_MS = 3000;

function formatDateTime(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function indexStatusLabel(state: KnowledgeIndexStatus["state"]): string {
  switch (state) {
    case "current":
      return "Индекс актуален";
    case "outdated":
      return "Индекс устарел";
    case "running":
      return "Переиндексация выполняется…";
    case "failed":
      return "Ошибка переиндексации";
    case "never_indexed":
      return "База знаний не проиндексирована";
    default:
      return state;
  }
}

export function BotSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [botName, setBotName] = useState("");
  const [tokenSet, setTokenSet] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [answerModel, setAnswerModel] = useState<AnswerModel>("gpt-4.1");
  const [embeddingModel, setEmbeddingModel] = useState<EmbeddingModel>("text-embedding-3-small");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [reindexWarning, setReindexWarning] = useState(false);

  const [indexStatus, setIndexStatus] = useState<KnowledgeIndexStatus | null>(null);
  const [indexStatusError, setIndexStatusError] = useState<string | null>(null);
  const [reindexing, setReindexing] = useState(false);
  const [reindexMessage, setReindexMessage] = useState<string | null>(null);

  const [webhookUrl, setWebhookUrl] = useState("");
  const [registeringWebhook, setRegisteringWebhook] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [webhookRegistered, setWebhookRegistered] = useState(false);

  const tokenPlaceholder = useMemo(() => {
    return tokenSet ? "Token is set (enter a new token to rotate)" : "Enter bot token";
  }, [tokenSet]);

  const loadIndexStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge/index-status", { method: "GET" });
      const json = (await res.json()) as IndexStatusResponse;
      if (!res.ok || !json.ok) {
        setIndexStatusError(!json.ok ? json.error.message : "Failed to load index status");
        return null;
      }
      setIndexStatusError(null);
      setIndexStatus(json.data);
      return json.data;
    } catch {
      setIndexStatusError("Failed to load index status");
      return null;
    }
  }, []);

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
        setAnswerModel(json.data.answerModel);
        setEmbeddingModel(json.data.embeddingModel);
        await loadIndexStatus();
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
  }, [loadIndexStatus]);

  useEffect(() => {
    if (indexStatus?.state !== "running") return;

    const timer = window.setInterval(() => {
      void loadIndexStatus().then((status) => {
        if (status && status.state !== "running") {
          setReindexing(false);
          if (status.state === "current") {
            setReindexMessage("Переиндексация завершена успешно.");
          } else if (status.state === "failed") {
            setReindexMessage(status.lastError ?? "Переиндексация завершилась с ошибкой.");
          }
        }
      });
    }, INDEX_POLL_MS);

    return () => window.clearInterval(timer);
  }, [indexStatus?.state, loadIndexStatus]);

  async function save() {
    setSaved(false);
    setReindexWarning(false);
    setError(null);
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { botName, answerModel, embeddingModel };
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
      setAnswerModel(json.data.answerModel);
      setEmbeddingModel(json.data.embeddingModel);
      setSaved(true);
      if (json.data.embeddingModelChanged) {
        setReindexWarning(true);
      }
      await loadIndexStatus();
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function startReindex() {
    setReindexMessage(null);
    setError(null);
    setReindexing(true);
    try {
      const res = await fetch("/api/knowledge/reindex", { method: "POST" });
      const json = (await res.json()) as ReindexResponse;
      if (!res.ok || !json.ok) {
        setReindexing(false);
        setError(!json.ok ? json.error.message : "Failed to start reindex");
        return;
      }
      await loadIndexStatus();
    } catch {
      setReindexing(false);
      setError("Failed to start reindex");
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

  const reindexDisabled =
    reindexing || indexStatus?.state === "running" || saving;

  if (loading) {
    return <Loading label="Loading bot settings…" />;
  }

  return (
    <div className="space-y-6">
      {error ? <Alert title="Error" message={error} /> : null}
      {saved ? <Alert title="Saved" message="Bot settings updated." /> : null}
      {reindexWarning ? (
        <Alert
          title="Требуется переиндексация"
          message="Модель эмбеддингов изменена. Запустите переиндексацию базы знаний для корректного поиска."
        />
      ) : null}
      {reindexMessage ? <Alert title="База знаний" message={reindexMessage} /> : null}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-default-700">Идентификация бота</h2>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-default-700">Модели</h2>
        <div className="space-y-1">
          <div className="text-sm opacity-80">Модель ответов</div>
          <select
            className="w-full rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm"
            value={answerModel}
            onChange={(e) => setAnswerModel(e.target.value as AnswerModel)}
          >
            {ANSWER_MODELS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-80">Модель эмбеддингов</div>
          <select
            className="w-full rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm"
            value={embeddingModel}
            onChange={(e) => setEmbeddingModel(e.target.value as EmbeddingModel)}
          >
            {EMBEDDING_MODELS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </section>

      <section className="space-y-3 border-t border-default-200 pt-4">
        <h2 className="text-sm font-semibold text-default-700">База знаний</h2>
        {indexStatusError ? <Alert title="Index status" message={indexStatusError} /> : null}
        {indexStatus ? (
          <div className="space-y-2 text-sm text-default-700">
            <div>
              <span className="font-medium">Статус:</span> {indexStatusLabel(indexStatus.state)}
            </div>
            {indexStatus.state === "outdated" || indexStatus.state === "never_indexed" ? (
              <p className="text-default-600">
                {indexStatus.state === "outdated"
                  ? "Индекс построен с другой моделью эмбеддингов. Требуется переиндексация."
                  : "Индексация ещё не выполнялась или база пуста."}
              </p>
            ) : null}
            {indexStatus.lastCompletedAt ? (
              <div>
                <span className="font-medium">Последняя успешная переиндексация:</span>{" "}
                {formatDateTime(indexStatus.lastCompletedAt)}
              </div>
            ) : null}
            {indexStatus.lastError && indexStatus.state === "failed" ? (
              <p className="text-default-600">{indexStatus.lastError}</p>
            ) : null}
          </div>
        ) : null}
        <Button onClick={startReindex} disabled={reindexDisabled}>
          {reindexing || indexStatus?.state === "running"
            ? "Переиндексация…"
            : "Переиндексировать базу знаний"}
        </Button>
      </section>

      <section className="border-t border-default-200 pt-4 space-y-3">
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
      </section>
    </div>
  );
}
