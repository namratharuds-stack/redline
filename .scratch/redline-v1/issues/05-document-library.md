# 05: Document library

**What to build:** Analyzed documents are saved to Supabase per user and listed in a library view. Reopening a past document shows its stored summary, flags, and counter-offers without re-running analysis.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] After analysis, a document's extracted text, type, upload timestamp, and analysis result (summary, flags, counter-offers) are saved to Supabase, scoped to the authenticated user
- [ ] A library view lists a user's past documents
- [ ] Opening a document from the library displays its previously stored summary, flags, and counter-offers without calling the Analysis Engine again
- [ ] A user cannot see another user's library or documents
