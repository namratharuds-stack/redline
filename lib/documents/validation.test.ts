import { describe, expect, it } from "vitest";
import { isKnownDocumentType } from "./validation";

describe("isKnownDocumentType", () => {
  it("accepts every one of the 4 canonical document types", () => {
    const canonicalTypes = ["contract", "lease", "freelance_agreement", "tos"];
    for (const type of canonicalTypes) {
      expect(isKnownDocumentType(type)).toBe(true);
    }
  });

  it("rejects a made-up document type", () => {
    expect(isKnownDocumentType("nda")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isKnownDocumentType("")).toBe(false);
  });

  it("is case-sensitive, rejecting a differently-cased match", () => {
    expect(isKnownDocumentType("Contract")).toBe(false);
  });
});
