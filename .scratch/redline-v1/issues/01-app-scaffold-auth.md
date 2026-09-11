# 01: App scaffold + Supabase auth

**What to build:** A deployed Next.js app (on Vercel) with Supabase Auth wired up. A user can sign up, log in, log out, and land on an empty authenticated home page. No product features yet: this is the foundation everything else builds on.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] A visitor can sign up for an account and log in via Supabase Auth
- [ ] A logged-in user lands on an authenticated home page
- [ ] A user can log out
- [ ] Root-route behavior for logged-out visitors is owned by ticket 10 (landing page), not by this ticket; login and signup exist as their own routes for ticket 10 to link to
- [ ] The app is deployed to Vercel and connected to a real Supabase project
- [ ] No secrets are committed; credentials live in `.env.local` (gitignored)
