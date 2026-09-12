import { describe, expect, it } from "vitest";
import { isValidPersona, PERSONA_OPTIONS } from "./persona";

describe("isValidPersona", () => {
  it("accepts every canonical option value", () => {
    for (const option of PERSONA_OPTIONS) {
      expect(isValidPersona(option.value)).toBe(true);
    }
  });

  it("rejects an empty string", () => {
    expect(isValidPersona("")).toBe(false);
  });

  it("rejects an unrecognized value", () => {
    expect(isValidPersona("astronaut")).toBe(false);
  });

  it("rejects a value that only partially matches an option (case/whitespace)", () => {
    expect(isValidPersona("Freelancer")).toBe(false);
    expect(isValidPersona("freelancer ")).toBe(false);
  });

  it("rejects a label being sent instead of a value", () => {
    // Guards against a future UI change accidentally sending the display
    // label (e.g. "Small business owner") instead of the stored key.
    expect(isValidPersona("Small business owner")).toBe(false);
  });
});
