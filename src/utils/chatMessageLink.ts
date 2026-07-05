export function chatMessageAnchorId(messageId: number): string {
  return `message-${messageId}`;
}

export function chatMessageHref(chatId: number, messageId: number): string {
  return `/chats/${chatId}#${chatMessageAnchorId(messageId)}`;
}
