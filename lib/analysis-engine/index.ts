// The Analysis Engine: the single seam for this product's AI behavior.
// Exposes exactly two entry points, analyzeDocument and answerQuestion.
// Both call through the isolated model-call boundary in model-client.ts —
// nothing else in this file touches `fetch` or reads OPENROUTER_* env vars.

import { callModel } from "./model-client";
import {
  analyzeModelResponseSchema,
  answerModelResponseSchema,
} from "./schemas";
import type { AnalyzeResult, Flag, RedLine } from "./types";

/**
 * Analyzes `documentText` against the user's `redLines`, returning a
 * plain-English summary and a list of risk flags.
 *
 * Per ADR-0001, a candidate flag is only included in the result if its
 * `sourceSentence` is an exact substring of `documentText`. Any candidate
 * that fails that check is dropped silently — never shown as a partial or
 * low-confidence flag, and never causes the whole call to throw.
 *
 * A response that fails zod validation entirely (missing/malformed
 * `summary`, or a flag missing a required field) is a harder failure and
 * throws.
 */
export async function analyzeDocument(
  documentText: string,
  redLines: RedLine[]
): Promise<AnalyzeResult> {
  const raw = await callModel([
    { role: "system", content: buildAnalyzeSystemPrompt() },
    { role: "user", content: buildAnalyzeUserPrompt(documentText, redLines) },
  ]);

  const parsed = analyzeModelResponseSchema.parse(raw);

  const flags: Flag[] = parsed.flags.filter((candidate) =>
    documentText.includes(candidate.sourceSentence)
  );

  return {
    summary: parsed.summary,
    flags,
  };
}

/**
 * Answers `question` using only `documentText`. The model is instructed to
 * explicitly say the document doesn't address the question rather than
 * guess, when the text doesn't support an answer.
 */
export async function answerQuestion(
  documentText: string,
  question: string
): Promise<string> {
  const raw = await callModel([
    { role: "system", content: buildAnswerSystemPrompt() },
    { role: "user", content: buildAnswerUserPrompt(documentText, question) },
  ]);

  const parsed = answerModelResponseSchema.parse(raw);

  return parsed.answer;
}

function buildAnalyzeSystemPrompt(): string {
  return [
    "You are a contract-review assistant. You will be given the full extracted",
    "text of a legal document and a list of the user's own \"red lines\" —",
    "categories of clauses they care about, each with a category key and a",
    "description of what they want flagged.",
    "",
    "Respond with a single JSON object and nothing else, matching exactly this",
    "shape:",
    "{",
    '  "summary": string,',
    '  "flags": [',
    "    {",
    '      "category": string,  // must be one of the category keys given to you',
    '      "severity": "low" | "medium" | "high",',
    '      "sourceSentence": string,',
    '      "explanation": string,',
    '      "counterOffer": string',
    "    }",
    "  ]",
    "}",
    "",
    "Rules you must follow:",
    "- Only produce a flag for a clause that matches one of the red-line",
    "  categories you were given. Do not invent categories.",
    "- \"sourceSentence\" MUST be copied verbatim, character-for-character, from",
    "  the document text you were given — an exact quoted sentence, not a",
    "  paraphrase or summary. A flag whose sourceSentence is not an exact",
    "  quote from the document will be discarded, so copy it exactly.",
    "- \"severity\" must be judged from that specific clause's actual wording in",
    "  this document (how aggressive, one-sided, or costly it is), not a fixed",
    "  default for its category — the same category can be low severity in one",
    "  document and high severity in another.",
    "- \"explanation\" must state only what \"sourceSentence\" (and the rest of the",
    "  document text) actually supports. Do not add claims the text doesn't make.",
    "- \"counterOffer\" must be specific alternative language for this exact",
    "  clause, not generic boilerplate.",
    "- \"summary\" must state only what the document's text supports.",
    "- If no clause in the document matches any given red line, return an empty",
    "  \"flags\" array — do not force or fabricate a flag.",
  ].join("\n");
}

function buildAnalyzeUserPrompt(
  documentText: string,
  redLines: RedLine[]
): string {
  const redLinesBlock = redLines
    .map((rl) => `- category: ${rl.category}\n  description: ${rl.description}`)
    .join("\n");

  return [
    "Red lines to check for:",
    redLinesBlock.length > 0 ? redLinesBlock : "(none provided)",
    "",
    "Document text:",
    "---",
    documentText,
    "---",
  ].join("\n");
}

function buildAnswerSystemPrompt(): string {
  return [
    "You are a contract Q&A assistant. You will be given the full extracted",
    "text of a legal document and a question about it.",
    "",
    "Respond with a single JSON object and nothing else, matching exactly this",
    'shape: { "answer": string }',
    "",
    "Rules you must follow:",
    "- Answer strictly and only from the document text you were given. Do not",
    "  use outside knowledge or guess at what a typical contract might say.",
    "- If the document's text does not address the question, your \"answer\"",
    "  must explicitly say the document does not address the question — do not",
    "  provide a best-effort guess presented as fact.",
  ].join("\n");
}

function buildAnswerUserPrompt(documentText: string, question: string): string {
  return [
    "Document text:",
    "---",
    documentText,
    "---",
    "",
    `Question: ${question}`,
  ].join("\n");
}

export type { AnalyzeResult, Flag, RedLine } from "./types";
