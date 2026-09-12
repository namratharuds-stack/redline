// Reusable, server-side-only logic for a user's persisted red-lines list
// (ticket 04). Called from the app/home/red-lines/* API routes — never
// imported into client components, since it takes an authenticated
// Supabase server client.

import type { SupabaseClient } from "@supabase/supabase-js";
import { STARTER_RED_LINES } from "./starter-red-lines";

export type RedLineRow = {
  id: string;
  category: string;
  description: string;
};

/**
 * Pure: true when a user with this many existing red_lines rows still
 * needs the starter set seeded. Split out from getOrSeedRedLines so the
 * "does this user need seeding" decision can be unit-tested without a
 * database.
 */
export function needsSeeding(existingRowCount: number): boolean {
  return existingRowCount === 0;
}

/**
 * Returns the authenticated user's red lines, seeding their list with the 7
 * STARTER_RED_LINES the first time this runs for a user with no rows yet.
 * Seeded rows are inserted as ordinary owned rows — from that point on
 * they're ordinary owned rows the user can edit or delete like any other;
 * STARTER_RED_LINES itself is read only here, never returned to a caller as
 * a stand-in for the user's real, persisted list.
 *
 * `supabase` must be a request-scoped client created from the caller's own
 * session (see lib/supabase/server.ts) — every query here relies on RLS
 * (auth.uid() = user_id) as the real access boundary, not the `user_id`
 * filter alone.
 */
export async function getOrSeedRedLines(
  supabase: SupabaseClient,
  userId: string
): Promise<RedLineRow[]> {
  const { data: existing, error: selectError } = await supabase
    .from("red_lines")
    .select("id, category, description")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (selectError) {
    throw selectError;
  }

  if (!needsSeeding(existing?.length ?? 0)) {
    return existing as RedLineRow[];
  }

  const seedRows = STARTER_RED_LINES.map((redLine) => ({
    user_id: userId,
    category: redLine.category,
    description: redLine.description,
  }));

  const { data: inserted, error: insertError } = await supabase
    .from("red_lines")
    .insert(seedRows)
    .select("id, category, description")
    .order("created_at", { ascending: true });

  if (insertError) {
    throw insertError;
  }

  return (inserted as RedLineRow[]) ?? [];
}
