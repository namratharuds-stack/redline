// Pure decision for ticket 07's onboarding walkthrough: given the current
// user's Supabase Auth `user_metadata`, should the onboarding intro show
// instead of (or above) the plain upload prompt?
//
// There is no `profiles` table for this — Supabase Auth's per-user
// `user_metadata` already carries arbitrary JSON, so a single boolean lives
// there (`{ onboarded: true }`), set once via `supabase.auth.updateUser`
// after the user's first completed analysis (sample or real). See
// app/home/home-client.tsx for where this is read (server-fetched, passed
// in as a prop) and written (client-side, after analysis completes).

export function shouldShowOnboarding(
  userMetadata: Record<string, unknown> | null | undefined
): boolean {
  return userMetadata?.["onboarded"] !== true;
}
