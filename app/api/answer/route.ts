import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { answerQuestion } from "@/lib/analysis-engine";

// Request body shape this route accepts from the client.
const requestSchema = z.object({
  documentText: z.string().min(1),
  question: z.string().min(1),
});

/**
 * Server-side Q&A endpoint. Runs the real Analysis Engine
 * (`answerQuestion`) against the caller's document text and question.
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
      { error: "Request body must include documentText and question." },
      { status: 400 }
    );
  }

  if (parsed.data.question.trim().length === 0) {
    return NextResponse.json(
      { error: "Question can't be empty." },
      { status: 400 }
    );
  }

  try {
    const answer = await answerQuestion(
      parsed.data.documentText,
      parsed.data.question
    );
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("answerQuestion failed", error);
    return NextResponse.json(
      { error: "We couldn't answer that just now. Please try again." },
      { status: 502 }
    );
  }
}
