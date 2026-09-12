import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { validateRedLineInput } from "@/lib/red-lines/validation";

const updateRedLineSchema = z.object({
  category: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

type RouteParams = { params: { id: string } };

/**
 * Edits one of the authenticated user's own red lines (category and/or
 * description). Requires an authenticated session; returns 401 otherwise.
 *
 * The update is scoped with `.eq("id", ...)` for a correct query, but the
 * real cross-user guard is RLS (red_lines_update_own) — a request for
 * someone else's row id matches zero rows under RLS and comes back as a 404
 * here, not a 403, since Postgres never reveals the row exists.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
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

  const parsed = updateRedLineSchema.safeParse(body);
  if (!parsed.success || (!parsed.data.category && !parsed.data.description)) {
    return NextResponse.json(
      { error: "Request body must include category and/or description." },
      { status: 400 }
    );
  }

  // Validate against the current row for any field the caller didn't
  // include, so e.g. an edit that only changes the description still gets
  // checked against the row's existing (valid) category.
  const { data: current, error: fetchError } = await supabase
    .from("red_lines")
    .select("id, category, description")
    .eq("id", params.id)
    .single();

  if (fetchError || !current) {
    return NextResponse.json({ error: "Red line not found." }, { status: 404 });
  }

  const validation = validateRedLineInput({
    category: parsed.data.category ?? current.category,
    description: parsed.data.description ?? current.description,
  });
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("red_lines")
    .update({
      ...(parsed.data.category ? { category: parsed.data.category } : {}),
      ...(parsed.data.description
        ? { description: parsed.data.description }
        : {}),
    })
    .eq("id", params.id)
    .select("id, category, description")
    .single();

  if (error || !data) {
    console.error("update red_line failed", error);
    return NextResponse.json(
      { error: "Couldn't save that change. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ redLine: data });
}

/**
 * Removes one of the authenticated user's own red lines. Requires an
 * authenticated session; returns 401 otherwise. As with PATCH, RLS
 * (red_lines_delete_own) is the real guard against deleting someone else's
 * row.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("red_lines")
    .delete()
    .eq("id", params.id)
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Red line not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
