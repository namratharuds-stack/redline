Status: ready-for-agent

# Redline v1

## Problem Statement

Freelancers, independent contractors, and small-business owners sign vendor, contractor, lease, and partnership agreements containing terms that cost them money later, and they don't notice the term until it's too late to renegotiate. Professional review costs more than the document is worth to review ($250–$750 flat, $300–$500/hr), so people either skip review entirely or paste the document into a general-purpose chatbot that gives no severity ranking, no counter-offer, and has a documented hallucination problem.

## Solution

A user uploads a contract, lease, freelance agreement, or ToS. Redline parses it in the browser (raw file never leaves the browser or gets stored), then returns: a plain-English summary; risky clauses flagged against the user's own editable red-lines list, each flag showing its exact source sentence and a severity judged from that document's own text; a drafted counter-offer for each flag; a Q&A box that answers only from the document's text; and a saved library of the user's past documents. Every claim Redline makes (in the summary, a flag, a counter-offer, or a Q&A answer) must trace to a substring of the uploaded document's extracted text, per [ADR-0001](../../docs/adr/0001-every-flag-cites-its-source.md).

A logged-out visitor lands on a public marketing page describing the product and its source-citation guarantee, with a call to action to sign up or log in. The page makes no pricing claims, offers no way to run an analysis without an account, and states nothing beyond the product's actual mechanism and documented feature list.

## User Stories

1. As a freelancer, I want to upload a contract file, so that I can get it reviewed without paying a lawyer.
2. As a user, I want the file parsed in my browser, so that my raw document is never stored on Redline's servers.
3. As a user, I want a plain-English summary of the document, so that I understand what I'm agreeing to without reading dense legal text.
4. As a user, I want risky clauses flagged against my own red-lines list, so that I only see what I've told the tool I care about.
5. As a user, I want each flag to show the exact sentence from my document that triggered it, so that I can verify the flag myself instead of trusting the model blindly.
6. As a user, I want each flag to carry a severity rating, so that I know which clauses to worry about first.
7. As a user, I want severity judged from my document's actual wording rather than a fixed per-category default, so that a boilerplate-looking clause and an aggressively-worded one in the same category aren't scored identically.
8. As a user, I want a drafted counter-offer for each flagged clause, so that I have concrete alternative language to propose instead of starting from a blank page.
9. As a user, I want to ask questions about my document in a Q&A box, so that I can get quick answers without re-reading the whole thing.
10. As a user, I want Q&A answers to only state what my document's text supports, so that I'm not misled by a plausible-sounding but fabricated answer.
11. As a user, I want the Q&A box to tell me when it can't answer from the document, so that I know to look elsewhere rather than get a guess presented as fact.
12. As a user, I want an editable list of my own red lines, so that the analysis reflects what I personally care about, not a fixed checklist.
13. As a user, I want to add a custom red line, so that I can flag something specific to my situation that isn't in the starter list.
14. As a user, I want to remove a red line I don't care about, so that I'm not shown flags for things that don't matter to me.
15. As a user, I want to edit an existing red line's description, so that I can tune what counts as a match without starting over.
16. As a first-time freelance user, I want the red-lines list pre-populated with freelance/small-business-relevant starter entries (scope creep, IP assignment, non-compete, indemnification, personal guarantees, auto-renewal, arbitration), so that I get useful flags immediately without having to know what to ask for.
17. As a first-time user, I want an onboarding walkthrough using a sample freelance contract, so that I can see how Redline works before uploading my own document.
18. As a first-time user reviewing a lease, I want a lease example reachable (not hidden) from onboarding, so that I can see a relevant walkthrough even though I'm not the primary-tuned persona.
19. As a returning user, I want a saved library of my past documents, so that I can come back to a prior analysis without re-uploading.
20. As a returning user, I want to reopen a past document from my library and see its summary, flags, and counter-offers again, so that I don't lose my previous review.
21. As a user, I want my documents and red-lines list scoped to my account, so that other users can't see my documents.
22. As a user uploading a lease, I want the same core pipeline (summary, flags, counter-offers, Q&A) to work on my document even though the starter red lines are freelance-tuned, so that the product is still useful outside its primary persona.
23. As a user uploading a ToS, I want the same core pipeline to work on my document, so that I can review terms-of-service agreements too, not just contracts and leases.
24. As a product owner, I want passive tracking of document-type distribution and self-identified persona (where the flow asks), so that I can learn usage patterns without adding a willingness-to-pay prompt.
25. As a user, I want no payment prompt anywhere in this version, so that my first experience isn't interrupted by a monetization ask.
26. As a user uploading a scanned (image-only) document, I want the upload rejected or clearly flagged as unsupported, so that I never receive a flag citing misread OCR text as if it were the real document.
27. As a user, I want a flag dropped entirely (not shown with a placeholder or vague citation) if Redline can't trace it to an exact source sentence, so that every flag I do see is falsifiable against my own document.
28. As a user uploading a document with no clauses matching any of my red lines, I want a clean "no flags found for your red lines" result rather than a forced or fabricated flag, so that the absence of risk is represented honestly.
29. As a user, I want the summary to only state things the document's text supports, so that I don't act on a claim the document doesn't actually make.
30. As a user, I want a counter-offer to be specific to the flagged clause's actual wording, so that it's usable as real redline language rather than generic boilerplate.
31. As a developer, I want the core analysis logic (summary, flags, severity, counter-offers, Q&A) isolated behind one module boundary, so that it can be tested and evaluated without needing the browser, the database, or a live model call.
32. As a developer, I want the model provider call isolated at the edge of that module, so that tests can run against recorded/fixture responses instead of live OpenRouter calls.
33. As a QA reviewer, I want a labeled eval set covering all 11 red-line categories, so that I can measure per-category detection rate and catch a category whose flag logic silently doesn't work.
34. As a QA reviewer, I want the same eval run against non-matching documents/clauses, so that I can catch a high false-positive rate before it trains users to ignore the tool.
35. As a QA reviewer, I want a mechanical check that every returned flag's source sentence is an exact substring of the input document text, so that source-citation correctness doesn't rely on manual eyeballing.
36. As a QA reviewer, I want a benchmark set of documents ranked by severity by a human reviewer, so that I can check the tool's severity ranking correlates with human judgment.
37. As a prospective user, I want a public landing page describing what Redline does, so that I can understand the product before creating an account.
38. As a prospective user, I want the landing page's claims limited to what the product actually does, so that I'm not misled by fabricated testimonials, user counts, or statistics.
39. As a prospective user, I want a clear sign-up/log-in call to action on the landing page, so that I can start using Redline once I'm convinced.
40. As a logged-out visitor, I want to land on the marketing page at the root URL rather than being forced straight to a login form, so that I can learn about the product before committing to create an account.
41. As a returning logged-in user, I want to land on my authenticated home page, not the marketing page, when I visit the app, so that I go straight to my documents.
42. As a prospective user, I want no pricing or payment information anywhere on the landing page, so that I'm not confused about billing that doesn't exist yet.
43. As a prospective user, I want no way to analyze a document without signing up, so that document data stays tied to an account, consistent with the rest of the product's per-user storage model.

