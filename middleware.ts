import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  shouldRedirectAwayFromAuthPages,
  shouldRedirectToLogin,
} from "./lib/auth/redirect-rules";

// See lib/supabase/client.ts for why these fall back to placeholders instead
// of throwing when the real project's env vars aren't set yet.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export async function middleware(request: NextRequest) {
  // Supabase's standard Next.js middleware pattern: build the response we'll
  // return up front, and mirror every cookie Supabase sets onto it so a
  // refreshed session actually reaches the browser.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refreshes the session cookie if it's stale. Do not add logic between
  // this call and the response being returned — see Supabase's @supabase/ssr
  // docs on why the cookie mirroring above has to stay intact.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const hasSession = Boolean(user);

  if (shouldRedirectToLogin(pathname, hasSession)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (shouldRedirectAwayFromAuthPages(pathname, hasSession)) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/home";
    return NextResponse.redirect(homeUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
