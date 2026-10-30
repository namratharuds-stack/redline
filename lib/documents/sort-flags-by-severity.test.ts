import { describe, expect, it } from "vitest";
import type { Flag, Severity } from "@/lib/analysis-engine/types";
import { sortFlagsBySeverity } from "./sort-flags-by-severity";

function flag(category: string, severity: Severity): Flag {
  return {
    category,
    severity,
    sourceSentence: `${category} sentence`,
    explanation: "explanation",
    counterOffer: "counter-offer",
  };
}

describe("sortFlagsBySeverity", () => {
  it("puts high before medium before low", () => {
    const sorted = sortFlagsBySeverity([
      flag("scope_creep", "medium"),
      flag("arbitration", "low"),
      flag("non_compete", "high"),
    ]);

    expect(sorted.map((f) => f.severity)).toEqual(["high", "medium", "low"]);
  });

  it("keeps the original order within a severity", () => {
    const sorted = sortFlagsBySeverity([
      flag("scope_creep", "high"),
      flag("ip_assignment", "medium"),
      flag("indemnification", "high"),
      flag("auto_renewal", "medium"),
    ]);

    expect(sorted.map((f) => f.category)).toEqual([
      "scope_creep",
      "indemnification",
      "ip_assignment",
      "auto_renewal",
    ]);
  });

  it("doesn't change the list it was given", () => {
    const flags = [flag("scope_creep", "low"), flag("non_compete", "high")];

    sortFlagsBySeverity(flags);

    expect(flags.map((f) => f.severity)).toEqual(["low", "high"]);
  });
});
