// Eval 4: unsupported-claim check.
//
// The spec (Testing Decisions) says this "likely needs a judged (human- or
// LLM-reviewed) check rather than a pure string match, since claims can be
// unsupported without being novel substrings." Real judging requires a live
// call to a judge model via OpenRouter, which requires OPENROUTER_API_KEY
// and OPENROUTER_MODEL. Neither is set in this environment.
//
// This file therefore:
//   1. Implements the real judge call (judgeUnsupportedClaims below),
//      reusing the exact OpenRouter request contract from
//      lib/analysis-engine/model-client.ts's callModel (pinned provider,
//      no fallbacks, required params, low-effort reasoning, JSON object
//      response format) by calling callModel directly.
//   2. Runs it live — no fetch mock — end to end against the real
//      analyzeDocument/answerQuestion output for the adhesion-contract
//      fixture, gated behind it.skipIf(!process.env.OPENROUTER_API_KEY) so
//      it is a real, would-genuinely-fail check whenever a key is present,
//      and a visibly-skipped (never a silently-passed) test when it is not.
//
// Do NOT read a "skipped" result here as "unsupported-claim checking
// passed" — it means the check did not run at all in this environment.

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { analyzeDocument, answerQuestion } from "../../lib/analysis-engine";
import { callModel } from "../../lib/analysis-engine/model-client";
import type { AnalyzeResult } from "../../lib/analysis-engine/types";
import { allRedLines } from "./support";

const FIXTURES_DIR = join(process.cwd(), "tests", "fixtures");
const adhesionText = readFileSync(
  join(FIXTURES_DIR, "adhesion-contract.txt"),
  "utf-8"
);

export type JudgeResult = { unsupportedClaims: string[] };

/**
 * Asks a judge model whether every claim made in `claimsText` is
 * supported by `documentText`. Returns the claims (verbatim, in the
 * judge's own words) it identifies as unsupported — an empty array means
 * the judge found no unsupported claims.
 *
 * Reuses callModel (lib/analysis-engine/model-client.ts) so this goes
 * through the exact same OpenRouter request contract as the real Analysis
 * Engine — pinned provider, no fallbacks, required params, low-effort
 * reasoning, JSON object response format — rather than re-implementing a
 * parallel fetch call with its own, possibly drifting, request shape.
 */
export async function judgeUnsupportedClaims(
  documentText: string,
  claimsText: string
): Promise<JudgeResult> {
  const raw = await callModel([
    {
      role: "system",
      content: [
        "You are a strict fact-checking judge for an AI contract-review",
        "product. You will be given the full extracted text of a legal",
        "document, followed by a set of claims that product generated about",
        "that document (a summary, risk-flag explanations, counter-offers,",
        "and/or a Q&A answer).",
        "",
        'Respond with a single JSON object and nothing else: { "unsupportedClaims": string[] }.',
        "",
        "For each discrete claim in the generated text, decide whether the",
        "document's text actually supports it. A claim is UNSUPPORTED if it",
        "asserts something the document's text does not say, implies, or",
        "reasonably entail — including invented facts, invented numbers,",
        "invented parties, or generic contract-law claims not grounded in",
        "this specific document's wording. A counter-offer proposing new,",
        "different language is NOT an unsupported claim merely for proposing",
        "something the document doesn't currently say — judge counter-offers",
        "only on whether they misrepresent what the current document says.",
        "",
        'Return each unsupported claim as a short quoted string in "unsupportedClaims".',
        'If every claim is supported, return { "unsupportedClaims": [] }.',
      ].join("\n"),
    },
    {
      role: "user",
      content: [
        "Document text:",
        "---",
        documentText,
        "---",
        "",
        "Generated claims to check:",
        "---",
        claimsText,
        "---",
      ].join("\n"),
    },
  ]);

  if (
    typeof raw !== "object" ||
    raw === null ||
    !Array.isArray((raw as Record<string, unknown>).unsupportedClaims) ||
    !(raw as { unsupportedClaims: unknown[] }).unsupportedClaims.every(
      (c) => typeof c === "string"
    )
  ) {
    throw new Error(
      `Judge model response did not match { unsupportedClaims: string[] }. Got: ${JSON.stringify(raw)}`
    );
  }

  return raw as JudgeResult;
}

function formatClaimsForJudging(
  result: AnalyzeResult,
  qaQuestion: string,
  qaAnswer: string
): string {
  const flagsText = result.flags
    .map(
      (flag, i) =>
        `Flag ${i + 1} [${flag.category}, severity=${flag.severity}]\n` +
        `  sourceSentence: ${flag.sourceSentence}\n` +
        `  explanation: ${flag.explanation}\n` +
        `  counterOffer: ${flag.counterOffer}`
    )
    .join("\n\n");

  return [
    `Summary: ${result.summary}`,
    "",
    "Flags:",
    flagsText.length > 0 ? flagsText : "(none)",
    "",
    `Q&A question: ${qaQuestion}`,
    `Q&A answer: ${qaAnswer}`,
  ].join("\n");
}

const hasApiKey = Boolean(process.env.OPENROUTER_API_KEY);

if (!hasApiKey) {
  // eslint-disable-next-line no-console
  console.log(
    "[eval:unsupported-claims] SKIPPED — OPENROUTER_API_KEY is not set in " +
      "this environment, so the live LLM-judged unsupported-claim check " +
      "cannot run. This shows as a skipped test, not a pass: no claim " +
      "verification happened. Set OPENROUTER_API_KEY and OPENROUTER_MODEL " +
      "to actually run this check."
  );
}

describe("unsupported-claim check (live LLM judge)", () => {
  it.skipIf(!hasApiKey)(
    "summary, flag explanations, counter-offers, and a Q&A answer contain no claim absent from the document text",
    async () => {
      // Deliberately NOT mocking fetch: this is the one test in the eval
      // suite meant to make a real, live model call end to end, both to
      // produce real analysis output and to judge it.
      const result = await analyzeDocument(adhesionText, allRedLines);
      const qaQuestion =
        "What happens if I try to terminate this agreement early?";
      const qaAnswer = await answerQuestion(adhesionText, qaQuestion);

      const claimsText = formatClaimsForJudging(result, qaQuestion, qaAnswer);
      const judgment = await judgeUnsupportedClaims(adhesionText, claimsText);

      // eslint-disable-next-line no-console
      console.log(
        `[eval:unsupported-claims] Judge found ${judgment.unsupportedClaims.length} unsupported claim(s).`,
        judgment.unsupportedClaims
      );

      expect(
        judgment.unsupportedClaims,
        `Judge model flagged claim(s) not supported by the document text: ${JSON.stringify(judgment.unsupportedClaims)}`
      ).toEqual([]);
    },
    30_000
  );
});
