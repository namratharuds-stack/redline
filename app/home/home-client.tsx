"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./home-client.module.css";
import {
  extractDocumentText,
} from "@/lib/document-parsing/parse-document";
import { STARTER_RED_LINES } from "@/lib/red-lines/starter-red-lines";
import { getCategoryLabel } from "@/lib/red-lines/category-labels";
import type { AnalyzeResult, Flag } from "@/lib/analysis-engine/types";

type Status = "idle" | "parsing" | "analyzing" | "done" | "error";

const SEVERITY_LABEL: Record<Flag["severity"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function HomeClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setResult(null);
    setErrorMessage("");
    setDocumentText("");
    setStatus("parsing");

    let text: string;
    try {
      text = await extractDocumentText(file);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't read that file. Please try a different one."
      );
      resetFileInput();
      return;
    }

    setDocumentText(text);
    setStatus("analyzing");

    try {
      const response = await fetch("/home/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: text,
          redLines: STARTER_RED_LINES,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis request failed with status ${response.status}`);
      }

      const data = (await response.json()) as AnalyzeResult;
      setResult(data);
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage(
        "We couldn't analyze this document just now. Please try again."
      );
    } finally {
      resetFileInput();
    }
  }

  function resetFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleStartOver() {
    setStatus("idle");
    setFileName("");
    setDocumentText("");
    setResult(null);
    setErrorMessage("");
  }

  return (
    <div className={styles.wrapper}>
      {status === "idle" && (
        <div className={styles.uploadCard}>
          <label className={styles.uploadLabel} htmlFor="document-upload">
            Upload a document to review
          </label>
          <p className={styles.uploadHint}>
            Accepts .txt and .pdf files. Only the text is sent for review;
            the file itself stays on your device.
          </p>
          <input
            ref={fileInputRef}
            id="document-upload"
            className={styles.fileInput}
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileChange}
          />
        </div>
      )}

      {(status === "parsing" || status === "analyzing") && (
        <div className={styles.workingState}>
          <p className={styles.workingLabel}>
            {status === "parsing"
              ? `Reading ${fileName}…`
              : "Analyzing your document against your red lines…"}
          </p>
          {documentText && (
            <pre className={styles.documentPreview}>{documentText}</pre>
          )}
        </div>
      )}

      {status === "error" && (
        <div className={styles.errorCard}>
          <p className={styles.errorMessage}>{errorMessage}</p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleStartOver}
          >
            Try another file
          </button>
        </div>
      )}

      {status === "done" && result && (
        <div className={styles.resultState}>
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

          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleStartOver}
          >
            Analyze another document
          </button>
        </div>
      )}
    </div>
  );
}

function FlagRow({ flag }: { flag: Flag }) {
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
