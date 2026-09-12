import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDocumentTypeLabel } from "@/lib/documents/document-types";
import { formatDocumentDate } from "@/lib/documents/format-date";
import { AnalysisResult } from "@/components/analysis-result";
import type { AnalyzeResult, Flag } from "@/lib/analysis-engine/types";
import homeClientStyles from "@/app/home/home-client.module.css";
import styles from "../library.module.css";

type RouteParams = { params: { id: string } };

type DocumentDetailRow = {
  id: string;
  document_type: string;
  summary: string;
  flags: Flag[];
  created_at: string;
};

/**
 * Renders one saved document exactly as it was analyzed — the stored
 * `summary`/`flags`, never a re-run of analyzeDocument (the whole point of
 * the library is that reopening a document doesn't cost another Analysis
 * Engine call).
 *
 * The query is scoped to `.eq("user_id", user.id)` for a correct query on
 * its own terms, but RLS (documents_select_own) is the real guard: another
 * user's document id matches zero rows under RLS, which we treat the same
 * as a genuinely missing id — notFound() — since Postgres never reveals
 * the row exists.
 */
export default async function LibraryDocumentPage({ params }: RouteParams) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: document, error } = await supabase
    .from("documents")
    .select("id, document_type, summary, flags, created_at")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !document) {
    notFound();
  }

  const row = document as DocumentDetailRow;
  const result: AnalyzeResult = { summary: row.summary, flags: row.flags };

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.wordmark}>
          Red<span>line</span>
        </span>
        <Link href="/home/library" className={styles.navLink}>
          Back to library
        </Link>
      </nav>

      <main className={styles.main}>
        <p className={homeClientStyles.cardLabel}>
          {getDocumentTypeLabel(row.document_type)} ·{" "}
          {formatDocumentDate(row.created_at)}
        </p>
        <h1 className={styles.heading}>Saved analysis</h1>
        <p className={styles.body}>
          This is exactly what Redline found when this document was
          analyzed. Reopening it doesn&rsquo;t run the analysis again.
        </p>
      </main>

      <section className={homeClientStyles.resultState}>
        <AnalysisResult result={result} />
      </section>
    </div>
  );
}
