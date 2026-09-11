# Redline — PRD

Brief for v1. Written from `research/summary.md` and the grilling session that followed it (see decisions cited inline as Q1–Q7). Sources are the four files in `research/`.

## Who this is for, specifically, and what they do today instead

Freelancers, independent contractors, and small-business owners/founders signing vendor, contractor, lease, and partnership agreements. This is the only segment the research found actual market-interest signal for — builders of similar AI contract-review tools reporting real demand from this group, not just legal-cost data:

> "Most small business owners... don't think in terms of 'contract analysis'" but ask "Am I about to sign something that could cost me money later?"
— Indie Hackers (https://www.indiehackers.com/post/what-happened-after-my-ai-contract-tool-post-got-70-comments-e89c3756b5)

Today they either skip review entirely or overpay for it:

> "Most small business owners I've talked to either skip reading contracts entirely or pay a lawyer $300/hr for something that should take 10 minutes."
— Indie Hackers (https://www.indiehackers.com/post/i-built-an-ai-contract-analysis-tool-for-smbs-looking-for-feedback-ae432411d6)

Flat-fee lawyer review runs $250–$750 for a standard contract, $500–$5,000 for a lease (`research/who-would-pay.md`). The improvised free alternative is pasting the document into ChatGPT or ChatPDF, which comes with no severity ranking, no counter-offer, and a documented hallucination problem (`research/what-already-exists.md`).

Secondary: small landlords and tenants reviewing leases — a real, bounded task people already pay discretely for, though no source contains a direct quote from someone in this segment specifically (`research/who-would-pay.md`).

Not who v1 is tuned for, and why: job-offer negotiators (a Blind thread found lawyer review of offer letters is seen as worth it mainly at senior/executive level — one commenter called it something people do to "stroke your ego and shell out a few grand"), gig-platform workers, and procurement staff reviewing vendor ToS — no evidence of pain or willingness-to-pay was found for either of the last two despite being searched for directly (Q3, `research/who-would-pay.md`).

## The problem

People sign agreements containing terms that cost them money later, and don't notice the term until it's too late to renegotiate.

> "This clause effectively put some freelancers out of work, because they simply did not know that the non-compete clause they had signed was illegal."
— Colleen Doran, on freelance contracts with non-competes running "up to seven years" (https://colleendoran.substack.com/p/the-none-compete-clause)

> "No place is it mentioned, that there are a hidden forced $125 subscription"
— Trustpilot review of FIXD (https://www.trustpilot.com/review/fixd.com)

The second quote is about a consumer hardware subscription, not a freelance or lease document — it's included because auto-renewal/cancellation-trap clauses are the best-quantified consumer harm the research found (42% of Americans report cancellation difficulty; FTC sued LA Fitness over cancellation obstruction; BBB free-trial complaints doubled 2015–2017), even though the verbatim quotes for it skew toward gym/hardware subscriptions rather than the freelance/lease scenario Redline targets (`research/who-has-this-pain.md`, `research/what-goes-wrong.md`). The gap between "best-evidenced harm" and "harm evidenced in our specific target segment" is real and is called out again below, not smoothed over.

The people who most need a plain-English read of what they're signing are the ones priced out of getting one — lawyer review costs more than the document is worth to review "for something that should take 10 minutes."

## What the first version does

1. Accept an uploaded contract, lease, freelance agreement, or ToS. The file is parsed in the browser; only extracted text is stored, the raw file never is.
2. Produce a plain-English summary of the document.
3. Flag clauses matching the red-lines list below. Each flag shows its exact source sentence from the document and a severity rating judged from that document's own text — not a fixed severity default per clause category (Q5).
4. Draft a counter-offer for each flagged clause.
5. Answer questions in a Q&A box using only the uploaded document's text — no answer may state anything the text doesn't support.
6. Maintain an editable red-lines list that drives which clauses get flagged. It ships pre-populated with freelance/small-business-relevant starter red lines (scope creep, IP assignment, non-compete, indemnification, personal guarantees, auto-renewal, arbitration); the user can add, remove, or edit any entry (Q7).
7. Save a library of the user's past documents.
8. Onboarding walks through a freelance-contract example as the primary sample document, with a lease example reachable as a secondary example, not hidden (Q7).
9. Track document-type distribution and self-identified persona (where the flow asks) as passive usage analytics — no in-product payment prompt, no billing (Q6).

Nothing beyond this list ships in v1.

## What good looks like

- **Every flag cites its source.** 100% of flags include a verbatim substring of the uploaded document's extracted text as the shown source sentence. A flag that can't be matched back to the document text is a bug (existing rule, `docs/adr/0001-every-flag-cites-its-source.md`).
- **Nothing stated isn't supported by the text.** Run a labeled eval set of documents with known content; no summary sentence, flag description, counter-offer, or Q&A answer should contain a claim that doesn't trace to a substring in that document. This is the specific failure mode competitors are already criticized for — Spellbook, LegalOn, and Lexion reviews cite "occasionally glitches," "false positives," and "AI accuracy... improvements are needed" as their most common complaints (`research/what-already-exists.md`). Matching or beating that bar is the test, not a hypothetical.
- **Coverage across the 11 red-line categories.** Build a labeled test set — real or representative clauses for each of the 11 categories below — and measure detection rate per category. A category with a near-zero detection rate on its own test clauses means the flag logic for that category doesn't work, independent of how rare the clause is in the wild.
- **Low false-positive rate.** Run the same detector against documents/clauses that do *not* match a red line and confirm it doesn't flag them. A tool that over-flags trains users to ignore it, which defeats the point as much as under-flagging does.
- **Severity ranking is legible, not just present.** Because severity is judged per-document rather than defaulted by category (Q5), there's no guarantee an arbitration clause always ranks "high." Test this by having a knowledgeable reviewer rank a benchmark set of documents' clauses by severity and checking the tool's ranking correlates with that human ranking — not by checking against the category evidence-ranking from research, which was explicitly rejected as the severity mechanism.

## My red lines

The v1 flag list is 11 categories, ranked here by strength of evidence found (not by a promise that severity output follows this order — see Q5 above). Arbitration/class-action waiver is added and unilateral termination is dropped from the original proposed list, because the evidence for each pointed the opposite direction from where they'd been placed (Q2).

1. **Arbitration / class-action waiver.** Buries a "you can't sue us, can't join a class action" clause in fine print, pushing disputes into individual arbitration where the economics discourage small claims. The single best-quantified harm in the entire research pass: ~826 million active U.S. consumer arbitration agreements as of 2018, but only ~411 claims/year actually filed across six major financial product categories, and consumers win relief in only ~9% of disputes — evidence the clause suppresses claims rather than resolving them. 60M+ non-union employees are bound by it (`research/what-goes-wrong.md`, Center for Justice & Democracy; Impact Fund).
2. **Auto-renewal / hard-to-cancel subscription.** Easy signup, deliberately obstructed cancellation. FTC sued LA Fitness/Esporta/City Sports Club alleging cancellation required printing a form and mailing it, or appearing in person 9am–5pm at gyms open 19 hours a day, with staff trained to refuse phone/email cancellation; "tens of thousands" of customers complained. 42% of Americans report cancellation difficulty; BBB free-trial complaints doubled 2015–2017 (`research/what-goes-wrong.md`).
3. **Personal guarantee.** A business owner signs "as guarantor" — if the business defaults, the landlord/creditor can go after personal assets once business assets are exhausted. Consistent pattern across independent legal sources describing this as a routine outcome of small-business leasing, though no aggregate complaint count exists — evidence is pattern-consistency across law-firm accounts of actual lawsuits, not a statistic (`research/what-goes-wrong.md`).
4. **Scope creep / unlimited revisions.** Vague scope language lets a client demand endless "revisions" or withhold final payment. One of the two most recurring complaint categories in an analysis of r/freelance and r/Upwork threads: "approved the design, [freelancer] sent the final files, then they claimed they wanted revisions not covered in our agreement and refused to pay the final 50% until [the freelancer] made unlimited changes" (`research/what-goes-wrong.md`, PainPointMap).
5. **Non-compete.** Restricts a worker's ability to take a new job or start a competing business, sometimes imposed on people with little bargaining power to negotiate it away. "This clause effectively put some freelancers out of work, because they simply did not know that the non-compete clause they had signed was illegal" — non-competes running "up to seven years" in freelance/illustration contracts (`research/who-has-this-pain.md`, Colleen Doran). FTC enforcement continues case-by-case since its 2024 blanket rule was vacated.
6. **IP assignment ambiguity.** Under default law, a freelancer owns what they create unless a valid assignment (not just a "work for hire" label, which doesn't legally apply to many categories of creative work) transfers it. Independent legal-practice sources converge on ambiguous assignment language as a frequent driver of ownership disputes ending in litigation or arbitration (`research/what-goes-wrong.md`).
7. **Indemnification.** A broadly worded clause can make a freelancer or small business responsible for funding another party's legal defense before fault is determined — often uninsured, since many liability policies exclude contractual indemnification. Cited example: a content writer becomes financially responsible for a defamation lawsuit brought against the client who published their article. High-severity-when-it-hits by consistent law-firm account, but the sourcing is educational/anecdotal, not a complaint count (`research/what-goes-wrong.md`).
8. **Liability cap.** A vendor caps its financial exposure (commonly 12 months of fees paid), leaving the customer under-compensated if the vendor's failure causes larger damages. **Weakest sourcing of the categories kept**: evidence here is doctrinal/advisory — how courts tend to view such caps — not a documented complaint or lawsuit (`research/what-goes-wrong.md`). Kept because the mechanism is well-established in contract law even without a forum complaint pattern behind it; flagged here so that's not silently assumed.
9. **Fee / rent escalator.** Rent tied to CPI, fixed annual increases, or pass-through charges can push costs up unpredictably, sometimes doubling over a lease term. Documented as a recognized category of lease dispute ("escalation claim") centered on how the increase was calculated, not quantified by frequency (`research/what-goes-wrong.md`).
10. **Early termination penalty.** Breaking a lease early can trigger liability for remaining rent, liquidated damages, and sometimes punitive damages, with disputes often turning on whether the landlord mitigated by re-leasing. Standard, recurring landlord remedy per legal-practice sources, not quantified (`research/what-goes-wrong.md`).
11. **Data/privacy rights grab.** ToS grants a platform broad, sometimes perpetual rights to user content and data, or "consent" to tracking via fine print no one reads. Cambridge Analytica (Facebook sharing ~87 million users' data without adequate consent) is the landmark cited example, plus a general rising trend of privacy-notice/ToS language being used as the basis for breach-of-contract claims (`research/what-goes-wrong.md`).

**Dropped: unilateral termination (SaaS/ToS)** — a vendor terminating an account "in its sole discretion," no cure period. Explicitly the weakest-evidenced of all 12 categories studied: no specific lawsuit, complaint statistic, or forum thread was found to confirm real-world frequency, only legal-literature discussion of the mechanism (`research/what-goes-wrong.md`). Dropped in favor of arbitration, which had the opposite evidence problem — real harm, but wasn't on the original list (Q2).

## The calls I made and what I gave up

**Proceeded to PRD without closing the research gaps (Q1).** Chose against commissioning more research to get a direct "I would pay $X" quote, working Reddit/HN access, or a verbatim lease/ToS pain quote before locking these decisions. Worse off: whoever has to discover — in production, with real build cost already spent — that the freelance-segment thesis or a specific red-line category doesn't hold, instead of finding that out from research before writing code.

**Swapped arbitration in, unilateral termination out (Q2).** Chose against covering SaaS accounts that actually do get unilaterally suspended without a cure period — a real mechanism, just not evidenced by a specific case in this research pass. Worse off: any user whose SaaS ToS gets terminated unilaterally in a way that harms them; Redline won't flag the clause that let it happen, even though it's plausible, because it lost out to a category with stronger evidence.

**Severity judged per-document, not defaulted by evidence strength (Q5).** Chose against guaranteeing that categories with the strongest documented real-world harm (arbitration, auto-renewal) always rank as high severity. Worse off: a user whose document contains an arbitration clause that reads as syntactically unremarkable in context — the model may rate it moderate rather than high, because it's judging the text in front of it, not the external statistic that arbitration clauses suppress 91% of valid claims. A genuinely dangerous but boilerplate-looking clause could rank lower than its real-world harm justifies.

**Freelance-first tuning, without narrowing document-type acceptance (Q3, Q7).** Chose against giving lease and ToS users an equally tailored v1 experience. Worse off: a landlord/tenant or ToS-reviewing user in v1 — the product still works for them, but they get a generic secondary onboarding example and no lease/ToS-specific starter red lines, while freelance users get both.

**Passive usage tracking only, no WTP prompt (Q6).** Chose against getting a direct, per-user stated-willingness-to-pay signal, which is exactly the evidence gap the research flagged as missing. Worse off: whoever eventually has to make the pricing decision — they'll be working from inferred signal (usage patterns, document-type mix) rather than a stated number, and will likely need a separate pricing study before setting a price.

**Pricing deferred entirely; only a trust principle recorded (Q4).** Chose against making any monetization decision now, consistent with CLAUDE.md ruling out payments/billing for this version. Worse off: no one in the near term — but whoever eventually builds billing is the one who inherits the risk if this note isn't kept visible: DoNotPay and Rocket Lawyer's worst complaints are billing/cancellation trust failures, not accuracy failures ("I canceled in March 2024 still being charged in 2025... charged twice per month at $36 each" — DoNotPay, Trustpilot), and a product selling protection from exactly that pattern will be judged partly on whether its own billing is exemplary. **Principle for whenever billing is built: cancellation must be one click, no dark patterns, no charging after a stated cancellation date.**

## What we are not building, and why

- **Payments/billing** — out of scope this version (CLAUDE.md). See the trust-principle note above for what to carry forward when it is built.
- **OCR for scanned documents** — excluded on purpose: "a citation pointing at misread text is worse than no citation" (CLAUDE.md). This is a direct consequence of the source-citation rule (`docs/adr/0001-every-flag-cites-its-source.md`) — OCR errors would produce a flag whose "exact source sentence" isn't actually what the document says.
- **Sharing a document between users** — out of scope this version (CLAUDE.md).
- **A "would you pay for this" payment prompt** — considered and rejected in favor of passive usage tracking (Q6); would have been the fastest way to close the WTP evidence gap but wasn't judged worth the friction.
- **Evidence-weighted severity defaults per clause category** — considered and rejected (Q5); would have made arbitration/auto-renewal reliably rank high, but conflicts with judging severity from the document's own text.
- **Unilateral termination clause detection** — dropped from the original clause list (Q2); see red-lines section above.
- **Lease- or ToS-specific starter red lines and dedicated onboarding parity** — freelance/small-business gets the tuned defaults in v1; lease and ToS remain fully functional but untuned (Q3, Q7).
- Anything else not in the numbered feature list above — per CLAUDE.md, ask before building it.

## What the research could not tell us

- **No one in any source stated a direct willingness to pay.** Every price signal is inferred — either from what people already pay lawyers ($250–$750 flat, $300–$500/hr) or from adjacent competitors' live pricing ($9–$150 one-time, $7.99/wk–$49.99/yr). No prospective buyer said "I would pay $X for an AI contract tool" (`research/who-would-pay.md`).
- **Reddit and Hacker News — the platforms specifically asked for — were inaccessible to the research tooling** (blocked fetches, HTTP 429s). The sourced quotes that exist came from Trustpilot and BBB instead, which skew toward consumer subscription/membership harm (gyms, hardware add-ons) rather than the freelance/lease/ToS document-review scenario Redline is built around. Only 2 of 8 pain-point findings in `who-has-this-pain.md` are actually about a freelance-style negotiated agreement; none is a verbatim quote about a lease or a SaaS ToS specifically.
- **No verbatim lease-clause pain quote from an actual tenant, and no SaaS-ToS-clause horror story with a verbatim quote, exist in the research** — searched for directly, not found (`research/who-has-this-pain.md`).
- **No evidence at all for gig-platform workers or for procurement staff/SaaS buyers as paying segments** — both were searched for and came back empty (`research/who-would-pay.md`).
- **No apples-to-apples frequency ranking exists across the 11 (now 12, minus the one dropped) clause categories.** Only arbitration and auto-renewal have real quantitative complaint/prevalence data; everything else is ranked by consistency of qualitative evidence, not a shared metric. Treat the ranking in "My red lines" as impressionistic below category #2, not measured (`research/what-goes-wrong.md`).
- **Liability caps and unilateral termination are backed by doctrinal/legal-literature reasoning, not a documented complaint or lawsuit** — the weakest two categories evidentially, one kept (liability caps) and one dropped (unilateral termination) (`research/what-goes-wrong.md`).
- **An unsourceable "82% of small business owners are concerned about liability" statistic surfaced only as an AI-search-engine summary line** with no traceable primary source — not used as a finding anywhere in this document (`research/who-would-pay.md`).
- **No FTC/state-AG dataset breaks down complaint volume by clause type** — the auto-renewal and arbitration statistics come from different sources measuring different things, not a single comparable dataset (`research/what-goes-wrong.md`).
