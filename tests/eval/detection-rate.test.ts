// Eval 1: per-category detection rate.
//
// Runs the full adhesion-contract fixture (which plants one clause per
// category) through the real `analyzeDocument`, with the model call mocked
// to return the true stub derived from the fixture's sidecar. Asserts each
// of the 11 canonical categories is present in the returned flags.
//
// Structured as it.each over the 11 categories (rather than a single
// `expect(flags).toHaveLength(11)`-style assertion) so that if one
// category's detection breaks, the test output names that exact category
// instead of just reporting "expected 11, got 10".

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeDocument } from "../../lib/analysis-engine";
import {
  buildAnalyzeResponse,
  type SidecarEntry,
} from "../fixtures/build-stub-responses";
import adhesionSidecarJson from "../fixtures/adhesion-contract.sidecar.json";
import {
  ALL_CATEGORY_KEYS,
  adhesionText,
  allRedLines,
  mockFetchReturning,
  stubModelEnv,
} from "./support";

const adhesionSidecar = adhesionSidecarJson as SidecarEntry[];

describe("per-category detection rate", () => {
  let flaggedCategories: string[];

  beforeEach(async () => {
    stubModelEnv();
    mockFetchReturning(
      buildAnalyzeResponse(adhesionSidecar, "eval summary")
    );

    const result = await analyzeDocument(adhesionText, allRedLines);
    flaggedCategories = result.flags.map((f) => f.category);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it.each(ALL_CATEGORY_KEYS)(
    "detects at least one flag for category %s",
    (category) => {
      expect(
        flaggedCategories,
        `Expected category "${category}" to appear at least once among the returned flags, but it did not. Flagged categories were: [${flaggedCategories.join(", ")}]`
      ).toContain(category);
    }
  );

  it("sanity check: the fixture's sidecar itself covers all 11 categories (guards against a stale fixture silently shrinking this eval)", () => {
    const sidecarCategories = adhesionSidecar.map((e) => e.category).sort();
    expect(sidecarCategories).toEqual([...ALL_CATEGORY_KEYS].sort());
  });
});
