import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { analyzeDocument } from "@/lib/analysis-engine";

// Request body shape this route accepts from the client. Mirrors the
// RedLine type in lib/analysis-engine/types.ts.
const requestSchema = z.object({
  documentText: z.string().min(1),
  redLines: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      description: z.string(),
    })
  ),
});

/**
 * Server-side analysis endpoint. Runs the real Analysis Engine
 * (`analyzeDocument`) against the caller's document text and red lines.
 *
 * OPENROUTER_API_KEY is read inside the Analysis Engine, server-side only —
 * it never reaches the browser. Requires an authenticated session; returns
 * 401 otherwise.
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

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Request body must include documentText and redLines." },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeDocument(
      parsed.data.documentText,
      parsed.data.redLines
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("analyzeDocument failed", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 502 }
    );
  }
}
