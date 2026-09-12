// Shared plumbing for the eval suite (tickets 09). Not a test file itself —
// the individual tests/eval/*.test.ts files import from here so the
// fetch-mocking pattern and fixture loading stay in one place and in sync
// with lib/analysis-engine/index.test.ts's own pattern.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { vi } from "vitest";
import type { RedLine } from "../../lib/analysis-engine/types";

export const FIXTURES_DIR = join(process.cwd(), "tests", "fixtures");

export const adhesionText = readFileSync(
  join(FIXTURES_DIR, "adhesion-contract.txt"),
  "utf-8"
);

export const cleanText = readFileSync(
  join(FIXTURES_DIR, "clean-agreement.txt"),
  "utf-8"
);

// Canonical list from .scratch/redline-v1/red-line-categories.md — keep in
// sync with that doc, not with whatever the model happens to return.
export const ALL_CATEGORY_KEYS = [
  "arbitration",
  "auto_renewal",
  "personal_guarantee",
  "scope_creep",
  "non_compete",
  "ip_assignment",
  "indemnification",
  "liability_cap",
  "fee_escalator",
  "early_termination",
  "data_privacy",
] as const;

export type CategoryKey = (typeof ALL_CATEGORY_KEYS)[number];

export const allRedLines: RedLine[] = ALL_CATEGORY_KEYS.map(
  (category, index) => ({
    id: `rl-${index}`,
    category,
    description: `Flag anything matching the ${category} category.`,
  })
);

/** Builds a fake OpenRouter chat-completions response body carrying `content`. */
export function fakeOpenRouterResponse(content: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content: JSON.stringify(content) } }],
    }),
    text: async () => "",
  };
}

/** Stubs global fetch to resolve with `content` as the model's JSON body. */
export function mockFetchReturning(content: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(fakeOpenRouterResponse(content));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function stubModelEnv() {
  vi.stubEnv("OPENROUTER_API_KEY", "test-api-key");
  vi.stubEnv("OPENROUTER_MODEL", "test-model");
}
