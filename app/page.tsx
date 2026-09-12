"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./landing.module.css";

type Severity = "low" | "medium" | "high";

const SEVERITY_COLOR: Record<Severity, string> = {
  low: "var(--flag-low)",
  medium: "var(--flag-medium)",
  high: "var(--flag-high)",
};

const SEVERITY_INK: Record<Severity, string> = {
  low: "var(--flag-low-ink)",
  medium: "var(--flag-medium-ink)",
  high: "var(--flag-high-ink)",
};

const FINDINGS: {
  n: number;
  severity: Severity;
  label: string;
  quote: string;
  counter: string;
  docWidths: ("full" | "wide" | "mid")[];
}[] = [
  {
    n: 1,
    severity: "high",
    label: "Auto-renewal",
    quote:
      "This Agreement renews automatically for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the renewal date.",
    counter:
      "Shorten the non-renewal notice window to 30 days, or require written opt-in before any renewal.",
    docWidths: ["full", "full", "wide"],
  },
  {
    n: 2,
    severity: "medium",
    label: "Scope creep",
    quote:
      "Contractor shall make revisions as requested by Client until Client is fully satisfied.",
    counter:
      "Cap revisions at two rounds per deliverable; additional rounds billed at the hourly rate.",
    docWidths: ["full", "wide"],
  },
  {
    n: 3,
    severity: "low",
    label: "IP assignment",
    quote: "Client shall own all work product created under this Agreement.",
    counter:
      "Add a clause confirming assignment transfers only upon receipt of full and final payment.",
    docWidths: ["wide", "mid"],
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
  const [activeTab, setActiveTab] = useState<number | null>(null);

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
          <h1>Every risky clause, flagged in your contract&rsquo;s own words.</h1>
          <p>
            Upload a contract, lease, or freelance agreement. Redline opens
            with a plain-English summary, flags what&rsquo;s risky, quotes
            the exact sentence it came from, and drafts a counter-offer for
            each one.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/signup" className={styles.ctaPrimary}>
              <UploadIcon />
              Try it on your document
            </Link>
            <span className={styles.ctaNote}>
              Sign up, then upload your first document.
            </span>
          </div>
          <div className={styles.previewRow}>
            <span
              className={styles.previewChip}
              style={{ background: SEVERITY_COLOR.high, color: "var(--flag-high-ink)" }}
            >
              1
            </span>
            <div className={styles.previewText}>
              <strong>Auto-renewal</strong>
              <p>Renews automatically unless you cancel 90 days out.</p>
              <span className={styles.previewQuote}>
                &ldquo;&hellip;renews automatically for successive one-year
                terms&hellip;&rdquo;
              </span>
            </div>
          </div>
        </div>

        <div className={styles.heroDocument}>
          <div className={styles.documentSheet}>
            <p className={styles.docHeading}>Freelance Design Agreement</p>
            <p className={styles.docTitle}>4. Term and Termination</p>

            {FINDINGS.map((f) => (
              <div className={styles.docParagraph} key={f.n}>
                <span
                  className={styles.flaggedSentence}
                  style={{ ["--tab-color" as string]: SEVERITY_COLOR[f.severity] }}
                >
                  {f.quote}
                </span>{" "}
                {f.docWidths.map((w, i) => (
                  <span key={i} className={styles.docLine} data-w={w} />
                ))}
                <div
                  className={`${styles.tab}${activeTab === f.n ? " " + styles.active : ""}`}
                  style={{
                    ["--tab-color" as string]: SEVERITY_COLOR[f.severity],
                    animationDelay: `${300 + f.n * 220}ms`,
                  }}
                  onMouseEnter={() => setActiveTab(f.n)}
                  onMouseLeave={() => setActiveTab(null)}
                >
                  <span className={styles.tabTip}>
                    <span className={styles.tabBadge}>{f.n}</span>
                  </span>
                  <span className={styles.tabLabel}>{f.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Every flag, in the contract&rsquo;s own words.</h2>
          <p>
            Each flag quotes the exact sentence it came from, without
            paraphrasing or guessing, so you can check it against your own
            document before you act on it.
          </p>
        </div>

        <div className={styles.findingsList}>
          {FINDINGS.map((f) => (
            <div className={styles.findingRow} key={f.n}>
              <span
                className={styles.severityChip}
                style={{
                  ["--tab-color" as string]: SEVERITY_COLOR[f.severity],
                  ["--tab-ink-color" as string]: SEVERITY_INK[f.severity],
                }}
              >
                {f.severity}
              </span>
              <div>
                <p className={styles.findingLabel}>{f.label}</p>
              </div>
              <p className={styles.findingQuote}>&ldquo;{f.quote}&rdquo;</p>
              <p className={styles.findingCounter}>
                <span>Counter-offer</span>
                {f.counter}
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
            red-lines list you control, so the flags reflect what matters to
            you.
          </p>
        </div>

        <div className={styles.twoUp}>
          <div className={styles.qaBox}>
            <span className={styles.qaBoxTab}>Q&amp;A</span>
            <div className={styles.qaExchange}>
              <p className={styles.qaQuestion}>
                Can I cancel before the renewal date?
              </p>
              <p className={styles.qaAnswer}>
                Yes. You must give{" "}
                <span
                  className={styles.qaHighlight}
                  style={{ ["--tab-color" as string]: SEVERITY_COLOR.high }}
                >
                  written notice of non-renewal
                </span>{" "}
                at least 90 days before the current term ends (Section 4.2).
              </p>
            </div>
            <div className={styles.qaExchange}>
              <p className={styles.qaQuestion}>
                Does this contract mention a non-compete?
              </p>
              <p className={styles.qaAnswer}>
                This document doesn&rsquo;t address that.
              </p>
              <span className={styles.qaUnsupported}>Not in this document</span>
            </div>
          </div>

          <ul className={styles.redlinesList}>
            {REDLINES.map((r) => (
              <li key={r}>
                <span className={styles.redlineSwatch} aria-hidden="true" />
                <span className={styles.redlineName}>{r}</span>
                <span className={styles.redlineTag}>starter</span>
              </li>
            ))}
            <li data-custom="true">
              <span className={styles.redlineSwatch} aria-hidden="true" />
              <span className={styles.redlineName}>+ Add your own</span>
              <span className={styles.redlineTag}>custom</span>
            </li>
          </ul>
        </div>

        <p className={styles.libraryNote}>
          Every document you upload is saved to your library, so you can
          find past flags and counter-offers again without re-uploading.
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
