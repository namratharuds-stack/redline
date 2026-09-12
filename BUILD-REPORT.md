# Build report

This file is updated as the build proceeds (started 2026-09-11, unattended run
via `/mattpocock-skills:implement`). Read the Status table first.

## Status

| Ticket | Status | Notes |
|---|---|---|
| Fixtures (pre-ticket) | in progress | — |
| 01 app-scaffold-auth | not started | |
| 02 analysis-engine-core | not started | |
| 03 upload-analyze-display | not started | |
| 04 editable-red-lines-list | not started | |
| 05 document-library | not started | |
| 06 qa-box | not started | |
| 07 onboarding-walkthrough | not started | |
| 08 passive-usage-analytics | not started | |
| 09 evaluation-suite | not started | |
| 10 landing-page | not started (landing UI already exists as a static demo from the impeccable design build; this ticket wires it to real auth routing) |

## Decisions made in the user's absence

These answer the two questions CLAUDE.md says to stop and ask about, plus
implementation details the spec left open. Reasons are given so they can be
revisited.

1. **Model calls.** OpenRouter's OpenAI-compatible chat completions endpoint,
   called with a plain `fetch` (no `openai` SDK) so the extra provider-routing
   fields (`provider.order: ["fireworks"]`, `provider.allow_fallbacks: false`,
   `require_parameters: true`, `reasoning.effort: "low"`) can be sent as raw
   JSON without fighting SDK types. Model id comes only from `OPENROUTER_MODEL`
   at call time — never hardcoded, never defaulted — per instruction. Every
   analysis/answer call requests structured JSON output. The call is isolated
   in one module (the Analysis Engine's model-call boundary, ticket 02) so it
   is the only place that reads `OPENROUTER_API_KEY`/`OPENROUTER_MODEL`.
2. **Supabase.** No project exists yet. `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` are read from env; every table/policy ships
   as a SQL migration under `supabase/migrations/` for the user to run by
   hand. The app must start and analyze a pasted/uploaded document with those
   two vars absent — only sign-in, the library, and red lines need a real
   project, per instruction. Auth is never mocked.
3. **New dependencies added** (CLAUDE.md normally requires asking first; this
   run's prompt pre-authorizes deciding and recording the reason instead):
   - `@supabase/supabase-js` + `@supabase/ssr` — the standard client/server
     pairing for Supabase Auth in a Next.js App Router project (cookie-based
     session handling in middleware).
   - `zod` — runtime validation of the model's JSON output before it's
     trusted as a flag/summary/answer. Untrusted LLM JSON needs a real schema
     check, not ad hoc `typeof` narrowing, given how load-bearing the
     source-citation guarantee is.
   - `vitest` (+ `@vitejs/plugin-react` if a component test needs it) — no
     test runner existed. Chosen over Jest for native ESM/TS support with
     minimal config in a Next.js 14 project.
   - `pdfjs-dist` — client-side (browser) PDF text extraction. The spec
     requires parsing in the browser and never storing/uploading the raw
     file; PDF is the most common contract/lease file type, so v1 needs a
     real in-browser extractor rather than only accepting `.txt`.
4. **Accepted file types for upload (not specified by the spec):** `.txt` and
   `.pdf`, parsed entirely client-side. Anything else (including images or
   scanned PDFs with no extractable text layer) is rejected with a clear
   "unsupported file" message rather than silently attempting OCR-like
   best-effort parsing, consistent with ADR-0001's OCR exclusion.
5. **Severity scale:** Low/Medium/High, per the spec's stated default.
6. **Red-lines edits and past documents:** editing the red-lines list does
   NOT retroactively re-flag documents already saved in the library (spec
   left this open). Reason: a saved document is a record of what was flagged
   at that time; re-flagging silently would make the library an unstable
   view of history. A user can always re-upload/re-run to see current
   red lines applied.
7. Test/build commands: `npm run build`, `npm test` (vitest), `npm run smoke`
   (fixture contract through the real pipeline; stub client unless
   `OPENROUTER_API_KEY` is set).

## What could not be verified

(filled in as the build proceeds)

## Commands to run first

(filled in at the end)
