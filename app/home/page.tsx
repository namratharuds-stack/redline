import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
        <form className={styles.signOutForm} action="/auth/sign-out" method="post">
          <button type="submit" className={styles.signOutButton}>
            Log out
          </button>
        </form>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.heading}>You&rsquo;re in.</h1>
        <p className={styles.body}>
          Your documents and red lines will show up here once uploading is
          live.
        </p>
      </main>
    </div>
  );
}
