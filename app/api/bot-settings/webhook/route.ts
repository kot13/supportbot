import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAuth } from "@/src/auth/requireAuth";
import { WebhookRegisterBodySchema, parseHttpsWebhookUrl } from "@/src/domain/telegram/webhookRegister";
import { getBotSettings } from "@/src/db/botSettings";
import { registerTelegramWebhook } from "@/src/telegram/setWebhook";
import { toPublicError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";

export async function POST(request: Request) {
  await requireAuth();

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: { code: "VALIDATION", message: "Request body must be JSON" } },
        { status: 400 },
      );
    }
    const input = WebhookRegisterBodySchema.parse(body);
    const parsed = parseHttpsWebhookUrl(input.url);
    if (!parsed) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "VALIDATION", message: "URL must be a valid HTTPS address" },
        },
        { status: 400 },
      );
    }

    const settings = await getBotSettings();
    const token = settings.bot_token_secret?.trim();
    if (!token) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "VALIDATION", message: "Save a bot token in settings before registering a webhook" },
        },
        { status: 400 },
      );
    }

    const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || null;

    const result = await registerTelegramWebhook({
      botToken: token,
      webhookUrl: parsed.toString(),
      secretToken: secret,
    });

    if (!result.ok) {
      logger.warn("telegram_set_webhook_failed", { message: result.errorMessage });
      return NextResponse.json(
        {
          ok: false,
          error: { code: "TELEGRAM", message: result.errorMessage },
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, data: { registered: true } }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      const msg = err.issues[0]?.message ?? "Invalid request";
      return NextResponse.json({ ok: false, error: { code: "VALIDATION", message: msg } }, { status: 400 });
    }
    const e = toPublicError(err);
    return NextResponse.json({ ok: false, error: { code: e.code, message: e.message } }, { status: 400 });
  }
}
