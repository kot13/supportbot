export type TelegramUpdate = unknown;

export type NormalizedChat = {
  telegramChatId: string;
  title?: string;
  type?: string;
  lastSeenAt: Date;
  /** When false, bot is not an active member (e.g. left/kicked). */
  isActive: boolean;
};

export type NormalizedIncomingMessage = {
  updateId: number;
  telegramChatId: string;
  chatType: string;
  text: string;
  telegramMessageId: number;
  telegramUserId: number | null;
  telegramUsername: string | null;
  telegramUserFirstName: string | null;
  replyToBot: boolean;
  mentionUsernames: string[];
};

type AnyObj = Record<string, unknown>;

const INACTIVE_CHAT_MEMBER_STATUSES = new Set(["left", "kicked"]);

function asObj(v: unknown): AnyObj | null {
  return v && typeof v === "object" ? (v as AnyObj) : null;
}

function pickChatFromMessageLike(msg: AnyObj | null): AnyObj | null {
  if (!msg) return null;
  const chat = asObj(msg.chat);
  return chat;
}

function userId(user: AnyObj): number | null {
  const id = user.id;
  if (typeof id === "number" && Number.isFinite(id)) return id;
  if (typeof id === "string") {
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Match Telegram bot user to our deployment (optional TELEGRAM_BOT_USER_ID). */
export function isOurBotUser(user: AnyObj): boolean {
  const envId = process.env.TELEGRAM_BOT_USER_ID?.trim();
  const id = userId(user);
  if (envId && id !== null) {
    return Number(envId) === id;
  }
  return user.is_bot === true;
}

/** Returns null if this membership row is not about our bot or status is unknown. */
export function isActiveFromChatMember(newMember: AnyObj | null): boolean | null {
  if (!newMember) return null;
  const user = asObj(newMember.user);
  const status = typeof newMember.status === "string" ? newMember.status : null;
  if (!user || !status) return null;
  if (!isOurBotUser(user)) return null;
  return !INACTIVE_CHAT_MEMBER_STATUSES.has(status);
}

function normalizeChat(chat: AnyObj, lastSeenAt: Date): Omit<NormalizedChat, "isActive"> | null {
  const id = chat.id;
  if (typeof id !== "number" && typeof id !== "string") return null;
  const telegramChatId = String(id);

  const title =
    typeof chat.title === "string"
      ? chat.title
      : typeof chat.username === "string"
        ? chat.username
        : typeof chat.first_name === "string"
          ? chat.first_name
          : undefined;

  const type = typeof chat.type === "string" ? chat.type : undefined;

  return {
    telegramChatId,
    title,
    type,
    lastSeenAt,
  };
}

function withActive(
  base: Omit<NormalizedChat, "isActive"> | null,
  isActive: boolean,
): NormalizedChat | null {
  if (!base) return null;
  return { ...base, isActive };
}

function fromMemberContainer(container: AnyObj, now: Date): NormalizedChat | null {
  const chat = asObj(container.chat);
  if (!chat) return null;
  const base = normalizeChat(chat, now);
  if (!base) return null;
  const newMember = asObj(container.new_chat_member);
  const active = isActiveFromChatMember(newMember);
  return withActive(base, active ?? true);
}

export function normalizeUpdateToChat(update: TelegramUpdate): NormalizedChat | null {
  const u = asObj(update);
  if (!u) return null;

  const now = new Date();

  const message =
    asObj(u.message) ??
    asObj(u.edited_message) ??
    asObj(u.channel_post) ??
    asObj(u.edited_channel_post);

  const chatFromMessage = pickChatFromMessageLike(message);
  if (chatFromMessage) {
    return withActive(normalizeChat(chatFromMessage, now), true);
  }

  const myChatMember = asObj(u.my_chat_member);
  if (myChatMember) {
    const n = fromMemberContainer(myChatMember, now);
    if (n) return n;
  }

  const chatMember = asObj(u.chat_member);
  if (chatMember) {
    const n = fromMemberContainer(chatMember, now);
    if (n) return n;
  }

  return null;
}

function messageText(msg: AnyObj): string | null {
  const text = msg.text;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

function extractMentions(msg: AnyObj): string[] {
  const entities = msg.entities;
  const text = typeof msg.text === "string" ? msg.text : "";
  if (!Array.isArray(entities)) return [];
  const names: string[] = [];
  for (const ent of entities) {
    const e = asObj(ent);
    if (!e) continue;

    if (e.type === "mention") {
      const offset = typeof e.offset === "number" ? e.offset : null;
      const length = typeof e.length === "number" ? e.length : null;
      if (offset === null || length === null) continue;
      const mention = text.slice(offset, offset + length).replace(/^@/, "");
      if (mention) names.push(mention);
      continue;
    }

    if (e.type === "text_mention") {
      const user = asObj(e.user);
      const username =
        user && typeof user.username === "string" && user.username.trim()
          ? user.username.trim()
          : null;
      if (username) names.push(username);
      continue;
    }

    if (e.type === "bot_command") {
      const offset = typeof e.offset === "number" ? e.offset : null;
      const length = typeof e.length === "number" ? e.length : null;
      if (offset === null || length === null) continue;
      const command = text.slice(offset, offset + length);
      const atIndex = command.indexOf("@");
      if (atIndex >= 0) {
        const mention = command.slice(atIndex + 1);
        if (mention) names.push(mention);
      }
    }
  }
  return names;
}

function textContainsBotMention(text: string, botUsername: string): boolean {
  const escaped = botUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`@${escaped}(?:\\b|$)`, "i").test(text);
}

function isReplyToBot(msg: AnyObj): boolean {
  const reply = asObj(msg.reply_to_message);
  if (!reply) return false;
  const from = asObj(reply.from);
  if (!from) return false;
  return isOurBotUser(from);
}

export function normalizeIncomingMessage(update: TelegramUpdate): NormalizedIncomingMessage | null {
  const u = asObj(update);
  if (!u) return null;

  const updateId = u.update_id;
  if (typeof updateId !== "number") return null;

  const message = asObj(u.message);
  if (!message) return null;

  const text = messageText(message);
  if (!text) return null;

  const chat = asObj(message.chat);
  if (!chat) return null;

  const chatType = typeof chat.type === "string" ? chat.type : "private";
  const chatId = chat.id;
  if (typeof chatId !== "number" && typeof chatId !== "string") return null;

  const messageId = message.message_id;
  if (typeof messageId !== "number") return null;

  const from = asObj(message.from);
  const telegramUserId = from ? userId(from) : null;
  const telegramUsername =
    from && typeof from.username === "string" && from.username.trim()
      ? from.username.trim()
      : null;
  const telegramUserFirstName =
    from && typeof from.first_name === "string" && from.first_name.trim()
      ? from.first_name.trim()
      : null;

  return {
    updateId,
    telegramChatId: String(chatId),
    chatType,
    text,
    telegramMessageId: messageId,
    telegramUserId,
    telegramUsername,
    telegramUserFirstName,
    replyToBot: isReplyToBot(message),
    mentionUsernames: extractMentions(message),
  };
}

export function isAddressedToBot(
  msg: Pick<NormalizedIncomingMessage, "chatType" | "replyToBot" | "mentionUsernames" | "text">,
  botUsername: string | null,
): boolean {
  if (msg.chatType === "private") return true;
  if (msg.replyToBot) return true;
  if (!botUsername) return false;

  const lower = botUsername.toLowerCase().replace(/^@/, "");
  if (msg.mentionUsernames.some((m) => m.toLowerCase() === lower)) return true;

  return textContainsBotMention(msg.text, lower);
}

/** Remove @bot mention from message text before RAG (group mentions skew embeddings). */
export function stripBotMentionFromText(text: string, botUsername: string | null): string {
  let result = text.trim();
  if (botUsername) {
    const escaped = botUsername.replace(/^@/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(`@${escaped}\\b`, "gi"), "");
  }
  return result.replace(/\s+/g, " ").trim();
}

/** Telegram /start command (optionally with @botname or deep-link payload). */
export function isStartCommand(text: string): boolean {
  const first = text.trim().split(/\s+/)[0] ?? "";
  return /^\/start(?:@\w+)?$/i.test(first);
}

function normalizeIntentText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[!?.…,]+/g, "")
    .replace(/\s+/g, " ");
}

/** Meta-questions about bot capabilities (answered without RAG). */
export function isHelpIntent(text: string): boolean {
  const first = text.trim().split(/\s+/)[0] ?? "";
  if (/^\/help(?:@\w+)?$/i.test(first)) return true;

  const normalized = normalizeIntentText(text);
  if (!normalized) return false;

  const phrases = [
    "помощь",
    "help",
    "что ты умеешь",
    "чем ты можешь помочь",
    "что вы умеете",
    "чем вы можете помочь",
    "на какие вопросы ты можешь ответить",
    "на какие вопросы вы можете ответить",
    "какие вопросы ты можешь ответить",
    "какие вопросы вы можете ответить",
    "что ты можешь",
    "что вы можете",
  ];

  if (phrases.some((p) => normalized === p || normalized.startsWith(`${p} `))) {
    return true;
  }

  return (
    /^на какие вопросы (ты|вы) мож/.test(normalized) ||
    /^что (ты|вы) (умеешь|можешь|умеете|можете)/.test(normalized) ||
    /^чем (ты|вы) мож/.test(normalized)
  );
}
