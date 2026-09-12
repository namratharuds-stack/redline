// Summary + flags list, shared between a fresh analysis
// (app/home/home-client.tsx) and a saved document reopened from the
// library (app/home/library/[id]/page.tsx). See components/flag-row.tsx
// for why this reuses home-client's CSS module rather than duplicating it.
import styles from "@/app/home/home-client.module.css";
import type { AnalyzeResult } from "@/lib/analysis-engine/types";
import { FlagRow } from "./flag-row";

export function AnalysisResult({ result }: { result: AnalyzeResult }) {
  return (
    <>
      <div className={styles.summaryCard}>
        <p className={styles.cardLabel}>Summary</p>
        <p className={styles.summaryText}>{result.summary}</p>
      </div>

      {result.flags.length === 0 ? (
        <div className={styles.noFlagsCard}>
          <p>No flags found for your red lines.</p>
        </div>
      ) : (
        <ul className={styles.flagsList}>
          {result.flags.map((flag, index) => (
            <FlagRow key={`${flag.category}-${index}`} flag={flag} />
          ))}
        </ul>
      )}
    </>
  );
}
