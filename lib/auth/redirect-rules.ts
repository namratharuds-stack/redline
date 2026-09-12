/**
 * Pure routing decisions for the auth gate. Kept free of any Supabase or
 * Next.js dependency so they can be unit-tested with plain inputs/outputs —
 * see middleware.ts for where these are wired to a real session lookup.
 */

const PROTECTED_PREFIX = "/home";
const AUTH_ONLY_PATHS = ["/login", "/signup"];

/**
 * True when an unauthenticated visitor to `pathname` should be sent to
 * /login — i.e. the path is /home or nested under it, and there's no
 * session.
 */
export function shouldRedirectToLogin(
  pathname: string,
  hasSession: boolean,
): boolean {
  if (hasSession) return false;
  return pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);
}

/**
 * True when an already-authenticated visitor to `pathname` should be sent
 * to /home instead of seeing the login/signup form again.
 */
export function shouldRedirectAwayFromAuthPages(
  pathname: string,
  hasSession: boolean,
): boolean {
  if (!hasSession) return false;
  return AUTH_ONLY_PATHS.includes(pathname);
}

/**
 * True when an already-authenticated visitor at the root path ("/") should
 * be sent to /home instead of seeing the logged-out marketing page.
 */
export function shouldRedirectToHome(
  pathname: string,
  hasSession: boolean,
): boolean {
  if (!hasSession) return false;
  return pathname === "/";
}
