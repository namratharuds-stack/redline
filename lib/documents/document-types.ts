// Canonical document-type keys for the saved library (ticket 05) and, later,
// analytics (ticket 08). These are the 4 document types PRD.md scopes v1 to
// — kept separate from the 11 red-line category keys in
// lib/red-lines/category-labels.ts, which are a different axis (what a flag
// is about, not what kind of document it came from).

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  contract: "Contract",
  lease: "Lease",
  freelance_agreement: "Freelance agreement",
  tos: "Terms of service",
};

/** The 4 canonical document-type keys, in the order defined above. Used to
 * validate a saved document's type and to render the upload selector. */
export const DOCUMENT_TYPE_KEYS = Object.keys(DOCUMENT_TYPE_LABELS);

/** The display label for a document-type key, falling back to the key
 * itself for anything outside the canonical 4 (should not normally
 * happen, since input is validated against DOCUMENT_TYPE_KEYS). */
export function getDocumentTypeLabel(documentType: string): string {
  return DOCUMENT_TYPE_LABELS[documentType] ?? documentType;
}
