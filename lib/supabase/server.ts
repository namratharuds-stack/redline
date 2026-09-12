import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// See lib/supabase/client.ts for why these fall back to placeholders instead
// of throwing when the real project's env vars aren't set yet.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Server-side Supabase client for Server Components and Route Handlers.
 * Reads/writes the session via the Next.js cookie store, so it must be
 * created fresh per request rather than cached at module scope.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component that can't set cookies directly.
          // Safe to ignore as long as middleware is refreshing sessions.
        }
      },
    },
  });
}
