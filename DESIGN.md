---
name: Redline
description: A document-review tool that flags risky contract clauses with the exact same physical adhesive page-flag a closing agent sticks where you need to initial.
colors:
  paper: "#f4efe6"
  paper-deep: "#ece3cf"
  paper-line: "rgba(43, 43, 40, 0.14)"
  ink: "#2b2b28"
  ink-soft: "#6b6455"
  ink-faint: "#6e6656"
  flag-low: "#e8c93a"
  flag-low-ink: "#4a3c0a"
  flag-medium: "#e2793a"
  flag-medium-ink: "#3a1f08"
  flag-high: "#c23b2e"
  flag-high-ink: "#fdf3ea"
  badge-bg: "#fbf7ec"
  focus-ring: "#a8461f"
typography:
  display:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 4.4vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)"
    fontWeight: 800
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Special Elite, Courier New, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    letterSpacing: "0.03em"
rounded:
  sm: "2px"
  md: "4px"
  lg: "6px"
  pill: "999px"
spacing:
  sm: "14px"
  md: "24px"
  lg: "48px"
  xl: "88px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "15px 26px"
  button-primary-hover:
    backgroundColor: "#46443d"
  severity-chip:
    backgroundColor: "{colors.flag-low}"
    textColor: "{colors.flag-low-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  finding-row:
    backgroundColor: "#fbf8f0"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "22px 24px"
---

# Design System: Redline

## Overview

**Creative North Star: "Sign-Here Flags"**

Redline's world is a closing table, not a dashboard. The document under review is rendered as literal bond paper — ruled lines, a jittered deckle edge, ink-soft type — and every risky clause gets the same plastic page-flag a closing agent sticks where you need to initial: a two-part tab (colored tip, numbered badge, label plate) that physically juts off the page's edge. The system refuses the category's clean SaaS dashboard-with-checkmarks reflex; severity lives on the paper, not in the chrome.

The palette stays disciplined on purpose: bond-paper ivory and graphite ink carry the whole page, and the three-step severity spectrum (yellow/orange/red) is rationed strictly to flag tabs, severity chips, and the document's quoted-sentence highlight. It never bleeds into buttons, nav, or backgrounds. Confirmed rejection: a border-left accent pattern was tried for the findings list and rejected mid-build in favor of a full pill-shaped severity chip — the border-left device is not part of this system.

Two typefaces do the whole job: Public Sans for reading copy (confident, plain, legible at length) and Special Elite — a stamped/typewriter face — reserved for flag-tab labels, severity chips, and document case-file metadata, where its stamped character reads as "this was marked by hand," not as a system default.

**Key Characteristics:**
- Bond-paper ivory ground with graphite ink, never a white-and-gray SaaS surface.
- Severity color (yellow/orange/red) rationed to flags and quoted highlights only — chrome stays neutral.
- Every flagged claim shows its exact source sentence, underlined by the severity color inline in the document.
- A stamped/typewriter face marks metadata and flags; a plain sans carries reading copy.
- One authored motion moment (flag-tab peel-in), gated by reduced-motion.

## Colors

The palette is a two-layer system: a neutral bond-paper/graphite base that carries all chrome and reading copy, plus a three-step severity spectrum that appears only on the physical flag apparatus.

### Primary
- **Graphite Ink** (`#2b2b28`, `--color-ink`): body text, headings, primary button fill.

### Secondary (severity spectrum — flags only)
- **Flag Yellow** (`#e8c93a`, `--flag-low`, ink `#4a3c0a`): low-severity flag tips, chips, and quoted-sentence highlights.
- **Flag Orange** (`#e2793a`, `--flag-medium`, ink `#3a1f08`): medium-severity flag tips, chips, highlights; also the text-selection color.
- **Flag Red** (`#c23b2e`, `--flag-high`, ink `#fdf3ea`): high-severity flag tips, chips, highlights, and the wordmark's accent syllable ("line" in "Redline").

