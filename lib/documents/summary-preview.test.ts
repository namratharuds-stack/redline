import { describe, expect, it } from "vitest";
import { getSummaryPreview } from "./summary-preview";

describe("getSummaryPreview", () => {
  it("returns a short summary unchanged", () => {
    expect(getSummaryPreview("A short summary.")).toBe("A short summary.");
  });

  it("takes only the first line of a multi-line summary", () => {
    expect(getSummaryPreview("First line.\nSecond line.")).toBe(
      "First line."
    );
  });

  it("trims surrounding whitespace", () => {
    expect(getSummaryPreview("  Padded summary.  ")).toBe("Padded summary.");
  });

  it("truncates a long summary with an ellipsis, respecting maxLength", () => {
    const long = "a".repeat(200);
    const preview = getSummaryPreview(long, 50);
    expect(preview.length).toBe(50);
    expect(preview.endsWith("…")).toBe(true);
    expect(preview.slice(0, -1)).toBe("a".repeat(49));
  });

  it("does not truncate a summary exactly at maxLength", () => {
    const exact = "a".repeat(50);
    expect(getSummaryPreview(exact, 50)).toBe(exact);
  });
});
