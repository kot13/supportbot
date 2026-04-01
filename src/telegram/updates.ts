export type TelegramUpdate = unknown;

export type NormalizedChat = {
  telegramChatId: string;
  title?: string;
  type?: string;
  lastSeenAt: Date;
  /** When false, bot is not an active member (e.g. left/kicked). */
  isActive: boolean;
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
