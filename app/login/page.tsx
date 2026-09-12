"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "../styles/auth-form.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <a href="/" className={styles.wordmark}>
          Red<span>line</span>
        </a>
        <h1 className={styles.heading}>Log in</h1>
        <p className={styles.subtext}>
          Log in to see your saved documents and red lines.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error ? <p className={styles.message}>{error}</p> : null}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={styles.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className={styles.footerText}>
          New to Redline?{" "}
          <a href="/signup" className={styles.footerLink}>
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
