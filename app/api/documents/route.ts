import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isKnownDocumentType } from "@/lib/documents/validation";

// Mirrors the Flag type in lib/analysis-engine/types.ts.
const flagSchema = z.object({
  category: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  sourceSentence: z.string(),
  explanation: z.string(),
  counterOffer: z.string(),
});

const createDocumentSchema = z.object({
  documentType: z.string().min(1),
  documentText: z.string().min(1),
  summary: z.string().min(1),
  flags: z.array(flagSchema),
});

/**
 * Saves an already-completed analysis to the authenticated user's library:
 * the document's extracted text, its type, and the analysis result
 * (summary + flags). Requires an authenticated session; returns 401
 * otherwise. RLS (documents_insert_own) is the real enforcement that the
 * inserted row can only belong to the caller — the `user_id` we pass here
 * just has to match `auth.uid()` for the insert to be allowed at all.
 *
 * Called from home-client.tsx right after analysis succeeds, without
 * blocking the results already shown to the user — a failure here should
 * never take away an analysis the user already has in front of them.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const parsed = createDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Request body must include documentType, documentText, summary, and flags.",
      },
      { status: 400 }
    );
  }

  if (!isKnownDocumentType(parsed.data.documentType)) {
    return NextResponse.json(
      { error: "That's not a document type Redline recognizes." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      document_type: parsed.data.documentType,
      document_text: parsed.data.documentText,
      summary: parsed.data.summary,
      flags: parsed.data.flags,
    })
    .select("id")
    .single();

  if (error) {
    console.error("insert document failed", error);
    return NextResponse.json(
      { error: "Couldn't save this to your library." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
