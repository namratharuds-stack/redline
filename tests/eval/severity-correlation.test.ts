// Eval 5: severity-correlation benchmark.
//
// *** IMPORTANT CAVEAT — READ BEFORE TRUSTING THIS CHECK ***
// The spec calls for "a benchmark set of documents whose clauses a human
// reviewer has ranked by severity." No live human reviewer is available in
// this unattended build/eval run. As a stand-in, this test uses
// `adhesion-contract.sidecar.json`'s `expectedSeverityBand` values, which
// were written by the agent that authored the fixture during ticket-09
// fixture-building — they are a plausible severity ordering, not an actual
// legal/human expert review. Treat a pass here as "the plumbing that
// carries severity from the model response through to the returned flags
// works and preserves ordering," NOT as validated evidence that the
// Analysis Engine's real, live severity judgments match what a human
// lawyer or affected user would rank. Before relying on this check as real
// evidence of severity quality, replace the sidecar's bands with an actual
// human-ranked benchmark.
//
// Mechanics: map severities to low=1/medium=2/high=3, mock
// `analyzeDocument` against the sidecar-derived stub (same fixture/stub as
// the detection-rate eval), and compute a hand-rolled Spearman rank
// correlation between the sidecar's expectedSeverityBand values and the
// severities analyzeDocument actually returns for the matching categories.
// No stats library dependency — Spearman over ~11 points is straightforward
// to hand-roll (rank both series with tie-averaging, then Pearson-correlate
// the ranks).

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeDocument } from "../../lib/analysis-engine";
import type { Severity } from "../../lib/analysis-engine/types";
import {
  buildAnalyzeResponse,
  type SidecarEntry,
} from "../fixtures/build-stub-responses";
import adhesionSidecarJson from "../fixtures/adhesion-contract.sidecar.json";
import {
  adhesionText,
  allRedLines,
  mockFetchReturning,
  stubModelEnv,
} from "./support";

const adhesionSidecar = adhesionSidecarJson as SidecarEntry[];

const SEVERITY_RANK: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/** Ranks values 1..n, averaging ranks across ties (standard Spearman tie handling). */
function rank(values: number[]): number[] {
  const order = values
    .map((value, index) => ({ value, index }))
    .sort((a, b) => a.value - b.value);

  const ranks = new Array(values.length).fill(0);
  let i = 0;
  while (i < order.length) {
    let j = i;
    while (j + 1 < order.length && order[j + 1].value === order[i].value) {
      j++;
    }
    const averageRank = (i + j) / 2 + 1; // ranks are 1-based
    for (let k = i; k <= j; k++) {
      ranks[order[k].index] = averageRank;
    }
    i = j + 1;
  }
  return ranks;
}

function pearson(x: number[], y: number[]): number {
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  if (denomX === 0 || denomY === 0) {
    // No variance in one of the series (e.g. every severity identical) —
    // correlation is undefined; treat as 0 rather than NaN/divide-by-zero.
    return 0;
  }

  return numerator / Math.sqrt(denomX * denomY);
}

export function spearmanCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) {
    throw new Error(
      "spearmanCorrelation requires two equal-length arrays of at least 2 points."
    );
  }
  return pearson(rank(x), rank(y));
}

describe("severity-correlation benchmark (sidecar stand-in for a human ranking — see file header)", () => {
  beforeEach(() => {
    stubModelEnv();
    mockFetchReturning(buildAnalyzeResponse(adhesionSidecar, "eval summary"));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("hand-rolled Spearman correlation is 1.0 for a perfectly matched series (sanity check on the math itself)", () => {
    expect(spearmanCorrelation([1, 2, 3, 4], [1, 2, 3, 4])).toBeCloseTo(1, 10);
    expect(spearmanCorrelation([1, 2, 3, 4], [4, 3, 2, 1])).toBeCloseTo(
      -1,
      10
    );
  });

  it("engine's returned severities correlate positively with the sidecar's benchmark bands", async () => {
    const result = await analyzeDocument(adhesionText, allRedLines);

    const expectedRanks: number[] = [];
    const actualRanks: number[] = [];
    const missingCategories: string[] = [];

    for (const entry of adhesionSidecar) {
      const flag = result.flags.find((f) => f.category === entry.category);
      if (!flag) {
        missingCategories.push(entry.category);
        continue;
      }
      expectedRanks.push(SEVERITY_RANK[entry.expectedSeverityBand]);
      actualRanks.push(SEVERITY_RANK[flag.severity]);
    }

    expect(
      missingCategories,
      `Cannot compute severity correlation: these categories from the sidecar had no matching returned flag: ${missingCategories.join(", ")}`
    ).toEqual([]);

    const correlation = spearmanCorrelation(expectedRanks, actualRanks);

    // eslint-disable-next-line no-console
    console.log(
      `[eval:severity-correlation] Spearman rank correlation between sidecar benchmark bands and analyzeDocument's returned severities: ${correlation.toFixed(4)} (n=${expectedRanks.length})`
    );

    // Threshold chosen to genuinely fail on an inverted or randomized
    // severity ordering while tolerating the coarse 3-band scale's ties;
    // with only 11 points this is not a statistically rigorous bar, just
    // one that catches a badly broken correlation.
    expect(correlation).toBeGreaterThan(0.3);
  });
});
