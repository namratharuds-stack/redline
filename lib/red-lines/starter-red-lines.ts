// The 7 starter red lines a new user's list is pre-populated with, per
// .scratch/redline-v1/red-line-categories.md. Ticket 04 persists a per-user
// version of this same list; this ticket (03) uses it directly, hardcoded,
// with no editing or persistence yet.

import type { RedLine } from "@/lib/analysis-engine/types";

export const STARTER_RED_LINES: RedLine[] = [
  {
    id: "scope_creep",
    category: "scope_creep",
    description:
      "Flag vague scope language that could let the other party demand unlimited extra work or withhold payment.",
  },
  {
    id: "ip_assignment",
    category: "ip_assignment",
    description:
      "Flag unclear or missing transfer of ownership of work I create.",
  },
  {
    id: "non_compete",
    category: "non_compete",
    description:
      "Flag restrictions on taking a new job or starting a competing business.",
  },
  {
    id: "indemnification",
    category: "indemnification",
    description:
      "Flag clauses making me responsible for funding the other party's legal defense.",
  },
  {
    id: "personal_guarantee",
    category: "personal_guarantee",
    description:
      "Flag clauses making me personally liable if the business/entity defaults.",
  },
  {
    id: "auto_renewal",
    category: "auto_renewal",
    description: "Flag automatic renewal or hard-to-cancel terms.",
  },
  {
    id: "arbitration",
    category: "arbitration",
    description:
      "Flag clauses forcing disputes into individual arbitration or waiving class actions.",
  },
];
