import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RedLinesClient from "./red-lines-client";
import styles from "./red-lines.module.css";

export default async function RedLinesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.wordmark}>
          Red<span>line</span>
        </span>
        <Link href="/home" className={styles.navLink}>
          Back to home
        </Link>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.heading}>Your red lines</h1>
        <p className={styles.body}>
          These are the clauses Redline checks every document against. Add
          your own, tweak the wording, or remove ones you don&rsquo;t need.
          Your next analysis will use whatever&rsquo;s here.
        </p>
      </main>

      <section className={styles.clientSection}>
        <RedLinesClient />
      </section>
    </div>
  );
}
