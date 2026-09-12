import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeClient from "./home-client";
import styles from "./home.module.css";

export default async function HomePage() {
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
        <div className={styles.navActions}>
          <Link href="/home/red-lines" className={styles.navLink}>
            Manage your red lines
          </Link>
          <Link href="/home/library" className={styles.navLink}>
            Library
          </Link>
          <form className={styles.signOutForm} action="/auth/sign-out" method="post">
            <button type="submit" className={styles.signOutButton}>
              Log out
            </button>
          </form>
        </div>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.heading}>Upload a document to review</h1>
        <p className={styles.body}>
          Redline checks it against your red lines and flags what to look at
          before you sign.
        </p>
      </main>

      <section className={styles.clientSection}>
        <HomeClient />
      </section>
    </div>
  );
}
