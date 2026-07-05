import OpenAI from "openai";

import { getBotSettings } from "@/src/db/botSettings";
import type { RetrievedChunk } from "@/src/db/knowledgeChunks";
import { DEFAULT_ANSWER_MODEL, type AnswerModel } from "@/src/domain/botSettings/models";

import { requireOpenAiKey } from "./embed";
import { buildUserPrompt, hasUsableContext, SYSTEM_PROMPT, type RecentMessage } from "./prompts";

export type AnswerQuestionResult =
  | { ok: true; answer: string }
  | {
      ok: false;
      reason: "no_context" | "openai_error" | "not_configured";
      message: string;
    };

export const NO_CONTEXT_MESSAGE =
  "К сожалению, я не нашёл в документации InAppStory достаточно информации, чтобы ответить на этот вопрос. Попробуйте переформулировать или уточнить тему (SDK, консоль или API).";

export const NOT_CONFIGURED_MESSAGE =
  "Бот временно не может отвечать: не настроен ключ OpenAI. Обратитесь к администратору.";

export const OPENAI_ERROR_MESSAGE =
  "Не удалось сформировать ответ из-за временной ошибки. Попробуйте повторить вопрос чуть позже.";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  requireOpenAiKey();
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY!.trim() });
  }
  return client;
}

async function resolveAnswerModel(): Promise<AnswerModel> {
  const settings = await getBotSettings();
  return settings.answer_model ?? DEFAULT_ANSWER_MODEL;
}

export async function answerQuestion(input: {
  question: string;
  chunks: RetrievedChunk[];
  recentMessages: RecentMessage[];
}): Promise<AnswerQuestionResult> {
  try {
    requireOpenAiKey();
  } catch {
    return { ok: false, reason: "not_configured", message: NOT_CONFIGURED_MESSAGE };
  }

  if (!hasUsableContext(input.chunks)) {
    return { ok: false, reason: "no_context", message: NO_CONTEXT_MESSAGE };
  }

  try {
    const openai = getClient();
    const model = await resolveAnswerModel();
    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: buildUserPrompt({
            question: input.question,
            chunks: input.chunks,
            recentMessages: input.recentMessages,
          }),
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    if (!answer) {
      return { ok: false, reason: "openai_error", message: OPENAI_ERROR_MESSAGE };
    }
    return { ok: true, answer };
  } catch {
    return { ok: false, reason: "openai_error", message: OPENAI_ERROR_MESSAGE };
  }
}
