import { describe, expect, it } from "vitest";
import { needsSeeding } from "./get-or-seed-red-lines";

// getOrSeedRedLines itself talks to a real Supabase client and isn't
// exercised here — see BUILD-REPORT.md / this ticket's final report for
// why that requires a live project this environment doesn't have. This
// covers the one pure decision pulled out of it.
describe("needsSeeding", () => {
  it("is true for a brand-new user with zero rows", () => {
    expect(needsSeeding(0)).toBe(true);
  });

  it("is false once a user has any rows at all", () => {
    expect(needsSeeding(1)).toBe(false);
  });

  it("is false for a user with the full starter set", () => {
    expect(needsSeeding(7)).toBe(false);
  });

  it("is false for a user who has since deleted down to a smaller list", () => {
    expect(needsSeeding(2)).toBe(false);
  });
});
