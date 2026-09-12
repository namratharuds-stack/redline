// Canonical shapes for the Analysis Engine, matching
// .scratch/redline-v1/red-line-categories.md verbatim. Every ticket that
// stores, tests, or displays a category/flag/redline must agree with these
// shapes — do not diverge without updating that doc.

export type Severity = "low" | "medium" | "high";

export type Flag = {
  category: string; // one of the 11 canonical red-line category keys
  severity: Severity;
  sourceSentence: string; // exact verbatim substring of the document's extracted text
  explanation: string; // plain-English, grounded only in sourceSentence/documentText
  counterOffer: string; // drafted alternative language for this specific clause
};

export type AnalyzeResult = {
  summary: string;
  flags: Flag[];
};

export type RedLine = {
  id: string;
  category: string;
  description: string;
};
