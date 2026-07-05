import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { getBotSettings, upsertBotSettings } from "@/src/db/botSettings";
import { BotSettingsUpdateSchema } from "@/src/domain/botSettings/validate";
import { toPublicError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";

export async function GET() {
  await requireAuth();
  const settings = await getBotSettings();

  return NextResponse.json(
    {
      ok: true,
      data: {
        botName: settings.bot_name,
        tokenSet: Boolean(settings.bot_token_secret),
        answerModel: settings.answer_model,
        embeddingModel: settings.embedding_model,
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
    const nextAnswerModel =
      input.answerModel !== undefined ? input.answerModel : current.answer_model;
    const nextEmbeddingModel =
      input.embeddingModel !== undefined ? input.embeddingModel : current.embedding_model;

    if (!nextTokenSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: { message: "Bot token is required", code: "VALIDATION" },
        },
        { status: 400 },
      );
    }

    const embeddingModelChanged = nextEmbeddingModel !== current.embedding_model;

    await upsertBotSettings({
      botName: nextName ?? null,
      botTokenSecret: nextTokenSecret ?? null,
      answerModel: nextAnswerModel,
      embeddingModel: nextEmbeddingModel,
    });

    return NextResponse.json(
      {
        ok: true,
        data: {
          botName: nextName ?? null,
          tokenSet: true,
          answerModel: nextAnswerModel,
          embeddingModel: nextEmbeddingModel,
          embeddingModelChanged,
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
