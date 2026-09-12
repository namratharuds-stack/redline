---
name: Redline
description: A document-review tool that marks up risky contract clauses the way a careful human editor would — strikethrough, colored insertion, margin comment.
colors:
  paper: "#f1f1ee"
  paper-deep: "#fdfdfc"
  paper-line: "rgba(17, 19, 24, 0.12)"
  ink: "#111318"
  ink-soft: "#55585f"
  ink-faint: "#8b8f97"
  flag-low: "#b8860b"
  flag-low-ink: "#fbf1d9"
  flag-medium: "#c65a1e"
  flag-medium-ink: "#fbe4d4"
  flag-high: "#b0271b"
  flag-high-ink: "#fbdcd8"
  badge-bg: "#eceef1"
  focus-ring: "#2f6fb0"
  accent-tint: "#f0f6fc"
typography:
  display:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    letterSpacing: "0.04em"
  manuscript:
    fontFamily: "Source Serif 4, serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  sm: "3px"
  md: "5px"
  lg: "8px"
  pill: "999px"
spacing:
  sm: "12px"
  md: "24px"
  lg: "48px"
  xl: "88px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#fff"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "#2a2c33"
  severity-tag:
    backgroundColor: "{colors.flag-medium-ink}"
    textColor: "{colors.flag-medium}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "5px 11px"
  mode-pill:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.focus-ring}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  revision-row:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "20px 22px"
---

# Design System: Redline

## Overview

**Creative North Star: "Track-Changes Redline"**

Redline's world is the track-changes ritual every reader has already lived through when reviewing a contract by hand: strikethrough on the risky original, a colored insertion proposing exact replacement language, and a margin comment explaining why — never a paraphrase, always the struck original sitting next to the suggestion. This replaces the prior "Sign-Here Flags" bond-paper/adhesive-flag-tab world outright; that world's ruled-paper texture, deckle edges, and physical page-flag tabs are retired, not extended. It also refuses the category's clean SaaS dashboard-with-checkmarks reflex: severity lives inline, in the markup itself, not in a chrome badge system bolted onto the side.

**Tokens are global; components are landing-specific.** The color and font custom properties documented below live in `app/globals.css` and are consumed app-wide (login, signup, home, library, red-lines all read the same `--color-*`, `--flag-*`, `--font-*` variables). Editing `globals.css` retheme the entire product, not just the landing page. Only the landing page (`app/page.tsx` + `app/landing.module.css`) got a bespoke component redesign in this pass — the editor-window hero, revision rows, comment thread, and settings-panel checklist. Every other authenticated surface kept its existing layout and only picked up the new palette/type at the chrome level (nav, buttons, cards, shadows) because it already ran on the shared token system. A future agent editing globals.css should expect that change to propagate everywhere; a future agent adding landing-specific components should not assume other surfaces have matching bespoke patterns yet.

**Key Characteristics:**
- Cool near-white document canvas floating inside a muted page ground — the "paper" is a deliberate two-tone system, not a single flat background.
- Severity color is rationed to the markup itself: strikethrough/insertion text, severity tags, comment-card dots, and text tied to an actual quoted finding. It never colors chrome, nav, decorative bullets, or buttons.
- One UI accent blue, used only for the editing-mode signal (the "Suggesting" pill) and reply-adjacent surfaces — never for severity.
- Two type families with a strict role split: Work Sans for everything that is the product's own voice, Source Serif 4 only for text meant to read as the actual uploaded document.

## Colors

The palette is a near-neutral document canvas with a rationed severity spectrum and one unrelated UI accent; almost the entire page is ink-on-paper.

