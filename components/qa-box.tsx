"use client";

// The Q&A box, shared between a fresh analysis (app/home/home-client.tsx)
// and a saved document reopened from the library
// (app/home/library/[id]/page.tsx). Questions and answers live only as long
// as the box is on screen. See components/flag-row.tsx for why this reuses
// home-client's CSS module rather than duplicating it.
import { useState } from "react";
import type { FormEvent } from "react";
import styles from "@/app/home/home-client.module.css";
import { isSubmittableQuestion } from "@/lib/qa/validation";

type QaPair = {
  id: string;
  question: string;
  answer: string | null;
  error: string | null;
  pending: boolean;
};

export function QaBox({ documentText }: { documentText: string }) {
  const [questionInput, setQuestionInput] = useState("");
  const [qaPairs, setQaPairs] = useState<QaPair[]>([]);

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

  const canSubmit = isSubmittableQuestion(questionInput);

  return (
    <div className={styles.qaCard}>
      <p className={styles.cardLabel}>Ask a question</p>

      <form className={styles.qaForm} onSubmit={handleAskQuestion}>
        <input
          type="text"
          className={styles.qaInput}
          placeholder="Ask a question about this document…"
          value={questionInput}
          onChange={(event) => setQuestionInput(event.target.value)}
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
