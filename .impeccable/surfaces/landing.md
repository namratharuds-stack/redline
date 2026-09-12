---
version: 1
slug: "landing"
primary_target: "landing"
related_targets: []
---

---
version: 1
slug: "landing"
primary_target: "landing"
related_targets: []
---

# Landing page surface brief

## Scope and mode

Public route "/", logged-out visitors only (a logged-in visitor is routed past this to the authenticated app home page). Mode: Persuade.

## Audience, job, action

The reader named in PRD.md: a freelancer, independent contractor, or small-business owner about to accept a document they cannot negotiate from a position of strength (a vendor, contractor, lease, or partnership agreement). Job: decide whether this document is safe to sign. One offered action: try it on a document (routes to sign-up, then upload; no analysis runs without an account, per the earlier no-free-trial decision).

## Proof and content

Demonstrates exactly one thing: a contract turning into ranked flags, each showing the exact sentence it came from. Uses the real product name. No invented prices, customers, or quotes. No verdict on whether to sign, no legal advice claimed, no scanned/photographed documents, no document types outside contract/lease/freelance agreement/ToS.

## Constraints

No pricing or payment messaging anywhere. No testimonials, user counts, or unverifiable statistics; every claim traces to the product's actual mechanism, documented feature list, or PRD.md's cited research.

## Direction contract

THESIS: "Redline" already means one specific thing to anyone who has edited a contract: strikethrough, a colored insertion, a margin comment balloon. This surface builds that exact track-changes convention as the whole page, refusing both the prior bond-paper/flag-tab build and the category's clean SaaS dashboard-with-checkmarks.

OWN-WORLD: Cool near-white document canvas (#fdfdfc) inside a muted page ground (#f1f1ee), near-black ink (#111318). Severity spectrum (amber #b8860b low, burnt orange #c65a1e medium, red #b0271b high) rationed to strikethrough/insertion text, severity tags, comment-card indicator dots, and text actually tied to a real finding (e.g. underlining the exact clause phrase a Q&A answer quotes) — never generic chrome, nav, decorative bullets, or buttons. Named exception, carried over from the prior world's own documented rule: the wordmark's accent syllable ("Red**line**") is brand identity, not a severity signal, and keeps its red always. One UI accent blue (#2f6fb0) for the "Suggesting" mode pill and comment-thread reply bubbles. Two type families: Work Sans for all UI chrome and reading copy, Source Serif 4 reserved for text rendered as if it were the actual document (the hero's mock contract, and any real uploaded document elsewhere in the app). Components: an editor-window chrome bar (filename, "Suggesting" mode pill, toolbar), inline strikethrough+underlined-insertion markup on the document body, a margin comment rail with an avatar and a severity dot per comment.

STORY: The visitor recognizes the track-changes ritual from every contract review they've lived through. They understand Redline marks up their document the way a careful editor would: striking the risky clause, proposing exact replacement language, and leaving a comment on why — never paraphrasing, always showing the struck original next to the suggestion. They act: try it on their own document.

FIRST VIEWPORT: A compact intro column (headline, one-sentence mechanism explanation, primary CTA) occupies the left ~40%. The right ~60% is a live editor window: chrome bar with the file name and a "Suggesting" pill, a toolbar strip, the mock contract body with three real inline suggested edits (strikethrough original / underlined replacement, color-coded by severity), and a margin comment rail whose cards fade/slide in on load.

FORM: Track-Changes Redline — presented as "Impeccable's Pick" (the model's own top-ranked grounded candidate) alongside a fused-challenger "Redline Gauge" (instrument-panel dial world, sourced from a VU-meter/tachometer challenger, which beat the originally-rolled customs-inspection-tag direction on both audience-identification and product-clarity) and a competitive "Chain of Custody" alternate (museum-provenance-ribbon world). User reviewed real coded builds of both Track-Changes Redline and Redline Gauge (not comps — no image generation available this session) and chose Track-Changes Redline. Seed key a42db97d.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions

None outstanding. This direction now also governs global tokens in `app/globals.css`, so it is inherited by every other authenticated-app surface (home, library, red-lines, auth forms) via the shared CSS custom properties, not just this route.
