import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { getBotSettings, upsertBotSettings } from "@/src/db/botSettings";
import { BotSettingsUpdateSchema } from "@/src/domain/botSettings/validate";
import { toPublicError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";

export async function GET() {
  await requireAuth();
  const settings = await getBotSettings();

  // Never return raw token secret.
  return NextResponse.json(
    {
      ok: true,
      data: {
        botName: settings.bot_name,
        tokenSet: Boolean(settings.bot_token_secret),
      },
    },
    { status: 200 },
  );
}

export async function PUT(request: Request) {
  await requireAuth();

  try {
    const body = await request.json();
    const input = BotSettingsUpdateSchema.parse(body);

    const current = await getBotSettings();

    const nextName =
      input.botName !== undefined ? input.botName : current.bot_name;
    const nextTokenSecret =
      input.botToken !== undefined ? input.botToken : current.bot_token_secret;

    if (!nextTokenSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: { message: "Bot token is required", code: "VALIDATION" },
        },
        { status: 400 },
      );
    }

    await upsertBotSettings({
      botName: nextName ?? null,
      botTokenSecret: nextTokenSecret ?? null,
    });

    return NextResponse.json(
      {
        ok: true,
        data: {
          botName: nextName ?? null,
          tokenSet: true,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    const pub = toPublicError(err);
    logger.warn("bot_settings_update_failed", { code: pub.code });
    return NextResponse.json({ ok: false, error: pub }, { status: 400 });
  }
}

