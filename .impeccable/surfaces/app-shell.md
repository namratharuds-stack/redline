---
version: 1
slug: "app-shell"
primary_target: "app-shell"
related_targets: []
---

# App shell surface brief

## Scope and mode

Authenticated app shell, behind sign-in. The frame holding: paste/upload a document, the result (summary, ranked flags, counter-offers), the question box, the reader's red lines, and the library. Mode: Operate. Brief only — no build this session.

## Task, states, frequency, constraints

A signed-in user pastes or uploads a document, waits through parsing/analysis, then works a document that stays visible the whole time: flags pinned to it, a flag index to scan, a question box scoped to that document, their own red-lines list driving what gets flagged, and a library to return to past documents. Most frequent return action: reopening a past document from the library, not rereading the whole contract. Constraints inherited from PRD.md/spec.md: every flag shows its exact source sentence; no claim beyond what the document's text supports; no way to analyze without an account.

## Direction contract

THESIS: The app shell is the landing page's flag-tab ritual made interactive: upload a document, watch flags attach to it in place, work through the flag index, ask questions, and keep your own red-lines list, all inside one frame that never abandons the document itself.

OWN-WORLD: Inherited verbatim from the landing page (`/`) brief, same visual world, one direction round covering both surfaces. Bond-paper ivory ground (#f4efe6), graphite ink (#2b2b28), severity spectrum rationed to flag tabs and status chips only: flag-yellow #e8c93a (low), flag-orange #e2793a (medium), flag-red #c23b2e (high). Stamped caps face for tab labels and case-file metadata; plain sans for reading copy. Physical flag-tab and flag-index components; dotted leader lines from a tab to its exact quoted sentence.

STORY: While parsing/analyzing, the frame shows the document arriving to have flags pinned to it (a working state, not a blank spinner). Once done, the frame holds five coordinated regions without ever hiding the source document: the document with its flag tabs in place; the flag index (each flag's severity, quoted sentence, and drafted counter-offer, presented cleanly); a question box scoped to just this document; the reader's own red-lines list; and the library of past documents.

FIRST VIEWPORT: The document with its flag tabs occupies the dominant region at all times, never scrolled out of view while working a flag. The flag index runs as a rail beside it, each row a flag-tab-colored chip plus finding plus counter-offer; selecting a row highlights its tab on the document. The red-lines list and question box are reachable from the same frame (a tab or panel), not a separate page. The library sits one level up as a return point, not competing with the document for the same viewport.

FORM: Inherits Sign-Here Flags (Impeccable's Pick), seed key 48161e5b. No separate concept-seed round run for this surface; this direction round explicitly covers both surfaces at once, per the requester's instruction.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. Deferred: this surface is brief-only today; the finish line applies whenever its build session runs.

## Unresolved decisions

- Exact flag-index rail placement (left vs. right) at narrow viewports.
- Whether the red-lines list and Q&A live as tabs, a slide-over panel, or split-view.
- The brief's phrase "clean verdict" is interpreted here as the counter-offer/outcome portion of the flag index presented clearly, not a new sign/don't-sign verdict feature, since PRD.md explicitly excludes a verdict on whether to sign. Flagged for confirmation before this surface is built.
