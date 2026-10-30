import type { Flag, Severity } from "@/lib/analysis-engine/types";

const SEVERITY_RANK: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/** Returns `flags` most severe first, in a new array. Flags of the same
 * severity keep their order. */
export function sortFlagsBySeverity(flags: Flag[]): Flag[] {
  return [...flags].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
  );
}
