import { describe, expect, it } from "vitest";
import { formatDocumentDate } from "./format-date";

describe("formatDocumentDate", () => {
  it("formats an ISO timestamp as a short human-readable date", () => {
    expect(formatDocumentDate("2026-09-11T12:00:00.000Z")).toBe(
      "Sep 11, 2026"
    );
  });

  it("formats a date-only ISO string", () => {
    expect(formatDocumentDate("2026-01-01T00:00:00.000Z")).toBe(
      "Jan 1, 2026"
    );
  });

  it("falls back to a plain label for an unparseable string", () => {
    expect(formatDocumentDate("not-a-date")).toBe("Unknown date");
  });

  it("falls back to a plain label for an empty string", () => {
    expect(formatDocumentDate("")).toBe("Unknown date");
  });
});
