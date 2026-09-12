import { createBrowserClient } from "@supabase/ssr";

// No Supabase project exists yet: NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_ANON_KEY are unset in this environment. Fall back to
// harmless placeholders so client construction never throws during build,
// prerender, or module evaluation. Falling back only changes what happens if
// the client is actually used without real credentials (it will fail at the
// network call, same as any other misconfigured client) — it does not fake
// auth behavior.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Browser-side Supabase client. Call this from Client Components; do not
 * cache the result at module scope so each call reflects the current
 * cookie-backed session.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
