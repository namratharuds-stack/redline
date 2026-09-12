# Build report

Unattended build via `/mattpocock-skills:implement`, started 2026-09-11,
finished 2026-09-12. All 10 tickets in `.scratch/redline-v1/issues/` are
done. Read this whole file before doing anything else — it says exactly
what's real, what's stubbed by necessity, and what you need to do by hand.

## Session 2 update (2026-09-12) — environment is now live

After the unattended build finished, a real Supabase project and a real
OpenRouter key were connected in a follow-up session. **Both are now
verified working, not just built:**

- A real Supabase project (`kaaqlfdqfnzguxfcyvlp.supabase.co`) is wired into
  `.env.local`. Both migrations (`red_lines`, `documents`) were run against
  it via the Supabase SQL Editor and confirmed present (`GET` on both tables
  via the REST API returns `200 []` for an anon request — RLS is active,
  not just written).
- Sign-up was tested directly against the live project (a real HTTP call to
  `/auth/v1/signup`) and returned a real user with a confirmation email
  queued — the "Failed to fetch" error originally reported is fixed; it was
  caused by no Supabase project existing yet (the client was hitting a
  placeholder URL). One throwaway unconfirmed test user
  (`redline.smoke.test.…@gmail.com`) is sitting in Supabase Auth's user list
  from this check — harmless, delete it from **Authentication → Users** if
  you want it tidy.
- A real `OPENROUTER_API_KEY`/`OPENROUTER_MODEL` (`z-ai/glm-5.3-flash`) is
  in `.env.local`. `npm run smoke` has now run for real (see below) — this
  build has real evidence of live model quality, not just fixture-mocked
  plumbing.
- `npm run dev` was started and `/`, `/login`, `/signup`, `/home` all
  responded correctly with no server errors.
- The `CLAUDE.md` gap noted below ("One thing outside this build's scope")
  was fixed at your request: the landing-page bullet and humanizer rule are
  restored and committed (`37cebb1`). Its unrelated punctuation-style diff
  (colons → em dashes) and the stray `.CLAUDE.md.swp`/`Untitled` files were
  left alone, as before.
- A real bug was found and fixed in `scripts/smoke.ts` itself: `tsx` doesn't
  auto-load `.env.local` the way Next.js does, so the script always reported
  the keys missing even when they were set. Fixed via Node's
  `--env-file-if-exists` flag (commit `c9b0e61`).

**Still not done: nothing has been checked in an actual browser.** Every
verification above was via `curl`/direct API calls, not clicking through the
UI. Onboarding, upload, flags rendering, Q&A, red-lines editing, and the
library have never been visually confirmed. Do that next.

## Status

| Ticket | Status | Notes |
|---|---|---|
| Fixtures (pre-ticket) | done | `tests/fixtures/` — adhesion contract with all 11 red-line categories planted, sidecar-verified as exact substrings; a clean document for false-positive testing |
| 01 app-scaffold-auth | done | Real Supabase Auth (`/login`, `/signup`, `/home`, sign-out). Client factories fall back to placeholder creds only to avoid a constructor throw before a project exists — never fakes a session |
| 02 analysis-engine-core | done | `lib/analysis-engine/` — the only module touching OpenRouter. Source-citation dropping is production logic, not just a test |
| 03 upload-analyze-display | done | `.txt`/`.pdf` parsed client-side (pdfjs-dist), real `analyzeDocument` call via `/home/analyze` |
| 04 editable-red-lines-list | done | `red_lines` table + RLS, `/home/red-lines` UI, `/api/red-lines` CRUD |
| 05 document-library | done | `documents` table + RLS, `/home/library` list + detail (never re-runs `analyzeDocument`) |
| 06 qa-box | done | `/api/answer` + Q&A box in `home-client.tsx` |
| 07 onboarding-walkthrough | done | Sample freelance/lease documents run through the exact same analyze path as a real upload; `onboarded` flag in `user_metadata` |
| 08 passive-usage-analytics | done | Document-type distribution already came free from ticket 05's `documents` table; added an optional, non-blocking persona picker in onboarding |
| 09 evaluation-suite | done | Detection-rate, false-positive, source-citation, and severity-correlation checks all pass against fixtures; the LLM-judged unsupported-claims check honestly skips without an API key |
| 10 landing-page | done | Fixed dead `/sign-up`/`/sign-in` CTAs to the real `/signup`/`/login` routes; root now redirects an authenticated visitor to `/home` |

