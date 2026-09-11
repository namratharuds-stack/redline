# 10: Landing page

**What to build:** A public, unauthenticated marketing page that becomes the root ("/") for logged-out visitors, replacing ticket 01's original straight-to-login behavior. It describes what Redline does and its source-citation guarantee, with a call to action to sign up or log in. No pricing, no free trial, and no unverifiable claims.

**Blocked by:** 01 (needs real signup/login routes for the call to action to link to)

**Status:** ready-for-agent

- [ ] A logged-out visitor lands on the landing page at "/"; a logged-in visitor is routed to the authenticated app home page instead, not the landing page
- [ ] The page describes Redline's mechanism and feature list (summary, flags with source sentences, counter-offers, Q&A, editable red-lines list, library) and its source-citation guarantee
- [ ] The page contains no testimonial, user count, or other unverifiable statistic; every claim traces to the product's actual mechanism, documented feature list, or PRD.md's cited research
- [ ] The page contains no pricing or payment messaging anywhere
- [ ] The page offers no way to run a document analysis without an account; its only calls to action lead to sign up or log in