### Neutral
- **Bond Paper** (`#f4efe6`, `--color-paper`): page background.
- **Deep Paper** (`#ece3cf`, `--color-paper-deep`): preview/callout panel fill, one step deeper than the page ground.
- **Paper Line** (`rgba(43,43,40,0.14)`, `--color-paper-line`): hairline borders, ruled-line texture, dashed dividers.
- **Ink Soft** (`#6b6455`, `--color-ink-soft`): secondary copy, sub-heads, quotes. Tuned to hold 4.5:1 against both `--color-paper` and `--color-paper-deep`.
- **Ink Faint** (`#6e6656`, `--color-ink-faint`): tertiary labels, footer copy, captions. Also tuned to 4.5:1 against the paper tones in use, including `--color-paper-deep` — treat as load-bearing, not arbitrary.

### Named Rules
**The Flags-Only Rule.** The severity spectrum (yellow/orange/red) never touches page chrome, navigation, or buttons. It is rationed to three surfaces only: the flag tab tip, the severity chip, and the document's quoted-sentence highlight. A button or nav element rendered in flag-orange or flag-red is off-system.

## Typography

**Body Font:** Public Sans (with system-ui, sans-serif fallback)
**Label/Mono Font:** Special Elite (with Courier New, monospace fallback)

**Character:** A confident, plain reading face paired with a stamped typewriter face reserved for anything that represents a mark made on the document — labels, metadata, severity — never for prose.

### Hierarchy
- **Display** (800, `clamp(2.2rem, 4.4vw, 3.4rem)`, line-height 1.06): the hero headline only.
- **Headline** (800, `clamp(1.6rem, 2.6vw, 2.1rem)`, line-height 1.18): section heads.
- **Title** (700, 1.15rem): document mock title, finding labels.
- **Body** (400, 1rem–1.15rem, line-height 1.55–1.6): paragraph copy, Q&A answers, max ~42–68ch.
- **Label** (400 Special Elite, 0.68–0.85rem, letter-spacing 0.01–0.06em, uppercase where used): flag-tab labels, severity chips, document case-file metadata (e.g. the letterhead line above a document heading), footer tags.

### Named Rules
**The Stamped-Metadata Rule.** Special Elite marks anything that represents an artifact of the document or its markup (flag labels, severity chips, case-file metadata) — never body prose and never a page-level kicker/eyebrow above a real heading. The one small-caps label that appears above a heading in this build ("FREELANCE DESIGN AGREEMENT" above "4. Term and Termination") is a letterhead inside the depicted document artifact, not a kicker; a true kicker over a live page heading is not part of this system.

## Layout

Single max-width container (1440px) with fluid side padding (`clamp(20px, 4vw, 64px)`). The hero is a two-column grid biased toward the document mock (`0.85fr` copy / `1.15fr` document) that collapses to a single stacked column under 900px, with the document reordered above the copy. Section rhythm runs on a `clamp(48px, 7vw, 88px)` vertical pad with a hairline top border per section. Two-column patterns (findings-adjacent Q&A/red-lines, boundary statement/list) collapse to one column at the same 900px breakpoint. Findings rows use a 4-column grid (`88px 1.1fr 1.3fr 1fr`) for chip / label / quote / counter-offer, collapsing to a single column under 900px.

## Elevation & Depth

Hybrid: the page is mostly flat (bond-paper ground, hairline borders), with soft ambient shadows reserved for objects that should read as physically resting on or hovering above the page — the document sheet, flag tabs, the primary CTA, and findings-list cards. Shadows are diffuse and warm-toned (`rgba(43,43,40,…)`), never hard-edged; this is not a neobrutalist world, so no offset/hard-edge shadow is used anywhere.

### Shadow Vocabulary
- **Document lift** (`0 30px 60px -30px rgba(43,43,40,0.4), 0 2px 0 rgba(43,43,40,0.05)`): the bond-paper sheet resting above the page.
- **Tab rest** (`3px 4px 10px -4px rgba(43,43,40,0.45)`): a flag tab at rest, jutting off the document edge.
- **Tab active** (`5px 6px 14px -4px rgba(43,43,40,0.55)`, paired with `translateX(-6px) scale(1.04)`): a flag tab on hover, peeling further off the page.
- **Card rest / hover** (`0 8px 18px -14px rgba(43,43,40,0.5)` → `0 12px 22px -12px rgba(43,43,40,0.55)`): findings-list paper-strip cards.
- **CTA lift** (`0 10px 24px -12px rgba(43,43,40,0.55)` → `0 14px 30px -12px rgba(43,43,40,0.6)`): primary button at rest and hover.

