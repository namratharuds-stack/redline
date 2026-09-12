"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./home-client.module.css";
import {
  extractDocumentText,
} from "@/lib/document-parsing/parse-document";
import { isSubmittableQuestion } from "@/lib/qa/validation";
import { DOCUMENT_TYPE_KEYS, getDocumentTypeLabel } from "@/lib/documents/document-types";
import { AnalysisResult } from "@/components/analysis-result";
import { OnboardingIntro } from "@/components/onboarding-intro";
import { createClient } from "@/lib/supabase/client";
import { FREELANCE_CONTRACT_SAMPLE } from "@/lib/samples/freelance-contract-sample";
import { LEASE_SAMPLE } from "@/lib/samples/lease-sample";
import type { AnalyzeResult, RedLine } from "@/lib/analysis-engine/types";

type Status = "idle" | "parsing" | "analyzing" | "done" | "error";

type QaPair = {
  id: string;
  question: string;
  answer: string | null;
  error: string | null;
  pending: boolean;
};

export default function HomeClient({
  initialShowOnboarding,
}: {
  initialShowOnboarding: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [qaPairs, setQaPairs] = useState<QaPair[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(initialShowOnboarding);
  const [onboardingSkipped, setOnboardingSkipped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Runs the real analysis flow (load red lines, POST /home/analyze,
   * render results, save to the library in the background) against
   * whatever documentText is already in hand. Shared by the file-upload
   * path (after extractDocumentText) and the onboarding sample path
   * (which already has plain-text sample content, so it skips parsing
   * entirely) — there is exactly one place that talks to /home/analyze.
   */
  async function runAnalysis(text: string, docType: string) {
    setDocumentType(docType);
    setDocumentText(text);
    setResult(null);
    setErrorMessage("");
    setSaveFailed(false);
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
      // Fire-and-forget: save to the library in the background. This must
      // never delay or block the results already shown above — a failure
      // here surfaces as a small note, not a lost analysis.
      void saveToLibrary(docType, text, data);
      // A completed analysis — sample or real — is what "onboarded" means
      // (see lib/onboarding/should-show-onboarding.ts). Best-effort: if
      // this write fails, the walkthrough just shows again next visit.
      void markOnboarded();
    } catch {
      setStatus("error");
      setErrorMessage(
        "We couldn't analyze this document just now. Please try again."
      );
    } finally {
      resetFileInput();
    }
  }

  async function markOnboarded() {
    if (!showOnboarding) {
      return;
    }
    setShowOnboarding(false);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({ data: { onboarded: true } });
    } catch {
      // No profiles table, no retry queue for this one boolean — worst
      // case the walkthrough shows again next visit, which is the safe
      // failure direction (see ticket 07: never skip a real first-timer).
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !documentType) {
      return;
    }

    setFileName(file.name);
    setResult(null);
    setErrorMessage("");
    setSaveFailed(false);
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

    await runAnalysis(text, documentType);
  }

  function handleRunSample(sampleDocumentType: "freelance_agreement" | "lease") {
    const sampleText =
      sampleDocumentType === "freelance_agreement"
        ? FREELANCE_CONTRACT_SAMPLE
        : LEASE_SAMPLE;
    setFileName(
      sampleDocumentType === "freelance_agreement"
        ? "Sample freelance contract"
        : "Sample lease"
    );
    void runAnalysis(sampleText, sampleDocumentType);
  }

  function resetFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  /**
   * Saves a completed analysis to the user's library. Never touches
   * `status`/`result` — a failed save shows a small note (`saveFailed`)
   * without taking away the analysis already on screen.
   */
  async function saveToLibrary(
    savedDocumentType: string,
    savedDocumentText: string,
    savedResult: AnalyzeResult
  ) {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: savedDocumentType,
          documentText: savedDocumentText,
          summary: savedResult.summary,
          flags: savedResult.flags,
        }),
      });
      if (!response.ok) {
        setSaveFailed(true);
      }
    } catch {
      setSaveFailed(true);
    }
  }

  function handleStartOver() {
    setStatus("idle");
    setFileName("");
    setDocumentType("");
    setDocumentText("");
    setResult(null);
    setErrorMessage("");
    setSaveFailed(false);
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
      {status === "idle" && showOnboarding && !onboardingSkipped && (
        <OnboardingIntro
          onRunSample={handleRunSample}
          onSkip={() => setOnboardingSkipped(true)}
        />
      )}

      {status === "idle" && (!showOnboarding || onboardingSkipped) && (
        <div className={styles.uploadCard}>
          <label className={styles.uploadLabel} htmlFor="document-upload">
            Upload a document to review
          </label>
          <p className={styles.uploadHint}>
            Accepts .txt and .pdf files. Only the text is sent for review;
            the file itself stays on your device.
          </p>

          <label className={styles.fieldLabel} htmlFor="document-type">
            Document type
          </label>
          <select
            id="document-type"
            className={styles.select}
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
          >
            <option value="" disabled>
              Select a document type…
            </option>
            {DOCUMENT_TYPE_KEYS.map((key) => (
              <option key={key} value={key}>
                {getDocumentTypeLabel(key)}
              </option>
            ))}
          </select>

          <input
            ref={fileInputRef}
            id="document-upload"
            className={styles.fileInput}
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileChange}
            disabled={!documentType}
          />
          {!documentType && (
            <p className={styles.uploadHint}>
              Choose a document type to enable upload.
            </p>
          )}
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
          <AnalysisResult result={result} />

          {saveFailed && (
            <p className={styles.saveFailedNote}>
              Couldn&rsquo;t save this to your library.
            </p>
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