## Implementation Decisions

- **Analysis Engine module** is the single seam for this feature. It exposes two entry points and nothing else needs to be mocked to test product behavior:
  - `analyzeDocument(documentText, redLines) → { summary, flags[] }`
  - `answerQuestion(documentText, question) → answer`
- **Flag shape**: each flag returned by `analyzeDocument` carries a category (matching a red line), a severity, the source sentence, a human-readable explanation, and a counter-offer. A flag that cannot be tied to an exact substring of `documentText` is dropped by the engine before it returns. It is never passed upstream as a partial or low-confidence flag (per ADR-0001).
- **Severity** is computed per-document from the clause's actual text, not looked up from a fixed table keyed by category (this was explicitly decided against during the PRD's grilling session, Q5). Spec-time default: a three-tier scale (Low / Medium / High). The exact scale is an implementation detail, not a product decision: confirm before building if a finer scale is wanted.
- **Red-lines list** is per-user, stored in Supabase, and drives which categories `analyzeDocument` looks for. It ships pre-populated with 7 starter entries (scope creep, IP assignment, non-compete, indemnification, personal guarantees, auto-renewal, arbitration) out of the PRD's full 11-category list; the remaining 4 (liability cap, fee/rent escalator, early termination penalty, data/privacy rights grab) are not pre-populated by default but can be added by any user like any custom red line.
- **File parsing** happens client-side in the browser (existing stack decision, CLAUDE.md). Only the extracted text is sent to the server or persisted; the raw file is never uploaded or stored.
- **Storage (Supabase)**: per user, the red-lines list; per document, extracted text, document type, upload timestamp, and the stored analysis result (summary, flags, counter-offers) so the library view doesn't need to re-run analysis to display a past document.
- **Auth (Supabase Auth)**: documents and red-lines lists are scoped to the authenticated user's account.
- **Model calls (OpenRouter)**: routed through the Analysis Engine's model-call boundary. Specific model selection is not a product decision made by this spec: treat as an implementation detail to confirm separately.
- **Onboarding**: primary walkthrough uses a sample freelance contract; a lease sample is reachable as a secondary example, not hidden behind extra navigation.
- **Q&A** is scoped strictly to `documentText`. When the text doesn't support an answer, `answerQuestion` must return a response stating the document doesn't address the question, not a best-effort guess.
- **Analytics**: passive tracking only, document-type distribution and self-identified persona where onboarding or upload asks for it. No willingness-to-pay prompt, no billing UI, anywhere in this version (CLAUDE.md, Q6).
- **Unsupported input handling**: scanned/image-only documents are out of scope for parsing (OCR excluded on purpose, per CLAUDE.md and ADR-0001). The upload flow needs a defined rejection or warning path for this case, since silently attempting parsing on an image-only PDF would violate the source-citation guarantee.
- **Landing page** is a new public, unauthenticated route and becomes the root ("/") for logged-out visitors, replacing a straight redirect-to-login. An authenticated visitor is still routed to the app home page, not the landing page. Login and signup remain their own routes, reached via the landing page's call to action.
- The landing page never calls the Analysis Engine and offers no way to run an analysis without an account (no free trial).
- Landing page copy is limited to product-mechanism claims (what Redline does, the source-citation guarantee, the feature list): no testimonials, no user counts, no unverifiable statistics, and no pricing or payment messaging anywhere on the page.

