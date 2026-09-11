# 09: Full evaluation suite

**What to build:** The labeled evaluation suite from the spec's Testing Decisions, run against the real Analysis Engine from ticket 02: per-category detection rate across all 11 red-line categories, false-positive rate against non-matching documents, an unsupported-claim check, and a human-ranked severity-correlation benchmark.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] A labeled eval set exists with real or representative clauses for each of the 11 red-line categories
- [ ] Per-category detection rate is measured by running the eval set through `analyzeDocument`; any category at or near 0% is surfaced as a failure, not silently averaged away
- [ ] A false-positive suite runs non-matching documents/clauses through `analyzeDocument` and asserts they are not flagged
- [ ] An unsupported-claim check verifies no summary sentence, flag explanation, counter-offer, or Q&A answer contains a claim absent from the fixture's text (judged, not pure string match)
- [ ] A human-ranked benchmark set of documents exists, and the engine's severity ordering is checked for correlation (not exact match) against that human ranking
- [ ] The full suite runs without live model calls, using the mock/replay boundary from ticket 02
