# 04: Editable, persisted red-lines list

**What to build:** The red-lines list moves from ticket 03's hardcoded set to a per-user list persisted in Supabase. A user can add, edit, or remove a red line, and their next analysis reflects the change.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] A new user's red-lines list is pre-populated with the 7 starter entries (scope creep, IP assignment, non-compete, indemnification, personal guarantees, auto-renewal, arbitration)
- [ ] A user can add a custom red line
- [ ] A user can edit an existing red line's description
- [ ] A user can remove a red line
- [ ] The red-lines list is scoped to the authenticated user and persisted in Supabase
- [ ] The next document analysis a user runs uses their current (possibly edited) red-lines list, replacing the hardcoded set from ticket 03
