"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "../styles/auth-form.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsSubmitting(false);
      return;
    }

    if (data.session) {
      // Email confirmation is off (or already satisfied): the account is
      // signed in immediately.
      router.push("/home");
      router.refresh();
      return;
    }

    // Email confirmation is required before a session exists. There's
    // nothing to sign in to yet, so tell the user instead of redirecting.
    setConfirmationSent(true);
    setIsSubmitting(false);
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <a href="/" className={styles.wordmark}>
          Red<span>line</span>
        </a>
        <h1 className={styles.heading}>Create an account</h1>
        <p className={styles.subtext}>
          Sign up to start reviewing your own documents.
        </p>

        {confirmationSent ? (
          <p className={styles.message}>
            Check {email} for a confirmation link, then come back and log in.
          </p>
        ) : (
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
                autoComplete="new-password"
                required
                minLength={6}
                className={styles.input}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <button type="submit" className={styles.button} disabled={isSubmitting}>
              {isSubmitting ? "Creating your account…" : "Create account"}
            </button>
          </form>
        )}

        <p className={styles.footerText}>
          Already have an account?{" "}
          <a href="/login" className={styles.footerLink}>
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