### Named Rules
**The Soft-Shadow-Only Rule.** Every shadow in this system is diffuse and warm-graphite-toned. A hard offset shadow (flat black, no blur) is a neobrutalist device this world does not use; don't introduce one to "add character."

## Shapes

Small, consistent corner radii throughout (2–6px) — enough to soften without approaching a rounded, bubbly SaaS silhouette. Severity chips are the one fully pill-shaped element (999px), deliberately distinct from the sharper-cornered cards and tabs around them. The document sheet's top/bottom edges use a hand-authored jittered clip-path (a deckle-edge silhouette) applied to a `::before` pseudo-element layered behind the sheet's content — implemented this way specifically so the deckle clip never crops the flag tabs, which intentionally overflow the sheet's right edge via `left: 100%`. Any future surface reusing the document-sheet pattern must keep the deckle edge on a separate layer from overflowing content, or the edge will clip it.

## Components

### Buttons
- **Shape:** 3px radius, small and confident.
- **Primary:** graphite ink fill (`#2b2b28`) with paper-color text, `15px 26px` padding, soft ambient shadow.
- **Hover:** fill lightens to `#46443d`, shadow deepens, `translateY(-1px)`.
- **Secondary:** text-only sign-in link, underline-on-hover; no ghost/bordered button variant exists in this build.

### Chips
- **Severity chip:** pill-shaped (999px), Special Elite label text, uppercase, background = severity color, text color = the matching `-ink` token for guaranteed on-chip contrast. This is the sole severity indicator on findings rows — a border-left accent variant was tried and rejected mid-build.

### Cards / Containers
- **Corner style:** 4px radius.
- **Background:** `#fbf8f0` (a paper tone between `--color-paper` and `--color-paper-deep`), used for findings rows and the Q&A box.
- **Shadow strategy:** ambient card-rest shadow, deepening slightly on hover/focus-within.
- **Border:** 1px `--color-paper-line` hairline.
- **Internal padding:** 22–28px.

### Document Sheet (signature component)
A literal bond-paper sheet: ruled-line background (`repeating-linear-gradient`, 28px rhythm), jittered deckle-edge clip-path on a `::before` layer, and document-native metadata in Special Elite. Flag tabs anchor to `left: 100%` on flagged paragraphs and overflow the sheet's right edge by design — this overflow is a structural feature of the pattern, not an accident to be clipped.

### Flag Tab (signature component)
A physical two-part tab: a colored tip carrying a white numeral badge, plus a label plate in Special Elite naming the finding. Tabs peel in on load with a staggered `translateX`/opacity animation (520ms, `cubic-bezier(0.16, 1, 0.3, 1)`), gated entirely off under `prefers-reduced-motion: reduce`. Below 900px, tabs collapse to numeral-only circles (label plate hidden) to avoid overflow on narrow viewports.

### Navigation
Plain wordmark ("Red" in ink, "line" in flag-red) plus a single text sign-in link; no nav chrome, no dropdown, no severity color outside the wordmark's accent syllable.

## Do's and Don'ts

### Do:
- **Do** ration the severity spectrum (yellow/orange/red) to flag tabs, severity chips, and quoted-sentence highlights only.
- **Do** show every flagged claim's exact source sentence inline, underlined in the matching severity color.
- **Do** use Special Elite only for stamped/metadata elements (flag labels, chips, document letterhead-style metadata) — never for body prose or a page-level kicker.
- **Do** keep the deckle-edge clip-path on a separate layer from any content (like flag tabs) that must overflow the document sheet's edge.
- **Do** gate the flag-tab peel-in animation behind `prefers-reduced-motion: reduce`.

### Don't:
- **Don't** apply severity color to page chrome, navigation, or buttons.
- **Don't** use a border-left accent as a severity indicator on list rows — that pattern was tried and rejected in favor of the full pill-shaped severity chip.
- **Don't** put a kicker/eyebrow above a real page heading; the letterhead text inside the depicted document artifact is a document detail, not a kicker, and is not license to add one elsewhere.
- **Don't** introduce hard offset (neobrutalist) shadows; every shadow here is diffuse and warm-toned.
- **Don't** add pricing, payment, testimonial, user-count, or unverifiable-statistic content to this or future marketing surfaces — a product-truth constraint (PRD.md), not a visual style choice.
