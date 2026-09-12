import { describe, expect, it } from "vitest";
import {
  getFileExtension,
  hasMeaningfulText,
  isSupportedExtension,
} from "./parse-document";

describe("getFileExtension", () => {
  it("returns the lowercased extension", () => {
    expect(getFileExtension("lease.PDF")).toBe("pdf");
    expect(getFileExtension("agreement.txt")).toBe("txt");
  });

  it("uses the last extension for a multi-dot filename", () => {
    expect(getFileExtension("my.contract.final.docx")).toBe("docx");
  });

  it("returns an empty string when there is no extension", () => {
    expect(getFileExtension("README")).toBe("");
  });
});

describe("isSupportedExtension", () => {
  it("accepts .txt files", () => {
    expect(isSupportedExtension("freelance-agreement.txt")).toBe(true);
  });

  it("accepts .pdf files", () => {
    expect(isSupportedExtension("lease.pdf")).toBe(true);
  });

  it("accepts uppercase extensions", () => {
    expect(isSupportedExtension("LEASE.PDF")).toBe(true);
  });

  it("rejects a docx file", () => {
    expect(isSupportedExtension("contract.docx")).toBe(false);
  });

  it("rejects an image file", () => {
    expect(isSupportedExtension("scan-of-lease.png")).toBe(false);
  });

  it("rejects a file with no extension", () => {
    expect(isSupportedExtension("contract")).toBe(false);
  });
});

describe("hasMeaningfulText", () => {
  it("rejects an empty string", () => {
    expect(hasMeaningfulText("")).toBe(false);
  });

  it("rejects whitespace-only text", () => {
    expect(hasMeaningfulText("   \n\n   \t  ")).toBe(false);
  });

  it("rejects text shorter than the meaningful-content threshold", () => {
    expect(hasMeaningfulText("too short")).toBe(false);
  });

  it("accepts real document text", () => {
    expect(
      hasMeaningfulText(
        "This Freelance Agreement is entered into between the parties below."
      )
    ).toBe(true);
  });
});
