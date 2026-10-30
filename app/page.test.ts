import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// app/page.tsx can only export the page itself, so its sample data and copy
// are checked as source text.
const landingSource = readFileSync(
  join(process.cwd(), "app", "page.tsx"),
  "utf-8"
);

describe("landing page claims", () => {
  it("makes no unsourced claim about what most people do", () => {
    expect(landingSource).not.toMatch(/most people/i);
  });

  it("cites only a section the sample document shows", () => {
    expect(landingSource).toContain("4. Term and Termination");
    expect(landingSource).not.toContain("Section 4.2");
  });

  it("doesn't put a fixed subject in front of every sample clause", () => {
    expect(landingSource).not.toContain('This Agreement{" "}');
  });

  it("names terms of service in the opening line", () => {
    const opening = landingSource.slice(landingSource.indexOf("<h1>"));
    const firstParagraph = opening.slice(0, opening.indexOf("</p>"));
    expect(firstParagraph.replace(/\s+/g, " ")).toMatch(/terms of service/i);
  });
});
