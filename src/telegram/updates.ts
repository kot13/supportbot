export type TelegramUpdate = unknown;

export type NormalizedChat = {
  telegramChatId: string;
  title?: string;
  type?: string;
  lastSeenAt: Date;
};

type AnyObj = Record<string, unknown>;

function asObj(v: unknown): AnyObj | null {
  return v && typeof v === "object" ? (v as AnyObj) : null;
}

function pickChatFromMessageLike(msg: AnyObj | null): AnyObj | null {
  if (!msg) return null;
  const chat = asObj(msg.chat);
  return chat;
}

function normalizeChat(chat: AnyObj, lastSeenAt: Date): NormalizedChat | null {
  const id = chat.id;
  if (typeof id !== "number" && typeof id !== "string") return null;
  const telegramChatId = String(id);

  const title =
    typeof chat.title === "string"
      ? chat.title
      : typeof chat.username === "string"
        ? chat.username
        : undefined;

  const type = typeof chat.type === "string" ? chat.type : undefined;

  return {
    telegramChatId,
    title,
    type,
    lastSeenAt,
  };
}

export function normalizeUpdateToChat(update: TelegramUpdate): NormalizedChat | null {
  const u = asObj(update);
  if (!u) return null;

  const now = new Date();

  // message-like updates
  const message =
    asObj(u.message) ??
    asObj(u.edited_message) ??
    asObj(u.channel_post) ??
    asObj(u.edited_channel_post);

  const chatFromMessage = pickChatFromMessageLike(message);
  if (chatFromMessage) return normalizeChat(chatFromMessage, now);

  // membership updates (e.g. bot added/removed)
  const myChatMember = asObj(u.my_chat_member);
  if (myChatMember) {
    const chat = asObj(myChatMember.chat);
    if (chat) return normalizeChat(chat, now);
  }

  const chatMember = asObj(u.chat_member);
  if (chatMember) {
    const chat = asObj(chatMember.chat);
    if (chat) return normalizeChat(chat, now);
  }

  return null;
}