**Finished-means-checklist (from the build prompt, step 7):**
- `npm run build` — passes.
- `npm test` — passes (110 passed, 1 intentionally skipped — see below).
- `npm run smoke` — exists, runs the adhesion-contract fixture through the
  real `analyzeDocument`/`answerQuestion` (no mocks). **Update 2026-09-12:**
  ran for real once `OPENROUTER_API_KEY`/`OPENROUTER_MODEL` were set
  (`z-ai/glm-5.3-flash`). Result: all 11 planted categories were detected,
  all 11 returned flags verified as exact substrings of the fixture text,
  severities and counter-offers were specific to each clause's actual
  wording (not generic boilerplate), and the Q&A sample answered correctly
  with a citation to the relevant section. This is the first real evidence
  in this build that the live model output — not just the plumbing — meets
  the bar (ADR-0001 compliance, specificity, per-document severity). Note: a
  bug was found and fixed in the smoke script itself during this run — `tsx`
  doesn't auto-load `.env.local` the way Next.js does, so the script always
  reported the keys missing even when they were set; fixed via Node's
  `--env-file-if-exists` flag (see the "Fix npm run smoke" commit).

## Decisions made in your absence

These answer the two questions CLAUDE.md says to stop and ask about, plus
implementation details the spec left open. Reasons are given so any of them
can be revisited.

1. **Model calls.** OpenRouter's OpenAI-compatible chat completions endpoint,
   called with a plain `fetch` (no `openai` SDK) so the extra provider-routing
   fields (`provider.order: ["fireworks"]`, `provider.allow_fallbacks: false`,
   `require_parameters: true`, `reasoning.effort: "low"`) go through as raw
   JSON without fighting SDK types. Model id comes only from `OPENROUTER_MODEL`
   at call time — never hardcoded, never defaulted. Every analysis/answer call
   requests structured JSON output (`response_format: json_object`), validated
   with `zod` before being trusted. The call is isolated in one file
   (`lib/analysis-engine/model-client.ts`) — the only place in the codebase
   that reads `OPENROUTER_API_KEY`/`OPENROUTER_MODEL` or touches `fetch` for
   OpenRouter.
2. **Supabase.** No project exists yet. `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` are read from env; every table/policy ships
   as a SQL migration under `supabase/migrations/` (two files — `red_lines`,
   `documents`) for you to run by hand. The app builds and can analyze a
   pasted/uploaded document with those two vars absent; only sign-in, the
   red-lines list, and the library need a real project. Auth is never mocked
   anywhere — where a Supabase client needs a URL/key to construct without
   throwing during build, it falls back to an inert placeholder that fails
   over the network like any misconfigured client, never a fake success.
3. **New dependencies added** (CLAUDE.md normally requires asking first;
   this run's prompt pre-authorized deciding and recording the reason
   instead):
   - `@supabase/supabase-js` + `@supabase/ssr` — standard client/server
     pairing for Supabase Auth in a Next.js App Router project.
   - `zod` — runtime validation of the model's untrusted JSON output before
     any of it is trusted as a flag/summary/answer.
   - `vitest` — no test runner existed; pinned to v1.6 specifically because
     the latest major requires a newer `@types/node` than this project has
     pinned (see `npm install` note below).
   - `pdfjs-dist` — client-side PDF text extraction (the spec requires
     parsing in the browser; `.txt`-only would have been a weak v1).
   - `tsx` (dev) — runs `scripts/smoke.ts` directly without a build step.
4. **Accepted file types for upload (not specified by the spec):** `.txt` and
   `.pdf`, parsed entirely client-side. Anything else — including a scanned
   PDF with no extractable text layer — is rejected with a clear message
   rather than any OCR-like best-effort parsing, consistent with ADR-0001.
5. **Severity scale:** Low/Medium/High, per the spec's stated default.
6. **Red-lines edits don't retroactively re-flag saved documents.** A saved
   document is a record of what was flagged at that time; silently
   re-flagging it would make the library an unstable view of history. A user
   can re-upload to see current red lines applied.
