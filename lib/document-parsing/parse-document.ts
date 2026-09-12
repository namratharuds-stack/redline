// Browser-side document parsing. Only the extracted text ever leaves the
// browser — the raw File object is never uploaded or stored anywhere. See
// CLAUDE.md ("The file is parsed in the browser; only extracted text is
// stored, never the raw file").
//
// Supports .txt (read as text) and .pdf (text layer extracted via
// pdfjs-dist). Anything else — including images — is rejected outright with
// no OCR-like fallback, per ticket 03.

export const SUPPORTED_EXTENSIONS = ["txt", "pdf"] as const;
export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number];

/** Minimum trimmed length for extracted text to count as real content,
 * rather than an empty/near-empty result (e.g. a scanned PDF with no text
 * layer). Chosen well below any real contract/lease/agreement's length. */
const MIN_MEANINGFUL_TEXT_LENGTH = 20;

export class UnsupportedFileError extends Error {
  constructor(filename: string) {
    super(
      `"${filename}" isn't a supported file type. Upload a .txt or .pdf file.`
    );
    this.name = "UnsupportedFileError";
  }
}

export class EmptyDocumentTextError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = "EmptyDocumentTextError";
  }
}

/** Returns the lowercased extension of `filename`, without the dot, or ""
 * if there isn't one. Pure and DOM-free, so it's directly unit-testable. */
export function getFileExtension(filename: string): string {
  const match = /\.([^./\\]+)$/.exec(filename);
  return match ? match[1].toLowerCase() : "";
}

/** Whether `filename`'s extension is one this app knows how to parse. Pure
 * and DOM-free, so it's directly unit-testable. */
export function isSupportedExtension(filename: string): boolean {
  return (SUPPORTED_EXTENSIONS as readonly string[]).includes(
    getFileExtension(filename)
  );
}

/** Whether `text` is substantial enough to treat as real extracted document
 * content, rather than empty/near-empty output (e.g. from a scanned PDF with
 * no text layer). Pure and DOM-free, so it's directly unit-testable. */
export function hasMeaningfulText(text: string): boolean {
  return text.trim().length >= MIN_MEANINGFUL_TEXT_LENGTH;
}

/**
 * Extracts text from an uploaded File, entirely in the browser.
 *
 * Throws `UnsupportedFileError` for any extension other than .txt/.pdf, and
 * `EmptyDocumentTextError` if a .pdf has no extractable text layer (treated
 * the same as unsupported — never passed through as if it were real
 * content).
 *
 * Requires browser File/Blob APIs (and, for PDFs, pdfjs-dist's worker
 * plumbing), so this function itself isn't meaningfully unit-testable
 * outside a real browser — the pure helpers above are what's unit-tested.
 */
export async function extractDocumentText(file: File): Promise<string> {
  if (!isSupportedExtension(file.name)) {
    throw new UnsupportedFileError(file.name);
  }

  const extension = getFileExtension(file.name);
  const text =
    extension === "pdf" ? await extractPdfText(file) : await file.text();

  if (!hasMeaningfulText(text)) {
    throw new EmptyDocumentTextError(
      extension === "pdf"
        ? "This PDF doesn't have any text we can read. It looks like a scanned image rather than a text document, and Redline can't process scanned documents yet."
        : "This file doesn't seem to contain any readable text."
    );
  }

  return text;
}

async function extractPdfText(file: File): Promise<string> {
  const { GlobalWorkerOptions, getDocument } = await import(
    "pdfjs-dist/legacy/build/pdf.mjs"
  );
  // Served as a static file from public/pdfjs/ (copied from
  // node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs) rather than
  // referenced via `new URL(..., import.meta.url)`. That pattern is the
  // usual recommendation, but it makes Next.js's production webpack build
  // route the worker file through its asset pipeline and Terser, which
  // fails on the worker's top-level `import.meta` with "'import.meta'
  // cannot be used outside of module code" — see this file's sibling
  // comment in the build report for the exact error. Pointing workerSrc at
  // a plain public URL sidesteps that pipeline entirely.
  GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

  const data = await file.arrayBuffer();
  const pdf = await getDocument({ data }).promise;

  const pageTexts: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n\n").trim();
}
