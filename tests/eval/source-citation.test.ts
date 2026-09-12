// Eval 3: source-citation integrity, run as part of the eval suite's own
// reporting (a variant of this already exists in
// lib/analysis-engine/index.test.ts from ticket 02 — some overlap with that
// is expected and fine; this copy exists so the check is grouped with the
// rest of the labeled eval set here in tests/eval/, not buried in the unit
// test file).
//
// For every flag analyzeDocument returns against the full adhesion-contract
// fixture, assert flag.sourceSentence is an exact substring of the
// document's text. Checked mechanically for every single returned flag,
// not sampled.

import { describe, expect, it, vi } from "vitest";
import { analyzeDocument } from "../../lib/analysis-engine";
import {
  buildAnalyzeResponse,
  type SidecarEntry,
} from "../fixtures/build-stub-responses";
import adhesionSidecarJson from "../fixtures/adhesion-contract.sidecar.json";
import {
  adhesionText,
  allRedLines,
  fakeOpenRouterResponse,
} from "./support";

const adhesionSidecar = adhesionSidecarJson as SidecarEntry[];

// Fetched once at module-collection time (top-level await), mocked exactly
// like the other eval files, so it.each below can report one test per
// returned flag instead of one aggregate assertion.
vi.stubEnv("OPENROUTER_API_KEY", "test-api-key");
vi.stubEnv("OPENROUTER_MODEL", "test-model");
vi.stubGlobal(
  "fetch",
  vi
    .fn()
    .mockResolvedValue(
      fakeOpenRouterResponse(
        buildAnalyzeResponse(adhesionSidecar, "eval summary")
      )
    )
);

const analyzeResult = await analyzeDocument(adhesionText, allRedLines);

vi.unstubAllEnvs();
vi.unstubAllGlobals();

describe("source-citation integrity (full eval set)", () => {
  it("returned at least one flag to check (guards against this test vacuously passing)", () => {
    expect(analyzeResult.flags.length).toBeGreaterThan(0);
  });

  it.each(analyzeResult.flags.map((flag) => [flag.category, flag] as const))(
    "flag for category %s cites an exact substring of the document text",
    (category, flag) => {
      expect(
        adhesionText.includes(flag.sourceSentence),
        `Flag for category "${category}" has a sourceSentence that is not an exact substring of the document text: "${flag.sourceSentence}"`
      ).toBe(true);
    }
  );
});
