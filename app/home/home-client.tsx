"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./home-client.module.css";
import {
  extractDocumentText,
} from "@/lib/document-parsing/parse-document";
import { getCategoryLabel } from "@/lib/red-lines/category-labels";
import { isSubmittableQuestion } from "@/lib/qa/validation";
import type { AnalyzeResult, Flag, RedLine } from "@/lib/analysis-engine/types";

type Status = "idle" | "parsing" | "analyzing" | "done" | "error";

type QaPair = {
  id: string;
  question: string;
  answer: string | null;
  error: string | null;
  pending: boolean;
};

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
  const [questionInput, setQuestionInput] = useState("");
  const [qaPairs, setQaPairs] = useState<QaPair[]>([]);
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
      const redLinesResponse = await fetch("/api/red-lines");
      if (!redLinesResponse.ok) {
        throw new Error(
          `Failed to load red lines: ${redLinesResponse.status}`
        );
      }
      const { redLines } = (await redLinesResponse.json()) as {
        redLines: RedLine[];
      };

      const response = await fetch("/home/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: text,
          redLines,
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
    setQuestionInput("");
    setQaPairs([]);
  }

  async function handleAskQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = questionInput;
    if (!isSubmittableQuestion(question)) {
      return;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    setQaPairs((pairs) => [
      { id, question, answer: null, error: null, pending: true },
      ...pairs,
    ]);
    setQuestionInput("");

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText, question }),
      });

      if (!response.ok) {
        throw new Error(`Question request failed with status ${response.status}`);
      }

      const data = (await response.json()) as { answer: string };
      setQaPairs((pairs) =>
        pairs.map((pair) =>
          pair.id === id
            ? { ...pair, answer: data.answer, pending: false }
            : pair
        )
      );
    } catch {
      setQaPairs((pairs) =>
        pairs.map((pair) =>
          pair.id === id
            ? {
                ...pair,
                pending: false,
                error: "Couldn't get an answer just now. Please try again.",
              }
            : pair
        )
      );
    }
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

          <QaBox
            questionInput={questionInput}
            onQuestionInputChange={setQuestionInput}
            onSubmit={handleAskQuestion}
            qaPairs={qaPairs}
          />

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

function QaBox({
  questionInput,
  onQuestionInputChange,
  onSubmit,
  qaPairs,
}: {
  questionInput: string;
  onQuestionInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  qaPairs: QaPair[];
}) {
  const canSubmit = isSubmittableQuestion(questionInput);

  return (
    <div className={styles.qaCard}>
      <p className={styles.cardLabel}>Ask a question</p>

      <form className={styles.qaForm} onSubmit={onSubmit}>
        <input
          type="text"
          className={styles.qaInput}
          placeholder="Ask a question about this document…"
          value={questionInput}
          onChange={(event) => onQuestionInputChange(event.target.value)}
          aria-label="Ask a question about this document"
        />
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={!canSubmit}
        >
          Ask
        </button>
      </form>

      <p className={styles.qaHint}>
        Answers are based only on this document&rsquo;s text.
      </p>

      {qaPairs.length > 0 && (
        <ul className={styles.qaList}>
          {qaPairs.map((pair) => (
            <QaRow key={pair.id} pair={pair} />
          ))}
        </ul>
      )}
    </div>
  );
}

function QaRow({ pair }: { pair: QaPair }) {
  return (
    <li className={styles.qaRow}>
      <p className={styles.qaQuestion}>{pair.question}</p>
      {pair.pending && <p className={styles.qaStatus}>Thinking…</p>}
      {pair.error && <p className={styles.qaError}>{pair.error}</p>}
      {pair.answer && <p className={styles.qaAnswer}>{pair.answer}</p>}
    </li>
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
