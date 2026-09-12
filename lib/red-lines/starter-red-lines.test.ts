import { describe, expect, it } from "vitest";
import { STARTER_RED_LINES } from "./starter-red-lines";

const EXPECTED_CATEGORY_KEYS = [
  "scope_creep",
  "ip_assignment",
  "non_compete",
  "indemnification",
  "personal_guarantee",
  "auto_renewal",
  "arbitration",
];

describe("STARTER_RED_LINES", () => {
  it("has exactly the 7 canonical starter category keys, order-independent", () => {
    expect(STARTER_RED_LINES).toHaveLength(7);

    const actualCategories = STARTER_RED_LINES.map((rl) => rl.category).sort();
    expect(actualCategories).toEqual([...EXPECTED_CATEGORY_KEYS].sort());
  });

  it("has no duplicate category keys", () => {
    const categories = STARTER_RED_LINES.map((rl) => rl.category);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it("gives every red line a non-empty id and description", () => {
    for (const redLine of STARTER_RED_LINES) {
      expect(redLine.id.length).toBeGreaterThan(0);
      expect(redLine.description.length).toBeGreaterThan(0);
    }
  });
});
