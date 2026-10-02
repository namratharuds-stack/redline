# supabase

SQL migrations for Redline's database. There is no `config.toml`, so the Supabase CLI hasn't been set up for local development. The migrations have been applied by pasting them into the Supabase SQL Editor (see `BUILD-REPORT.md`).

## Migrations

Run them in filename order. The timestamp prefix sets the order.

| File | Creates |
| --- | --- |
| `20260911120000_create_red_lines.sql` | `public.red_lines`: a user's editable red-lines list. |
| `20260911130000_create_documents.sql` | `public.documents`: a user's saved document library. |

### `red_lines`

Columns: `id`, `user_id`, `category`, `description`, `created_at`.

The app seeds a new user's first seven rows from `lib/red-lines/starter-red-lines.ts` (through `lib/red-lines/get-or-seed-red-lines.ts`). After that they are ordinary rows the user can edit or delete.

### `documents`

Columns: `id`, `user_id`, `document_type`, `document_text`, `summary`, `flags` (jsonb), `created_at`.

`document_type` must be one of `contract`, `lease`, `freelance_agreement`, `tos`. Only the extracted text is stored, never the uploaded file. The library view reads the saved summary and flags and does not re-run the analysis.

## Row-level security

Both tables have RLS turned on. Each has four policies (select, insert, update, delete), all for the `authenticated` role, and all of them check `auth.uid() = user_id`. A signed-in user can only see and change their own rows. Deleting a user in `auth.users` deletes their rows too (`on delete cascade`).

## Applying the migrations

1. Open the project in the Supabase dashboard and go to the SQL Editor.
2. Paste and run each file, oldest first.
3. Check that both tables exist under Table Editor, with RLS enabled.

The tables and indexes use `if not exists`, but the `create policy` statements don't. Running a migration a second time fails at the first policy. If you need to re-run one, drop that table's policies first.

## Adding a migration

Add a new file with a later timestamp, like `YYYYMMDDHHMMSS_what_it_does.sql`. Don't edit a migration that has already been applied.
