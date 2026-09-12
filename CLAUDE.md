# CLAUDE.md

## What Redline does
Upload a contract, lease, freelance agreement, or ToS. The app returns:
- a plain-English summary
- risky clauses ranked by severity, each showing its exact source sentence
- a drafted counter-offer for each flagged clause
- a Q&A box that answers only from the uploaded document
- an editable list of the user's own red lines, which drives the analysis
- a saved library of past documents
- a public landing page for logged-out visitors, with no pricing, no free trial, and no unverifiable claims

## Stack (settled, do not re-litigate)
- Next.js, deployed on Vercel
- Supabase for auth and the database
- Model calls go through OpenRouter
- The file is parsed in the browser; only extracted text is stored, never the raw file

## Non-negotiable behavior
- Every risk flag must show the exact sentence it came from. A flag without a shown source is a bug, not a style choice.
- Summaries, flags, counter-offers, and Q&A answers may only state what the document's text supports. If the text doesn't say it, the product doesn't say it either.
- Any copy the user actually reads — landing page, UI labels, error messages, empty states — must be run through the humanizer skill before it's committed. Copy that sounds like a model wrote it is a defect, not a matter of taste.

## Out of scope for this version — do not build, even if it looks like the obvious next step
- Payments/billing
- OCR for scanned documents (excluded on purpose: a citation pointing at misread text is worse than no citation)
- Sharing a document between users
- Anything else not in the feature list above — ask first

## Before building
- research/summary.md has the user research behind this product; read it before deciding what the product should do.
- PRD.md (once it exists) is the brief; read it before building anything. If it doesn't exist yet, don't start building app features — ask.

## Standing rules
- Never commit a secret. Credentials live in .env.local, which is gitignored — a pushed key is compromised the moment it's pushed.
- Ask before adding a dependency.

## Agent skills

### Issue tracker

Issues and specs live as markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
