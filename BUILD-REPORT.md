# Build report

Unattended build via `/mattpocock-skills:implement`, started 2026-09-11,
finished 2026-09-12. All 10 tickets in `.scratch/redline-v1/issues/` are
done. Read this whole file before doing anything else — it says exactly
what's real, what's stubbed by necessity, and what you need to do by hand.

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

## What could not be verified (no live Supabase project, no OpenRouter key)

- **Real Supabase Auth flows** — signup/login/logout/session-gating middleware
  redirects. Only the pure redirect-decision functions in
  `lib/auth/redirect-rules.ts` are unit-tested (17 cases); the actual
  cookie/session plumbing has never run against a real project.
- **Supabase persistence and RLS enforcement** for `red_lines` and
  `documents` — both migrations are hand-reviewed against the same
  explicit-per-command-policy style, not executed or tested against a live
  database. In particular, RLS as the *cross-user* guard (rather than just
  an app-level filter) has never actually been exercised.
- **`user_metadata` writes** (`onboarded`, `persona`) — same reason; never
  confirmed a write actually persists or that a later read reflects it.
- **Live model output quality.** Every test/eval in this build (`npm test`)
  runs against mocked `fetch` responses built from `tests/fixtures/`, by the
  spec's own design (the suite must run without live model calls). This
  proves the *plumbing* is correct — source-citation dropping, severity
  pass-through, all-11-categories coverage, false-positive suppression — not
  that a real OpenRouter call produces good summaries, flags, or
  counter-offers. **No live model call has happened at any point in this
  build.**
- **`tests/eval/unsupported-claims.eval.test.ts`** — gated on
  `OPENROUTER_API_KEY`; shows as *skipped* here, not passing.
- **`tests/eval/severity-correlation.test.ts`** — uses the fixture sidecar's
  `expectedSeverityBand` values (written by the fixture-building agent) as an
  explicitly-flagged stand-in for a human-ranked benchmark. Treat a pass as
  "the severity plumbing preserves ordering," not as validated evidence of
  real severity judgment quality. Replace with an actual human-ranked
  benchmark before trusting it as real evidence.
- **Vercel deployment** — not touched in this build; the app has only been
  built/run locally.

## One thing outside this build's scope, found and left alone

`CLAUDE.md` has uncommitted local changes already sitting in the working
tree before this build started (visible in `git diff -- CLAUDE.md`) — it's
currently *missing* the landing-page bullet and the humanizer-copy rule that
`AGENTS.md` already has (see the `Sync AGENTS.md with CLAUDE.md's humanizer
rule` commit, which implies `CLAUDE.md` had that rule before whatever
produced this local diff). There's also an untracked `.CLAUDE.md.swp` (a Vim
swap file) and an untracked `Untitled` file sitting in the repo root. None of
these were touched, staged, or committed by this build — they look like your
own in-progress edit, not build output. Worth checking before you next open
`CLAUDE.md` in an editor, since a stale swap file can offer to recover
different content than what's on disk.

## Commands to run when you sit down

1. `npm install` (picks up everything this build added: Supabase client/SSR,
   zod, pdfjs-dist, vitest, tsx; also copies the pdfjs worker into `public/`
   via `postinstall`).
2. Create a Supabase project, then set in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Run the two migrations under `supabase/migrations/` against that project,
   in filename order (`..._create_red_lines.sql` then
   `..._create_documents.sql`) — via the Supabase SQL editor or CLI. Review
   them by hand first; they've never been executed.
4. Set `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` (a real OpenRouter model
   id — none is hardcoded anywhere) in `.env.local`.
5. `npm test` — should still show 110 passed, 1 skipped. If the previously-
   skipped `tests/eval/unsupported-claims.eval.test.ts` now runs (it will,
   once `OPENROUTER_API_KEY` is set) and it fails, that's a real finding
   about live model output, not a build defect — investigate before assuming
   the check is wrong.
6. `npm run smoke` — with real credentials this now makes an actual
   OpenRouter call and prints real flags/summary/counter-offers/answer
   against the fixture contract. Read the output; this is the first real
   look anyone has had at live model quality in this whole build.
7. `npm run dev`, sign up for a real account, and walk through the app by
   hand: onboarding → a sample or real upload → flags → Q&A → red lines →
   library. Nothing in this build has been visually checked in a browser —
   only `npm test`/`npm run build` have run.
8. When ready, deploy to Vercel (per CLAUDE.md's settled stack) and set the
   same env vars there.
