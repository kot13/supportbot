export type DraftTargetMode = "all" | "subset";

export type CanSaveDraftInput = {
  content: string;
  targetMode: DraftTargetMode;
  chatIds: number[];
};

export function canSaveDraft(input: CanSaveDraftInput): boolean {
  if (input.content.trim().length > 0) return true;
  if (input.targetMode === "all") return true;
  return input.chatIds.length > 0;
}
