---
version: 1
slug: "app-shell"
primary_target: "app-shell"
related_targets: []
---

---
version: 1
slug: "app-shell"
primary_target: "app-shell"
related_targets: []
---

# App shell surface brief

## Scope and mode

Authenticated app shell, behind sign-in. The frame holding: paste/upload a document, the result (summary, ranked flags, counter-offers), the question box, the reader's red lines, and the library. Mode: Operate. Brief only — the rich flag-index/document-view design below is still unbuilt; only its shared chrome (nav, buttons, cards, type) has been retouched, via the global tokens, to match the landing page's new world.

## Task, states, frequency, constraints

A signed-in user pastes or uploads a document, waits through parsing/analysis, then works a document that stays visible the whole time: flags pinned to it, a flag index to scan, a question box scoped to that document, their own red-lines list driving what gets flagged, and a library to return to past documents. Most frequent return action: reopening a past document from the library, not rereading the whole contract. Constraints inherited from PRD.md/spec.md: every flag shows its exact source sentence; no claim beyond what the document's text supports; no way to analyze without an account.

## Direction contract

THESIS: The app shell is the landing page's track-changes ritual made interactive: upload a document, watch Redline mark it up in place, work through the suggested edits, ask questions, and keep your own red-lines list, all inside one frame that never abandons the document itself.

OWN-WORLD: Inherits the landing page's (`/`) tokens verbatim via `app/globals.css` — cool near-white surfaces (`--color-paper`, `--color-paper-deep`), near-black ink, a three-step severity spectrum (amber/burnt-orange/red) rationed to markup and status indicators only, one UI accent blue for interactive/"live" states, Work Sans for UI chrome, Source Serif 4 reserved for any text rendered as if it were the actual document. Physical flag-tab and stamped-caps components from the prior bond-paper world are retired; an eventual full build of this surface should use the same strikethrough/insertion/comment-card vocabulary as the landing page, not reintroduce flag tabs.

STORY: While parsing/analyzing, the frame shows the document arriving to have suggested edits marked up in place (a working state, not a blank spinner). Once done, the frame holds five coordinated regions without ever hiding the source document: the document with its markup in place; a revision list (each edit's severity, struck original, and suggested replacement, presented cleanly); a question box scoped to just this document; the reader's own red-lines list; and the library of past documents.

FIRST VIEWPORT: The document with its markup occupies the dominant region at all times, never scrolled out of view while working an edit. The revision list runs as a rail beside it, each row a severity tag plus finding plus suggested replacement; selecting a row highlights its markup in the document. The red-lines list and question box are reachable from the same frame (a tab or panel), not a separate page. The library sits one level up as a return point, not competing with the document for the same viewport.

FORM: Inherits Track-Changes Redline (chosen over Redline Gauge and Chain of Custody on the landing page's direction round), seed key a42db97d. No separate concept-seed round run for this surface; it inherits the landing page's chosen world rather than running its own.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. Deferred: this surface's own build (the revision list, live document markup, Q&A panel, red-lines editor) has not happened yet; only its shared chrome inherited the new tokens today.

## Unresolved decisions

- Exact revision-list rail placement (left vs. right) at narrow viewports.
- Whether the red-lines list and Q&A live as tabs, a slide-over panel, or split-view.
- The brief's phrase "clean verdict" is interpreted here as the suggested-replacement/outcome portion of the revision list presented clearly, not a new sign/don't-sign verdict feature, since PRD.md explicitly excludes a verdict on whether to sign. Flagged for confirmation before this surface is built.
