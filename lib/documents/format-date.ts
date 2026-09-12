// Pure date formatting for the library list/detail views (ticket 05). Kept
// free of Next.js so it can be unit-tested with plain inputs.

/**
 * Formats a `created_at` timestamp (as returned by Supabase, an ISO 8601
 * string) into a short human-readable date, e.g. "Sep 11, 2026". Falls back
 * to a plain label for anything that doesn't parse, rather than showing
 * "Invalid Date".
 */
export function formatDocumentDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  // Supabase's created_at is always UTC. Format in UTC rather than the
  // server/browser's local timezone, so a timestamp near midnight doesn't
  // shift to the wrong calendar day depending on where it's rendered.
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