## Testing Decisions

- A good test exercises `analyzeDocument` or `answerQuestion` through their public inputs/outputs: a fixture document's text and (for `analyzeDocument`) a red-lines list, or (for `answerQuestion`) a document's text and a question. Tests should not assert on prompt strings, internal model choice, or other implementation details of the Analysis Engine.
- **Source-sentence integrity** is a mechanical, non-judged test: for every flag returned against a fixture document, assert `flag.sourceSentence` is an exact substring of that fixture's text. This should run against every fixture in the eval set, not sampled.
- **Per-category detection rate**: a labeled eval set with real or representative clauses for each of the 11 red-line categories, run through `analyzeDocument`, measuring how often each category's clause is correctly flagged. A category at or near 0% is a signal that category's flag logic doesn't work, independent of how rare that clause is in real documents.
- **False-positive rate**: the same eval infrastructure run against documents/clauses that do not match any red line, asserting the engine doesn't flag them.
- **Unsupported-claim check**: for the same eval set, assert no sentence in the summary, a flag's explanation, a counter-offer, or a Q&A answer contains a claim absent from the fixture's text. This likely needs a judged (human- or LLM-reviewed) check rather than a pure string match, since claims can be unsupported without being novel substrings.
- **Severity legibility**: a benchmark set of documents whose clauses a human reviewer has ranked by severity; assert the engine's severity ordering correlates with the human ranking. This is a correlation check, not an exact-match check, since severity is judged per-document rather than defaulted by category.
- **Model-call isolation**: the OpenRouter call at the edge of the Analysis Engine is mocked or replayed from recorded fixture responses in tests, so the eval suite is deterministic and doesn't depend on live model calls or incur cost in CI.
- **Prior art**: none. This is a greenfield codebase with no existing test suite.
- A good test for the landing page checks routing behavior (a logged-out visitor sees the landing page at "/"; a logged-in visitor is routed to the app home page instead) and content constraints (no pricing text, no testimonial or statistic claims present), not internal component structure. The test runner and eval harness are implementation choices to make when scaffolding, not prescribed by this spec.

## Out of Scope

- Payments/billing (CLAUDE.md).
- OCR for scanned documents (CLAUDE.md, ADR-0001): a citation pointing at misread text is worse than no citation.
- Sharing a document between users (CLAUDE.md).
- A willingness-to-pay prompt in-product (considered and rejected in the PRD's Q6; passive usage tracking instead).
- Evidence-weighted severity defaults per red-line category (considered and rejected in the PRD's Q5; severity must be judged per-document).
- Unilateral termination clause detection (dropped from the PRD's red-line list; arbitration was swapped in instead, per Q2).
- Lease- or ToS-specific starter red lines, and onboarding parity for those document types beyond a reachable secondary lease example (PRD Q3/Q7: freelance gets the tuned v1 defaults, lease and ToS remain functional but untuned).
- A no-signup trial/demo of analysis on the landing page: considered and rejected for this decision; no free trial without an account.
- Landing page pricing or payment messaging: none in v1, consistent with no billing existing yet.
- Anything not in the PRD's numbered feature list: ask before building it (CLAUDE.md).

## Further Notes

- Open implementation questions not resolved by the PRD, to confirm before or during build:
  - Whether editing the red-lines list retroactively re-flags documents already saved in the library, or only affects future analyses.
  - The exact severity scale/representation (this spec defaults to Low/Medium/High as a starting point).
  - Specific OpenRouter model selection for analysis vs. Q&A.
- The PRD carries forward several research gaps worth keeping visible during build: no source in the research states a direct willingness to pay; liability-cap and rent-escalator red lines have the weakest evidentiary backing of the 11 categories; no verbatim lease- or ToS-specific pain quote exists in the research. None of these block v1, but they're why lease/ToS tuning was deferred and why no WTP prompt is being added yet.
- The trust principle recorded in the PRD for future billing work (cancellation must be one click, no dark patterns, no charging after a stated cancellation date) doesn't apply to this spec directly since billing is out of scope, but is worth carrying into whichever spec eventually adds it.
