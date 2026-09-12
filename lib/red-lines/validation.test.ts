import { describe, expect, it } from "vitest";
import {
  isKnownCategory,
  isNonEmptyDescription,
  validateRedLineInput,
} from "./validation";

describe("isNonEmptyDescription", () => {
  it("accepts ordinary text", () => {
    expect(isNonEmptyDescription("Flag anything unusual.")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isNonEmptyDescription("")).toBe(false);
  });

  it("rejects a whitespace-only string", () => {
    expect(isNonEmptyDescription("   \n\t  ")).toBe(false);
  });
});

describe("isKnownCategory", () => {
  it("accepts every one of the 11 canonical category keys", () => {
    const canonicalKeys = [
      "arbitration",
      "auto_renewal",
      "personal_guarantee",
      "scope_creep",
      "non_compete",
      "ip_assignment",
      "indemnification",
      "liability_cap",
      "fee_escalator",
      "early_termination",
      "data_privacy",
    ];
    for (const key of canonicalKeys) {
      expect(isKnownCategory(key)).toBe(true);
    }
  });

  it("rejects a made-up category", () => {
    expect(isKnownCategory("made_up_category")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isKnownCategory("")).toBe(false);
  });
});

describe("validateRedLineInput", () => {
  it("accepts a known category with a real description", () => {
    expect(
      validateRedLineInput({
        category: "scope_creep",
        description: "Flag vague scope language.",
      })
    ).toEqual({ valid: true });
  });

  it("rejects an unknown category before checking the description", () => {
    const result = validateRedLineInput({
      category: "not_a_real_category",
      description: "Flag vague scope language.",
    });
    expect(result.valid).toBe(false);
  });

  it("rejects an empty description on an otherwise-valid category", () => {
    const result = validateRedLineInput({
      category: "scope_creep",
      description: "   ",
    });
    expect(result.valid).toBe(false);
  });
});
