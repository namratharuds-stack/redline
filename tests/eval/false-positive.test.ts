// Eval 2: false-positive rate.
//
// Runs the clean-agreement fixture (no planted red-line clauses) through
// the real `analyzeDocument`, with the model call mocked to return the
// empty-flags stub, and asserts zero flags come back. This exercises
// analyzeDocument's own plumbing (it must not invent a flag on its own),
// not the mock — the mock content is exactly what the fixture's sidecar
// (`{ expectedFlags: [] }`) says the model should have produced.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeDocument } from "../../lib/analysis-engine";
import { buildAnalyzeResponse } from "../fixtures/build-stub-responses";
import cleanSidecar from "../fixtures/clean-agreement.sidecar.json";
import {
  allRedLines,
  cleanText,
  mockFetchReturning,
  stubModelEnv,
} from "./support";

describe("false-positive rate", () => {
  beforeEach(() => {
    stubModelEnv();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns zero flags for a document with no matching clauses", () => {
    expect(cleanSidecar).toEqual({ expectedFlags: [] });
  });

  it("returns zero flags for the clean-agreement fixture", async () => {
    mockFetchReturning(buildAnalyzeResponse([], "clean summary"));

    const result = await analyzeDocument(cleanText, allRedLines);

    expect(result.flags).toEqual([]);
    expect(result.flags).toHaveLength(0);
  });
});
