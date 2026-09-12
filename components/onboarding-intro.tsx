// First-run walkthrough panel (ticket 07). Shown instead of the plain
// upload prompt until the current user completes their first analysis —
// sample or real (see lib/onboarding/should-show-onboarding.ts and
// app/home/home-client.tsx, which owns that decision and calls back into
// this component's two sample buttons and its skip link).
//
// Reuses home-client's CSS module (see components/flag-row.tsx for why
// importing the same module from another file is the normal way to share
// styling here) rather than inventing a new visual pattern for this panel.
import Link from "next/link";
import styles from "@/app/home/home-client.module.css";
import { PERSONA_OPTIONS, type Persona } from "@/lib/onboarding/persona";

export function OnboardingIntro({
  onRunSample,
  onSkip,
  selectedPersona,
  onSelectPersona,
}: {
  onRunSample: (documentType: "freelance_agreement" | "lease") => void;
  onSkip: () => void;
  /** The persona the user has already picked, if any. Purely optional —
   * nothing else in this panel waits on it. See lib/onboarding/persona.ts. */
  selectedPersona: Persona | null;
  onSelectPersona: (persona: Persona) => void;
}) {
  return (
    <div className={styles.uploadCard}>
      <p className={styles.uploadLabel}>Here&rsquo;s how Redline works</p>
      <p className={styles.uploadHint}>
        Upload a document and Redline checks it against your red lines.
        You&rsquo;ll get a plain-English summary, risky clauses ranked by
        severity with the exact sentence each one came from, and a drafted
        counter-offer for each flag. Once that&rsquo;s done, you can ask
        questions about the document too.
      </p>
      <p className={styles.uploadHint}>
        Try it now on a sample document, or upload your own below.
      </p>

      <div className={styles.onboardingActions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => onRunSample("freelance_agreement")}
        >
          Try it on a sample freelance contract
        </button>
        <button
          type="button"
          className={styles.onboardingSecondaryLink}
          onClick={() => onRunSample("lease")}
        >
          or see a sample lease instead
        </button>
      </div>

      <div
        className={styles.personaSection}
        role="group"
        aria-label="Optional: which of these sounds like you?"
      >
        <p className={styles.personaPrompt}>
          Optional: which of these sounds like you?
        </p>
        <div className={styles.personaOptions}>
          {PERSONA_OPTIONS.map((option) => {
            const isSelected = selectedPersona === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={
                  isSelected
                    ? `${styles.personaButton} ${styles.personaButtonSelected}`
                    : styles.personaButton
                }
                aria-pressed={isSelected}
                onClick={() => onSelectPersona(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.onboardingFootnote}>
        You can also skip straight to{" "}
        <button
          type="button"
          className={styles.onboardingInlineLink}
          onClick={onSkip}
        >
          uploading your own document
        </button>
        . Either way, the flags come from your red lines, which you can
        review and edit anytime on{" "}
        <Link href="/home/red-lines" className={styles.onboardingInlineLink}>
          Manage your red lines
        </Link>
        .
      </p>
    </div>
  );
}
