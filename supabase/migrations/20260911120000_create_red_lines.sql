-- Ticket 04: per-user, editable red-lines list.
--
-- A user's red_lines rows are the list their analyses run against, replacing
-- the hardcoded STARTER_RED_LINES from ticket 03. The app seeds a new
-- user's first 7 rows from lib/red-lines/starter-red-lines.ts (see
-- lib/red-lines/get-or-seed-red-lines.ts) — those seeded rows are ordinary
-- owned rows from that point on, editable/removable like any other.

-- gen_random_uuid() lives in pgcrypto; Supabase projects usually have it
-- available already, but this migration doesn't assume that.
create extension if not exists pgcrypto;

create table if not exists public.red_lines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category text not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- Every list/seed-check query filters by user_id, so index it.
create index if not exists red_lines_user_id_idx on public.red_lines (user_id);

alter table public.red_lines enable row level security;

-- Four separate policies (rather than one FOR ALL) so each command's
-- condition is explicit and auditable on its own.

create policy "red_lines_select_own"
  on public.red_lines
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "red_lines_insert_own"
  on public.red_lines
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "red_lines_update_own"
  on public.red_lines
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "red_lines_delete_own"
  on public.red_lines
  for delete
  to authenticated
  using (auth.uid() = user_id);
