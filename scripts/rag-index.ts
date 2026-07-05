import "dotenv/config";

import { indexKnowledge } from "@/src/rag/indexKnowledge";

async function main() {
  console.log("Starting knowledge index…");
  const result = await indexKnowledge();
  if (!result.ok) {
    console.error("Index failed:", result.error);
    process.exitCode = 1;
    return;
  }
  console.log(`Index complete. runId=${result.runId} chunks=${result.chunkCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
