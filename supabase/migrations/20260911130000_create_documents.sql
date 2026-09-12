-- Ticket 05: per-user document library.
--
-- After a successful analysis, home-client.tsx saves the document's
-- extracted text, its type, and the analysis result (summary + flags) here,
-- scoped to the authenticated user. The library view (app/home/library)
-- lists these; opening one (app/home/library/[id]) renders the stored
-- summary/flags directly and never re-runs the Analysis Engine.

create extension if not exists pgcrypto;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  document_type text not null check (
    document_type in ('contract', 'lease', 'freelance_agreement', 'tos')
  ),
  document_text text not null,
  summary text not null,
  flags jsonb not null,
  created_at timestamptz not null default now()
);

-- Every list query filters by user_id and orders by created_at, so index
-- both (the library view's default sort is newest first).
create index if not exists documents_user_id_created_at_idx
  on public.documents (user_id, created_at desc);

alter table public.documents enable row level security;

-- Four separate policies (rather than one FOR ALL) so each command's
-- condition is explicit and auditable on its own — same style as
-- red_lines_select_own/insert_own/update_own/delete_own in
-- 20260911120000_create_red_lines.sql. This ticket only needs select and
-- insert, but update/delete are included now for consistency with that
-- pattern and so a later ticket doesn't have to touch RLS to add them.

create policy "documents_select_own"
  on public.documents
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "documents_insert_own"
  on public.documents
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "documents_update_own"
  on public.documents
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "documents_delete_own"
  on public.documents
  for delete
  to authenticated
  using (auth.uid() = user_id);