7. **Document type + persona (ticket 08) live in existing storage, not a new
   analytics table.** `documents.document_type` (ticket 05) already gives
   aggregate document-type distribution via a plain `group by`. Persona is
   one field in Supabase Auth's `user_metadata`, same pattern as the
   `onboarded` flag — no `profiles` table was added for either.
8. **pdfjs-dist's worker breaks `next build`'s production bundling** if
   referenced the usual way (`new URL(..., import.meta.url)`) — Next's
   webpack routes it through Terser, which chokes on the worker's top-level
   `import.meta`. Fixed by copying the worker to `public/pdfjs/` on
   `postinstall` (`scripts/copy-pdf-worker.mjs`) and pointing `workerSrc` at
   that static path instead, bypassing the bundler.

## What could not be verified

Resolved in Session 2 (see above): a live Supabase project now exists and
its migrations/RLS are confirmed active; a real sign-up call succeeded; a
real OpenRouter key/model is connected and `npm run smoke` produced real
output. What's still genuinely unverified:

- **Session/cookie plumbing through the actual browser UI** — sign-up was
  verified via a direct API call, not by clicking through `/signup` in a
  browser and confirming the cookie-based session, the middleware redirect
  after login, or logout. Only the pure redirect-decision functions in
  `lib/auth/redirect-rules.ts` are unit-tested (17 cases).
  `user_metadata` writes (`onboarded`, `persona`) are still unconfirmed to
  persist/read back correctly — no signed-in browser session has exercised
  them yet.
- **RLS as a genuine cross-user guard** — confirmed active for an
  unauthenticated (anon) request; not yet tested with two different real
  user accounts to confirm user A truly cannot see/edit user B's rows.
- **Live model output beyond the one smoke run.** One real `npm run smoke`
  run against the adhesion-contract fixture looked excellent (11/11
  categories, 11/11 source sentences verified, specific counter-offers,
  correct Q&A). That's one document, one run — not a substitute for the
  eval suite's `tests/eval/unsupported-claims.eval.test.ts` (still gated on
  a key being present at test time, still shows *skipped* in a plain
  `npm test` run unless you export the key first) or a broader sample of
  real documents.
- **`tests/eval/severity-correlation.test.ts`** — uses the fixture sidecar's
  `expectedSeverityBand` values (written by the fixture-building agent) as an
  explicitly-flagged stand-in for a human-ranked benchmark. Treat a pass as
  "the severity plumbing preserves ordering," not as validated evidence of
  real severity judgment quality. Replace with an actual human-ranked
  benchmark before trusting it as real evidence.
- **Vercel deployment** — not touched in this build; the app has only been
  built/run locally.

## Stray files noticed, left alone

An untracked `.CLAUDE.md.swp` (a Vim swap file) and an untracked `Untitled`
file have been sitting in the repo root since before this build started.
Neither was touched. Worth checking before you next open `CLAUDE.md` in an
editor, since a stale swap file can offer to recover different content than
what's on disk. (`CLAUDE.md` itself still carries one small pre-existing,
uncommitted, unrelated diff: a few headings use em dashes instead of colons
in the working tree vs. the last commit — left alone since you only asked
for the landing-page bullet and humanizer rule back, which are now restored
and committed.)

## Commands to run when you sit down

Environment is already connected (see Session 2 update) — this is now
mostly "go use it," not "go set it up":

1. `npm install` if you haven't on this machine (picks up Supabase
   client/SSR, zod, pdfjs-dist, vitest, tsx; also copies the pdfjs worker
   into `public/` via `postinstall`).
2. `npm test` — 110 passed, 1 skipped (the unsupported-claims eval, which
   only runs live if `OPENROUTER_API_KEY` is exported in the shell running
   the test command, not just present in `.env.local` — vitest doesn't
   auto-load that file either).
3. `npm run smoke` — already verified once with real output; run again any
   time to eyeball the live pipeline against the fixture contract.
4. `npm run dev` and actually click through the app: sign up with a real,
   checkable email address (Supabase requires confirming it — the fake
   `@gmail.com` test address used in verification never got confirmed and
   can't log in), confirm via the email, then walk onboarding → a sample or
   real upload → flags → Q&A → red lines → library. **This has still never
   been done** — every check so far was via `curl`/API calls, not a browser.
5. When ready, deploy to Vercel (per CLAUDE.md's settled stack) and set the
   same four env vars there (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENROUTER_API_KEY`,
   `OPENROUTER_MODEL`).
