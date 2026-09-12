import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDocumentTypeLabel } from "@/lib/documents/document-types";
import { formatDocumentDate } from "@/lib/documents/format-date";
import { getSummaryPreview } from "@/lib/documents/summary-preview";
import styles from "./library.module.css";

type DocumentListRow = {
  id: string;
  document_type: string;
  summary: string;
  created_at: string;
};

/**
 * Lists the authenticated user's saved documents, newest first. RLS
 * (documents_select_own) is the real cross-user guard — a signed-in user
 * can only ever have their own rows returned by Supabase — but the query
 * is scoped by user_id regardless, for a correct query on its own terms.
 */
export default async function LibraryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: documents, error } = await supabase
    .from("documents")
    .select("id, document_type, summary, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (documents ?? []) as DocumentListRow[];

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
        <h1 className={styles.heading}>Your library</h1>
        <p className={styles.body}>
          Documents you&rsquo;ve analyzed, with the summary and flags saved
          exactly as they were reviewed.
        </p>
      </main>

      <section className={styles.clientSection}>
        {error && (
          <p className={styles.statusText}>
            We couldn&rsquo;t load your library. Please try again.
          </p>
        )}

        {!error && rows.length === 0 && (
          <p className={styles.statusText}>
            No documents yet. Analyze one from the home page to see it here.
          </p>
        )}

        {!error && rows.length > 0 && (
          <ul className={styles.list}>
            {rows.map((document) => (
              <li key={document.id} className={styles.card}>
                <Link
                  href={`/home/library/${document.id}`}
                  className={styles.cardLink}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.categoryLabel}>
                      {getDocumentTypeLabel(document.document_type)}
                    </span>
                    <span className={styles.dateText}>
                      {formatDocumentDate(document.created_at)}
                    </span>
                  </div>
                  <p className={styles.description}>
                    {getSummaryPreview(document.summary)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
