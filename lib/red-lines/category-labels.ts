// Display labels for the 11 canonical red-line category keys, verbatim from
// .scratch/redline-v1/red-line-categories.md. Keys are what code/fixtures
// use; these labels are what a user sees.

export const CATEGORY_LABELS: Record<string, string> = {
  arbitration: "Arbitration / class-action waiver",
  auto_renewal: "Auto-renewal",
  personal_guarantee: "Personal guarantee",
  scope_creep: "Scope creep / unlimited revisions",
  non_compete: "Non-compete",
  ip_assignment: "IP assignment ambiguity",
  indemnification: "Indemnification",
  liability_cap: "Liability cap",
  fee_escalator: "Fee / rent escalator",
  early_termination: "Early termination penalty",
  data_privacy: "Data/privacy rights grab",
};

/** The 11 canonical red-line category keys, in the order defined above.
 * Used to validate a custom red line's category (ticket 04) against the
 * fixed list in .scratch/redline-v1/red-line-categories.md. */
export const CANONICAL_CATEGORY_KEYS = Object.keys(CATEGORY_LABELS);

/** The display label for a category key, falling back to a humanized
 * version of the key itself for a category outside the canonical 11 (should
 * not normally happen, since the model is only ever given known keys). */
export function getCategoryLabel(category: string): string {
  return (
    CATEGORY_LABELS[category] ??
    category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}
