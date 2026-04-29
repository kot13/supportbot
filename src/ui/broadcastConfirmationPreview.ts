/** Preview text for broadcast confirmation modal (spec 007). */

const DEFAULT_MAX_CHARS = 600;

export type TruncateBroadcastBodyResult = {
  preview: string;
  truncated: boolean;
  totalChars: number;
};

export function truncateBroadcastBody(
  text: string,
  maxChars: number = DEFAULT_MAX_CHARS,
): TruncateBroadcastBodyResult {
  const totalChars = text.length;
  if (totalChars <= maxChars) {
    return { preview: text, truncated: false, totalChars };
  }
  return {
    preview: text.slice(0, maxChars),
    truncated: true,
    totalChars,
  };
}
