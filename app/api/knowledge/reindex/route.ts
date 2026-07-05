import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { hasRunningIndexRun } from "@/src/db/knowledgeIndexRuns";
import { logger } from "@/src/observability/logger";
import { indexKnowledge } from "@/src/rag/indexKnowledge";

export async function POST() {
  await requireAuth();

  if (await hasRunningIndexRun()) {
    return NextResponse.json(
      { ok: false, error: { code: "CONFLICT", message: "Reindex already in progress" } },
      { status: 409 },
    );
  }

  void indexKnowledge().then((result) => {
    if (!result.ok) {
      logger.warn("knowledge_reindex_failed", { error: result.error });
    }
  });

  return NextResponse.json(
    { ok: true, data: { status: "running" as const } },
    { status: 202 },
  );
}
