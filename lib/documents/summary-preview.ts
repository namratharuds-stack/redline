// Pure text shaping for the library list view (ticket 05): a short preview
// of a saved document's summary. Kept free of Next.js so it can be
// unit-tested with plain inputs.

const DEFAULT_MAX_LENGTH = 140;

/**
 * Returns the first line of `summary`, trimmed and truncated to at most
 * `maxLength` characters (an ellipsis replaces the cut text so a truncated
 * preview never reads as the whole summary). Never invents text that isn't
 * in `summary` — this only shapes what's already there.
 */
export function getSummaryPreview(
  summary: string,
  maxLength: number = DEFAULT_MAX_LENGTH
): string {
  const firstLine = summary.trim().split("\n")[0].trim();
  if (firstLine.length <= maxLength) {
    return firstLine;
  }
  return `${firstLine.slice(0, maxLength - 1).trimEnd()}…`;
}
