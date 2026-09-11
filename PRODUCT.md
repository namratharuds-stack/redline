# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js, deployed on Vercel. Supabase for auth and the database. Model calls go through OpenRouter. Settled per CLAUDE.md; not open for re-litigation.

## Users

Freelancers, independent contractors, and small-business owners/founders signing vendor, contractor, lease, and partnership agreements. This is the only segment the research found real market-interest signal for. Secondary: small landlords and tenants reviewing leases (a real, bounded task, though untuned in v1). Explicitly not who v1 is tuned for: job-offer negotiators, gig-platform workers, and procurement staff reviewing vendor ToS. No evidence of pain or willingness-to-pay was found for the latter two despite being searched for directly.

## Product Purpose

Redline takes an uploaded contract, lease, freelance agreement, or ToS and returns: a plain-English summary; severity-ranked risk flags, each showing its exact source sentence; a drafted counter-offer per flag; a Q&A box that answers only from the document; an editable red-lines list that drives the analysis; and a saved library of past documents.

It exists because professional contract review costs more than the document is worth to review (flat-fee review runs $250–$750 for a standard contract, $500–$5,000 for a lease), so people either skip review entirely or paste the document into a general-purpose chatbot that gives no severity ranking, no counter-offer, and has a documented hallucination problem.

Success means every flag traces to a verbatim substring of the document's extracted text, and no summary, flag, counter-offer, or Q&A answer states a claim the document's text doesn't support.

## Positioning

Every claim Redline makes must trace to an exact, verbatim sentence in the uploaded document (ADR-0001). A flag that can't be matched back to source text is dropped, never shown. Neither a general-purpose chatbot (ChatGPT, ChatPDF) nor funded competitors (Spellbook, LegalOn, Lexion, whose own reviews cite "occasionally glitches," false positives, and accuracy complaints) guarantee this. Severity is judged from each document's own text rather than a fixed per-category default, so the tool reflects what a specific document actually says rather than a generic risk checklist.

## Operating Context

A logged-out visitor's first stop is a public landing page (the root route), describing the product and its source-citation guarantee, with a call to action to sign up or log in. It carries no pricing, no free trial, and no unverifiable claims; a logged-in user is routed past it straight to the authenticated app instead.

Once signed in, a user uploads a document, which is parsed entirely in the browser; only the extracted text is ever sent onward or stored, never the raw file. This also rules out OCR for scanned documents on purpose: a citation pointing at misread text is worse than no citation.

Analysis runs against the user's own editable red-lines list, pre-populated with 7 freelance/small-business-relevant starters (scope creep, IP assignment, non-compete, indemnification, personal guarantees, auto-renewal, arbitration) out of an 11-category v1 list. Onboarding walks through a sample freelance contract as the primary example, with a sample lease reachable as a secondary example; neither sample file exists yet. Users return to a saved library of past documents.

## Capabilities and Constraints

- Every risk flag must show the exact sentence it came from. A flag without a shown source is a bug, not a style choice (non-negotiable; CLAUDE.md, ADR-0001).
- Summaries, flags, counter-offers, and Q&A answers may only state what the document's text supports.
- Out of scope for this version: payments/billing, OCR for scanned documents, sharing a document between users, and anything not in the PRD's numbered feature list (ask before building).
- Passive usage analytics only (document-type distribution, self-identified persona); no willingness-to-pay prompt, no billing UI.
- Open/undecided: the exact severity scale representation, whether editing the red-lines list retroactively re-flags documents already saved in the library, and specific OpenRouter model selection for analysis versus Q&A.

## Evidence on Hand

No real sample documents exist yet for the onboarding walkthrough (a freelance contract, a lease); these still need to be created rather than assumed. No logo, voice guide, or other brand assets exist yet; "Redline" is a working title, not confirmed final. Research findings backing the product's decisions live under `research/` and are cited throughout PRD.md.

## Product Principles

1. A flag is only as good as its citation: if it can't be traced to an exact sentence in the document, don't show it.
2. Never state a claim the uploaded document's text doesn't support, in a summary, a flag, a counter-offer, or a Q&A answer.
3. Judge severity from what this specific document says, not a fixed assumption about its category.
4. Tune deliberately for freelancers and small-business owners first; let other document types keep working without pretending they're equally tailored.
5. Trust is the product. Whenever billing is eventually built, cancellation must be at least as easy as sign-up.
