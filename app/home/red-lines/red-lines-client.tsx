"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import styles from "./red-lines.module.css";
import {
  CANONICAL_CATEGORY_KEYS,
  getCategoryLabel,
} from "@/lib/red-lines/category-labels";

type RedLineRow = {
  id: string;
  category: string;
  description: string;
};

type ListStatus = "loading" | "ready" | "error";

export default function RedLinesClient() {
  const [redLines, setRedLines] = useState<RedLineRow[]>([]);
  const [listStatus, setListStatus] = useState<ListStatus>("loading");

  const [newCategory, setNewCategory] = useState(CANONICAL_CATEGORY_KEYS[0]);
  const [newDescription, setNewDescription] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRedLines() {
      try {
        const response = await fetch("/api/red-lines");
        if (!response.ok) {
          throw new Error(`Failed to load red lines: ${response.status}`);
        }
        const data = (await response.json()) as { redLines: RedLineRow[] };
        if (!cancelled) {
          setRedLines(data.redLines);
          setListStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setListStatus("error");
        }
      }
    }

    loadRedLines();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    setAddError("");

    if (newDescription.trim().length === 0) {
      setAddError("Description can't be empty.");
      return;
    }

    setAdding(true);
    try {
      const response = await fetch("/api/red-lines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newCategory,
          description: newDescription.trim(),
        }),
      });

      const data = (await response.json()) as
        | { redLine: RedLineRow }
        | { error: string };

      if (!response.ok || !("redLine" in data)) {
        setAddError(
          "error" in data ? data.error : "Couldn't add that red line."
        );
        return;
      }

      setRedLines((current) => [...current, data.redLine]);
      setNewDescription("");
    } catch {
      setAddError("Couldn't add that red line. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  function startEditing(redLine: RedLineRow) {
    setEditingId(redLine.id);
    setEditDescription(redLine.description);
    setEditError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditDescription("");
    setEditError("");
  }

  async function handleSaveEdit(id: string) {
    setEditError("");

    if (editDescription.trim().length === 0) {
      setEditError("Description can't be empty.");
      return;
    }

    setSavingEdit(true);
    try {
      const response = await fetch(`/api/red-lines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: editDescription.trim() }),
      });

      const data = (await response.json()) as
        | { redLine: RedLineRow }
        | { error: string };

      if (!response.ok || !("redLine" in data)) {
        setEditError(
          "error" in data ? data.error : "Couldn't save that change."
        );
        return;
      }

      setRedLines((current) =>
        current.map((redLine) =>
          redLine.id === id ? data.redLine : redLine
        )
      );
      setEditingId(null);
      setEditDescription("");
    } catch {
      setEditError("Couldn't save that change. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      const response = await fetch(`/api/red-lines/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRedLines((current) => current.filter((redLine) => redLine.id !== id));
      }
    } finally {
      setRemovingId(null);
    }
  }

  if (listStatus === "loading") {
    return <p className={styles.statusText}>Loading your red lines…</p>;
  }

  if (listStatus === "error") {
    return (
      <p className={styles.statusText}>
        We couldn&rsquo;t load your red lines. Please try again.
      </p>
    );
  }

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {redLines.map((redLine) => (
          <li key={redLine.id} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.categoryLabel}>
                {getCategoryLabel(redLine.category)}
              </span>
              {editingId !== redLine.id && (
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.textButton}
                    onClick={() => startEditing(redLine)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.textButton}
                    onClick={() => handleRemove(redLine.id)}
                    disabled={removingId === redLine.id}
                  >
                    {removingId === redLine.id ? "Removing…" : "Remove"}
                  </button>
                </div>
              )}
            </div>

            {editingId === redLine.id ? (
              <div className={styles.editForm}>
                <textarea
                  className={styles.textarea}
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  rows={3}
                />
                {editError && <p className={styles.fieldError}>{editError}</p>}
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => handleSaveEdit(redLine.id)}
                    disabled={savingEdit}
                  >
                    {savingEdit ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    className={styles.textButton}
                    onClick={cancelEditing}
                    disabled={savingEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className={styles.description}>{redLine.description}</p>
            )}
          </li>
        ))}
      </ul>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <p className={styles.cardLabel}>Add a red line</p>

        <label className={styles.fieldLabel} htmlFor="new-category">
          Category
        </label>
        <select
          id="new-category"
          className={styles.select}
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
        >
          {CANONICAL_CATEGORY_KEYS.map((key) => (
            <option key={key} value={key}>
              {getCategoryLabel(key)}
            </option>
          ))}
        </select>

        <label className={styles.fieldLabel} htmlFor="new-description">
          Description
        </label>
        <textarea
          id="new-description"
          className={styles.textarea}
          value={newDescription}
          onChange={(event) => setNewDescription(event.target.value)}
          rows={3}
          placeholder="What should Redline watch for here?"
        />

        {addError && <p className={styles.fieldError}>{addError}</p>}

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={adding}
        >
          {adding ? "Adding…" : "Add red line"}
        </button>
      </form>
    </div>
  );
}
