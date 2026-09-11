# 03: Upload, analyze, and display results

**What to build:** The first end-to-end user-visible slice. A logged-in user uploads a document, it's parsed client-side in the browser, the extracted text is run through the Analysis Engine's interface, and the page displays the summary plus flags (severity, source sentence, counter-offer). Uses a hardcoded set of the 7 starter red lines — no editing or persistence of the red-lines list yet (that's ticket 04).

Build this against the Analysis Engine's interface (`analyzeDocument`/`answerQuestion` shape from ticket 02) using a stub implementation that returns fixture-backed results. This decouples the UI from ticket 02's completion — when the real engine lands, it drops in behind the same interface with no changes needed here.

**Blocked by:** 01 (needs auth + app shell)

**Status:** ready-for-agent

- [ ] A logged-in user can upload a contract/lease/freelance agreement/ToS file
- [ ] The file is parsed in the browser; only the extracted text is sent onward — the raw file is never uploaded or stored
- [ ] The extracted text and the 7 hardcoded starter red lines are passed to the Analysis Engine interface (stub implementation for this ticket)
- [ ] The page displays the returned plain-English summary
- [ ] The page displays each flag with its severity, exact source sentence, explanation, and counter-offer
- [ ] A document with no matching flags shows a clean "no flags found" state, not an error or a fabricated flag
- [ ] The stub implementation conforms exactly to the interface ticket 02 will implement, so swapping it in requires no changes to this ticket's code
