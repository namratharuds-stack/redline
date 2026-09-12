// npm run smoke — runs a real fixture document through the real Analysis
// Engine pipeline end to end (analyzeDocument + answerQuestion), the same
// module the app's /home/analyze and /api/answer routes call. Prints every
// returned flag with its source sentence so a human can eyeball the output.
//
// Requires OPENROUTER_API_KEY and OPENROUTER_MODEL to make a real model
// call — if either is missing, this prints a clear message and exits
// successfully rather than failing the build (see BUILD-REPORT.md: the app
// must work without these for everything except the actual analysis call).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { analyzeDocument, answerQuestion } from "../lib/analysis-engine";
import { CATEGORY_LABELS } from "../lib/red-lines/category-labels";
import type { RedLine } from "../lib/analysis-engine/types";

const FIXTURE_PATH = join(
  process.cwd(),
  "tests/fixtures/adhesion-contract.txt"
);

const ALL_CATEGORY_RED_LINES: RedLine[] = Object.entries(CATEGORY_LABELS).map(
  ([category, label]) => ({
    id: category,
    category,
    description: `Flag clauses matching: ${label}.`,
  })
);

async function main() {
  if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_MODEL) {
    console.log(
      "[smoke] OPENROUTER_API_KEY and/or OPENROUTER_MODEL are not set in " +
        "this environment, so the real Analysis Engine pipeline cannot be " +
        "exercised against a live model. Skipping — this is expected until " +
        "a real OpenRouter key is configured. Set both env vars and re-run " +
        "`npm run smoke` to see real output."
    );
    process.exit(0);
  }

  const documentText = readFileSync(FIXTURE_PATH, "utf8");

  console.log(
    `[smoke] Running the real analyzeDocument against ${FIXTURE_PATH} ` +
      `(${documentText.length} chars) with all ${ALL_CATEGORY_RED_LINES.length} red-line categories...`
  );

  const result = await analyzeDocument(documentText, ALL_CATEGORY_RED_LINES);

  console.log("\n=== Summary ===");
  console.log(result.summary);

  console.log(`\n=== Flags (${result.flags.length}) ===`);
  let verifiedCount = 0;
  for (const flag of result.flags) {
    const isExactSubstring = documentText.includes(flag.sourceSentence);
    if (isExactSubstring) verifiedCount++;

    console.log(
      `\n[${flag.severity.toUpperCase()}] ${flag.category}${isExactSubstring ? "" : "  *** NOT AN EXACT SUBSTRING — SHOULD NEVER HAPPEN, ENGINE BUG ***"}`
    );
    console.log(`  Source: "${flag.sourceSentence}"`);
    console.log(`  Why: ${flag.explanation}`);
    console.log(`  Counter-offer: ${flag.counterOffer}`);
  }

  console.log(
    `\n[smoke] ${verifiedCount}/${result.flags.length} returned flags verified as exact substrings of the document text.`
  );
  console.log(
    `[smoke] Categories flagged: ${result.flags.length} of ${ALL_CATEGORY_RED_LINES.length} red lines given.`
  );

  console.log("\n=== Q&A sample ===");
  const question = "How much notice do I need to give to not renew this agreement?";
  const answer = await answerQuestion(documentText, question);
  console.log(`Q: ${question}`);
  console.log(`A: ${answer}`);
}

main().catch((error) => {
  console.error("[smoke] failed:", error);
  process.exit(1);
});
