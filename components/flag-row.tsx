// The single flag-card rendering used both for a fresh analysis
// (app/home/home-client.tsx, ticket 03) and for a saved document reopened
// from the library (app/home/library/[id]/page.tsx, ticket 05). Extracted
// so there is exactly one flag display in the app — see
// .scratch/redline-v1/issues/05-document-library.md: "don't invent a
// visually different flag display."
//
// Imports home-client's CSS module directly (CSS Modules just produce
// scoped class names — importing the same module from two files is the
// normal way to share styling, not a layering violation) rather than
// duplicating the DESIGN.md-derived styles a second time.
import styles from "@/app/home/home-client.module.css";
import { getCategoryLabel } from "@/lib/red-lines/category-labels";
import type { Flag } from "@/lib/analysis-engine/types";

const SEVERITY_LABEL: Record<Flag["severity"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function FlagRow({ flag }: { flag: Flag }) {
  return (
    <li className={styles.flagRow}>
      <div className={styles.flagRowTop}>
        <span
          className={styles.severityChip}
          style={{
            background: `var(--flag-${flag.severity})`,
            color: `var(--flag-${flag.severity}-ink)`,
          }}
        >
          {SEVERITY_LABEL[flag.severity]}
        </span>
        <span className={styles.flagLabel}>{getCategoryLabel(flag.category)}</span>
      </div>

      <blockquote className={styles.sourceQuote}>
        &ldquo;{flag.sourceSentence}&rdquo;
      </blockquote>

      <p className={styles.flagExplanation}>{flag.explanation}</p>

      <div className={styles.counterOffer}>
        <p className={styles.cardLabel}>Counter-offer</p>
        <p className={styles.counterOfferText}>{flag.counterOffer}</p>
      </div>
    </li>
  );
}
