import { describe, expect, it } from "vitest";
import { isSubmittableQuestion } from "./validation";

describe("isSubmittableQuestion", () => {
  it("accepts an ordinary question", () => {
    expect(isSubmittableQuestion("Can I terminate early?")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isSubmittableQuestion("")).toBe(false);
  });

  it("rejects a whitespace-only string", () => {
    expect(isSubmittableQuestion("   \n\t  ")).toBe(false);
  });

  it("accepts text with leading/trailing whitespace around real content", () => {
    expect(isSubmittableQuestion("  What is the notice period?  ")).toBe(true);
  });
});
