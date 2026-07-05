const REASON_LABELS: Record<string, string> = {
  no_context: "Нет контекста в документации",
  no_knowledge_index: "База знаний не проиндексирована",
  openai_error: "Ошибка OpenAI",
  not_configured: "OpenAI не настроен",
};

export function formatUnansweredReason(reason: string): string {
  return REASON_LABELS[reason] ?? reason;
}