### Primary
- **Severity Spectrum — Amber / Burnt Orange / Red** (`--flag-low` #b8860b, `--flag-medium` #c65a1e, `--flag-high` #b0271b, each paired with a light-tint background — `--flag-low-ink` #fbf1d9, `--flag-medium-ink` #fbe4d4, `--flag-high-ink` #fbdcd8): the only colors that carry meaning. Used on strikethrough/underline markup in the mock document, severity tags in the revision list, comment-card indicator dots, and the Q&A "not supported" chip. The `-ink` suffix is a semantic inversion from the retired world: there it meant dark text sitting on a solid color fill; here it means a pale tint used as the *background* under colored text.

### Secondary
- **Suggesting Blue** (`--focus-ring` #2f6fb0, on an `accent-tint` #f0f6fc wash): the single UI accent, used only for the "Suggesting" mode pill and its dot, the Q&A answer bubble background, and the keyboard focus ring. It is never used for severity, even though it visually could be mistaken for a fourth severity step — it never appears on struck/inserted text or severity tags.

### Neutral
- **Paper** (`--color-paper` #f1f1ee): the page ground, sitting behind every card and window.
- **Paper Deep** (`--color-paper-deep` #fdfdfc): the near-white document/card surface — the editor window, revision rows, comment thread panel.
- **Paper Line** (`--color-paper-line` rgba(17,19,24,0.12)): all hairline borders and section dividers.
- **Ink** (`--color-ink` #111318): primary text, the wordmark's non-accented syllable, primary button fill, checkbox fill.
- **Ink Soft** (`--color-ink-soft` #55585f): secondary/body copy — subheads, paragraph text, comment labels.
- **Ink Faint** (`--color-ink-faint` #8b8f97): tertiary text and, deliberately, decorative/structural marks that carry no finding — toolbar glyphs, metadata, and boundary-section bullets.
- **Badge Background** (`--badge-bg` #eceef1): the editor chrome bar fill and the Q&A question-bubble background.

### Named Rules
**The Severity Rationing Rule.** Severity color (amber/burnt-orange/red) is spent only on strikethrough text, underlined insertion text, severity tags, comment-card dots, and text tied to an actual quoted finding (e.g. the underlined phrase a Q&A answer cites). It never colors generic chrome, nav, decorative bullets, or buttons. A decorative list marker or boundary bullet reaching for red/orange/amber is a defect, not a stylistic escalation.

**The Wordmark Exception.** "Red" renders in ink, "line" renders in `--flag-high` red, on every page's nav and footer. This is a named, deliberate exception to the rationing rule above: it is brand identity, not a severity signal, and it keeps its red always — including on chrome that otherwise carries no severity color. Carried over verbatim from the retired world's own identical carve-out. Do not extend this exception to any other two-tone UI text; it is scoped to the wordmark only.

## Typography

**Body/UI Font:** Work Sans (with system-ui, sans-serif fallback)
**Manuscript Font:** Source Serif 4 (with serif fallback)

**Character:** A confident, slightly heavy sans (Work Sans at 700-800 weight for headlines) carries every UI surface; a classical serif is reserved exclusively for text that is standing in for a real uploaded document, so the reader always knows visually which words are "the document's" and which are Redline's own interface.

### Hierarchy
- **Display** (800, `clamp(2rem, 4vw, 3rem)`, line-height 1.1): the hero H1 only.
- **Headline** (800, `clamp(1.5rem, 2.4vw, 2rem)`, line-height 1.2): section headers (`## Every suggested edit...`, `## Ask it anything...`).
- **Body** (400, 1rem, line-height 1.55): base page copy, set on `body` in `globals.css`.
- **Label** (700, 0.68–0.78rem, uppercase, letter-spacing 0.04–0.06em): severity tags, the "Suggesting" pill, section eyebrows-free metadata like the toolbar's suggestion count and the settings-panel "starter"/"custom" tags.
- **Manuscript** (400, ~0.98rem, line-height 1.7, Source Serif 4): the mock contract body inside the editor window — letterhead, section title, and paragraph text with the inline strikethrough/insertion markup. This is the only place in the product's marketing surface where Source Serif 4 appears; it signals "this is the document," not "this is Redline talking."

### Named Rules
**The Two-Voice Rule.** Source Serif 4 renders only text that is standing in for the actual contract being reviewed. Every other piece of text on the page — headlines, buttons, labels, comments, Q&A answers — is Work Sans. Mixing the two outside that boundary breaks the document/interface distinction the whole world depends on.

## Layout

The page is a single centered column (`max-width: 1440px`) with fluid side padding (`clamp(20px, 4vw, 64px)`). The hero is a two-column grid weighted toward the editor window (`minmax(0,0.8fr) minmax(0,1.2fr)`), collapsing to a single column under 900px. Below the hero, content sections are full-width within the column, separated by a top hairline (`border-top: 1px solid var(--color-paper-line)`) and generous vertical rhythm (`clamp(48px, 7vw, 88px)` section padding). The revision list is a stacked set of rows on a 4-column grid (`88px 1.1fr 1.3fr 1fr`: severity tag, label, struck quote, suggested replacement) that collapses to one column on mobile. The Q&A/red-lines section is a 1:1 two-up grid, also collapsing to one column under 900px.

## Elevation & Depth

The system is nearly flat: cards and rows sit on hairline borders (`var(--color-paper-line)`), not shadow-driven separation. The one deliberate shadow is structural, not decorative: the editor window lifts off the page ground with a soft, wide ambient shadow (`box-shadow: 0 24px 48px -28px rgba(17, 19, 24, 0.28)`) to read as a floating document window, distinct from the flat cards around it.

### Shadow Vocabulary
- **Editor Window Lift** (`box-shadow: 0 24px 48px -28px rgba(17, 19, 24, 0.28)`): used exactly once, on the hero's editor-window container, to separate the "live document" from the page.

### Named Rules
**The One-Shadow Rule.** Only the editor window casts a shadow. Every other card, row, and panel (revision rows, comment thread, settings panel) is flat, separated by a 1px `--color-paper-line` border instead. A second drop-shadow elsewhere in the system is scope creep, not polish.

## Shapes

Corners are modest and consistent: 3px on small chips and comment cards, 5px on revision rows, 6px on the thread panel, 8px on the editor window (the largest surface gets the largest radius). Borders are always the same hairline (`1px solid var(--color-paper-line)`) rather than varying by component weight. The mode pill and severity tags use full pill radius (999px) and small radius (3px) respectively — the pill shape is reserved for state/mode indicators, not for severity, which stays rectangular.

## Components

### Buttons
- **Shape:** 4px radius (`border-radius: 4px` on `.ctaPrimary`).
- **Primary:** ink background (`var(--color-ink)`), white text, 600 weight, `14px 24px` padding, paired with the upload-arrow icon.
- **Hover:** background shifts to a near-ink hover shade (`#2a2c33`, tokenized post-finish-review — see Do's and Don'ts) with a 1px lift (`translateY(-1px)`).
- **Sign-in link:** ghost-style text link, ink-soft color, underline appears only on hover.

### Chips / Tags
- **Severity Tag:** light-tint background + colored text in the same hue (e.g. `--flag-medium-ink` background, `--flag-medium` text), uppercase label type, 3px radius. Used in the revision list and the Q&A "Not in this document" chip.
- **Mode Pill:** pill-shaped, `accent-tint` background, `focus-ring` blue text, small dot indicator — used once, for "Suggesting."
- **Settings Tag:** plain ink-faint uppercase text, no background — used for "starter"/"custom" labels in the red-lines checklist, deliberately unstyled to stay out of the severity-color budget.

### Cards / Containers
- **Editor Window:** `paper-deep` background, hairline border, 8px radius, the system's one lift-shadow. Contains a chrome bar (`badge-bg` fill), a toolbar strip, and a two-column body (document canvas + comment rail).
- **Comment Card:** `paper-deep` background, hairline border, 3px radius, fades and slides in from the right on mount (`opacity 0→1`, `translateX(6px)→0`, 420ms ease), gated under `prefers-reduced-motion: reduce` (motion disabled, end state shown immediately).
- **Revision Row:** `paper-deep` background, hairline border, 5px radius, 4-column layout.
- **Thread / Settings Panel:** `paper-deep` background, hairline border, 6px radius; the settings panel renders as a checkbox list (ink-filled checkbox with a white checkmark; a dashed-outline empty state for "+ Add your own").

### Inputs / Fields
- No text inputs appear on the landing page itself; the only interactive controls are links styled as buttons and the (non-interactive, illustrative) checkbox list.

### Navigation
- **Style:** flat row, wordmark left, single "Sign in" link right, no background, sits above the hero with generous top/bottom padding. No hover states beyond the sign-in link's underline; no active/current-page treatment since this is a single-route landing page.

### Signature Component: The Editor Window
The hero's centerpiece and the world's clearest expression of the thesis. A chrome bar carries the filename, a "sample document" meta note, and the Suggesting mode pill (right-aligned). A toolbar strip below it shows inert B/I/U glyphs and a live suggestion count. The body splits into the mock contract (Source Serif 4, with real inline strikethrough-original/underlined-replacement markup color-coded by severity) and a margin comment rail (avatar circle + "Redline" name + a severity-colored dot per card). This component's markup pattern — struck original, colored insertion, comment with a severity dot — is the one signature device that should be reused verbatim anywhere else in the product that shows a flagged clause (e.g. the authenticated app's own flag view), not reinvented per surface.

## Do's and Don'ts

### Do:
- **Do** ration severity color (amber/burnt-orange/red) to strikethrough text, underlined insertions, severity tags, comment dots, and text tied to an actual quoted finding — nothing else.
- **Do** keep the wordmark's two-tone red as the one named exception to that rule; it is brand identity, not a finding.
- **Do** render any text standing in for an uploaded document in Source Serif 4, and everything else in Work Sans.
- **Do** treat the editor window as the only shadow-casting surface; everything else stays flat with a hairline border.
- **Do** gate the comment-card entrance animation under `prefers-reduced-motion: reduce`.
- **Do** remember that `app/globals.css` tokens are consumed by every authenticated surface, not just this landing page — a token edit here is an app-wide retheme.

### Don't:
- **Don't** color a decorative or structural list marker (boundary-section bullets, generic nav dividers) with severity color. The boundary section's bullets are deliberately neutral (`var(--color-ink-faint)` squares) — this was a finish-review fix from an earlier draft that used red bullets there, and the fix, not the earlier defect, is the standing rule.
- **Don't** hardcode a hover or accent color as a literal hex outside the token set. The primary-button hover was briefly a leftover literal from the retired bond-paper world (`#46443d`); it is now `#2a2c33`, defined once and reused, not reintroduced as a one-off value in any component file.
- **Don't** reuse the retired world's ruled-paper texture, deckle edges, or adhesive page-flag tabs. That world is fully retired, not a fallback style.
- **Don't** add a second drop-shadow elsewhere in the system to make a component feel "important." Use a hairline border instead.
