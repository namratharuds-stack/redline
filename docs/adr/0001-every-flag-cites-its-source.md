# Every risk flag cites its source sentence

## Decision
Every risk flag Redline produces must include the exact sentence from the
uploaded document that it is based on. If a flag cannot be traced to a
specific source sentence, Redline does not show that flag. A flag with no
shown source is a bug, not a formatting gap to fix later.

## Alternatives
- Let the model describe risks in its own words, with no quote requirement.
  Reads more naturally but gives the user nothing to check the claim against.
- Cite a paragraph or section number instead of a sentence. Weaker signal —
  a user can't tell which part of the paragraph actually triggered the flag.
- Show sources only for "high severity" flags, freeform for the rest.
  Rejected: it would make the presence of a citation, rather than the flag
  itself, an implicit severity signal.

## Why
A user can take the exact sentence Redline shows them, find it in their own
document, and judge for themselves whether it means what the flag claims.
The flag is falsifiable: it either quotes real text that supports the claim,
or it doesn't, and that's checkable without trusting the model's judgment.
This also gives the user something concrete to put in a counter-offer or
send to a lawyer, instead of a paraphrase they'd have to re-verify anyway.

## Consequences
- Flags are bounded by what the extracted text actually contains. A real
  risk that isn't stated in any single sentence (e.g. an omission, or a risk
  that only emerges by combining two clauses) can't be surfaced as a flag
  under this rule.
- OCR is off the table for this reason too: a citation pointing at
  misread text is worse than no citation.
- Testing needs a way to verify quoted text is a real substring of the
  parsed document, not just that the flag "looks plausible" — this becomes
  a checkable property, not just an eyeball review.
- Prompting and parsing must preserve enough fidelity that sentences can be
  matched back to the source text; any preprocessing that mangles sentence
  boundaries breaks this guarantee.
