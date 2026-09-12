"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./landing.module.css";

type Severity = "low" | "medium" | "high";

const FINDINGS: {
  n: number;
  severity: Severity;
  label: string;
  original: string;
  suggested: string;
  comment: string;
}[] = [
  {
    n: 1,
    severity: "high",
    label: "Auto-renewal",
    original:
      "renews automatically for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the renewal date",
    suggested:
      "renews only if both parties confirm in writing at least 30 days before the current term ends",
    comment: "90-day opt-out window. Most people miss it and get another year.",
  },
  {
    n: 2,
    severity: "medium",
    label: "Scope creep",
    original:
      "Contractor shall make revisions as requested by Client until Client is fully satisfied",
    suggested:
      "Contractor shall provide up to two rounds of revisions per deliverable",
    comment: "“Until satisfied” has no ceiling. Cap it.",
  },
  {
    n: 3,
    severity: "low",
    label: "IP assignment",
    original: "Client shall own all work product created under this Agreement",
    suggested:
      "Client shall own all work product upon receipt of full and final payment",
    comment: "Assignment should be tied to payment clearing, not just delivery.",
  },
];

const REDLINES = [
  "Scope creep",
  "IP assignment",
  "Non-compete",
  "Indemnification",
  "Personal guarantees",
  "Auto-renewal",
  "Arbitration",
];

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 12.5V3.5M9 3.5L5.25 7.25M9 3.5L12.75 7.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 12.5V13.75C3.5 14.44 4.06 15 4.75 15H13.25C13.94 15 14.5 14.44 14.5 13.75V12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.wordmark}>
          Red<span>line</span>
        </Link>
        <Link href="/login" className={styles.signIn}>
          Sign in
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>Redline reads the contract you were about to sign.</h1>
          <p>
            Upload a contract, lease, or freelance agreement. Redline marks
            up the risky clauses the way you&rsquo;d mark up a document
            yourself: strikethrough on the problem, a suggested replacement,
            and a comment explaining why.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/signup" className={styles.ctaPrimary}>
              <UploadIcon />
              Try it on your document
            </Link>
          </div>
          <span className={styles.ctaNote}>
            Sign up, then upload your first document.
          </span>
        </div>

        <div className={styles.editorWindow} data-mounted={mounted}>
          <div className={styles.editorChrome}>
            <span className={styles.editorFileName}>
              Freelance Design Agreement.docx
            </span>
            <span className={styles.editorFileMeta}>
              &middot; sample document
            </span>
            <span className={styles.suggestingPill}>
              <span className={styles.suggestingDot} aria-hidden="true" />
              Suggesting
            </span>
          </div>
          <div className={styles.editorToolbar}>
            <span>B</span>
            <span style={{ fontStyle: "italic" }}>I</span>
            <span style={{ textDecoration: "underline" }}>U</span>
            <span aria-hidden="true">&middot;</span>
            <span>3 suggestions</span>
          </div>
          <div className={styles.editorBody}>
            <div className={`${styles.docCanvas} ${styles.docFont}`}>
              <p className={styles.docLetterhead}>FREELANCE DESIGN AGREEMENT</p>
              <p className={styles.docTitle}>4. Term and Termination</p>
              {FINDINGS.map((f) => (
                <p className={styles.docParagraph} key={f.n}>
                  This Agreement{" "}
                  <span className={styles.del} data-sev={f.severity}>
                    {f.original}
                  </span>{" "}
                  <span className={styles.ins} data-sev={f.severity}>
                    {f.suggested}
                  </span>
                  .
                </p>
              ))}
            </div>
            <div className={styles.commentRail}>
              {FINDINGS.map((f) => (
                <div
                  className={styles.commentCard}
                  data-sev={f.severity}
                  key={f.n}
                >
                  <div className={styles.commentAvatar}>
                    <span>R</span> Redline
                    <span className={styles.commentSevDot} aria-hidden="true" />
                  </div>
                  <p className={styles.commentLabel}>{f.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Every suggested edit, next to what it replaces.</h2>
          <p>
            Nothing is paraphrased. The struck-through text is the
            document&rsquo;s own words; the suggested replacement is
            Redline&rsquo;s counter-offer for that exact clause.
          </p>
        </div>

        <div className={styles.revisionList}>
          {FINDINGS.map((f) => (
            <div className={styles.revisionRow} key={f.n}>
              <span className={styles.sevTag} data-sev={f.severity}>
                {f.severity}
              </span>
              <div>
                <p className={styles.revisionLabel}>{f.label}</p>
              </div>
              <p className={styles.revisionQuote}>
                <span>{f.original}</span>
              </p>
              <p className={styles.revisionCounter}>
                <span>Suggested replacement</span>
                <em>{f.suggested}</em>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Ask it anything. Tell it what you&rsquo;re watching for.</h2>
          <p>
            A question box that answers only from your document, and a
            red-lines list you control, so Redline flags what matters to
            you.
          </p>
        </div>

        <div className={styles.twoUp}>
          <div className={styles.thread}>
            <p className={styles.threadHeader}>Comments</p>
            <div className={styles.exchange}>
              <p className={styles.bubbleQ}>
                Can I cancel before the renewal date?
              </p>
              <p className={styles.bubbleA}>
                Yes. You must give{" "}
                <span className={styles.qaHighlight}>
                  written notice of non-renewal
                </span>{" "}
                at least 90 days before the current term ends (Section 4.2).
              </p>
            </div>
            <div className={styles.exchange}>
              <p className={styles.bubbleQ}>
                Does this contract mention a non-compete?
              </p>
              <p className={styles.bubbleA}>
                This document doesn&rsquo;t address that.
              </p>
              <span className={styles.qaUnsupported}>Not in this document</span>
            </div>
          </div>

          <ul className={styles.settingsPanel}>
            {REDLINES.map((r) => (
              <li key={r}>
                <span className={styles.checkbox} aria-hidden="true" />
                <span className={styles.settingName}>{r}</span>
                <span className={styles.settingTag}>starter</span>
              </li>
            ))}
            <li data-custom="true">
              <span className={styles.checkbox} aria-hidden="true" />
              <span className={styles.settingName}>+ Add your own</span>
              <span className={styles.settingTag}>custom</span>
            </li>
          </ul>
        </div>

        <p className={styles.libraryNote}>
          Every document you upload is saved to your library, so you can
          find past mark-ups again without re-uploading.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.boundaryGrid}>
          <h2 className={styles.boundaryStatement}>
            Redline flags risk. It doesn&rsquo;t tell you what to do about it.
          </h2>
          <ul className={styles.boundaryList}>
            <li>
              <strong>No verdict on whether to sign.</strong> You decide;
              Redline shows you what to check first.
            </li>
            <li>
              <strong>No legal advice.</strong> Read the flags, then talk to a
              lawyer if the stakes call for one.
            </li>
            <li>
              <strong>No scanned or photographed documents.</strong> If we
              can&rsquo;t read your document&rsquo;s own words exactly, we
              won&rsquo;t guess at them.
            </li>
            <li>
              <strong>
                Contracts, leases, freelance agreements, and terms of service
                only.
              </strong>{" "}
              We&rsquo;d rather do four things precisely than ten
              approximately.
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.finalCta}>
        <h2>Try it on your document.</h2>
        <div className={styles.ctaRow} style={{ justifyContent: "center" }}>
          <Link href="/signup" className={styles.ctaPrimary}>
            <UploadIcon />
            Try it on your document
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.wordmark}>
          Red<span>line</span>
        </span>
        <span>Not a substitute for legal advice.</span>
      </footer>
    </main>
  );
}
