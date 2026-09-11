# 02: Analysis Engine core

**What to build:** The Analysis Engine module, the single seam for this product's core behavior. It exposes `analyzeDocument(documentText, redLines) → { summary, flags[] }` and `answerQuestion(documentText, question) → answer`, with the OpenRouter call isolated at the module's edge so it can be mocked/replayed in tests. This ticket delivers the real implementation that ticket 03's stub gets swapped for: same interface, no changes needed upstream.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `analyzeDocument(documentText, redLines)` returns a summary and a list of flags, each with category, severity, source sentence, explanation, and counter-offer
- [ ] A flag is only returned if its source sentence is an exact substring of `documentText`; otherwise it is dropped before returning (per ADR-0001), verified by a mechanical test rather than eyeballing
- [ ] Severity is computed from the document's own text per flag, not looked up from a fixed table keyed by category
- [ ] `answerQuestion(documentText, question)` returns an answer grounded only in `documentText`, and explicitly states when the text doesn't address the question
- [ ] The OpenRouter call is isolated behind a boundary that tests can mock or replay from recorded fixtures, with no live model call required to run the test suite
- [ ] A basic fixture-based test suite exists covering at least one clause per red-line category on the happy path (the full eval suite is ticket 09)
