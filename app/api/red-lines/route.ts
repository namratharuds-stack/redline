import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getOrSeedRedLines } from "@/lib/red-lines/get-or-seed-red-lines";
import { validateRedLineInput } from "@/lib/red-lines/validation";

const createRedLineSchema = z.object({
  category: z.string().min(1),
  description: z.string().min(1),
});

/**
 * Lists the authenticated user's red lines, seeding them with the 7 starter
 * entries the first time this is called for a user with none yet (see
 * lib/red-lines/get-or-seed-red-lines.ts). Requires an authenticated
 * session; returns 401 otherwise.
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const redLines = await getOrSeedRedLines(supabase, user.id);
    return NextResponse.json({ redLines });
  } catch (error) {
    console.error("getOrSeedRedLines failed", error);
    return NextResponse.json(
      { error: "Couldn't load your red lines. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Adds a new red line owned by the authenticated user. Requires an
 * authenticated session; returns 401 otherwise. RLS (red_lines_insert_own)
 * is the real enforcement that the inserted row can only belong to the
 * caller — the `user_id` we pass here just has to match `auth.uid()` for
 * the insert to be allowed at all.
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

  const parsed = createRedLineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Request body must include category and description." },
      { status: 400 }
    );
  }

  const validation = validateRedLineInput(parsed.data);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("red_lines")
    .insert({
      user_id: user.id,
      category: parsed.data.category,
      description: parsed.data.description,
    })
    .select("id, category, description")
    .single();

  if (error) {
    console.error("insert red_line failed", error);
    return NextResponse.json(
      { error: "Couldn't add that red line. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ redLine: data }, { status: 201 });
}
