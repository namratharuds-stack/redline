# Canonical red-line category keys

Every ticket that stores, tests, or displays a category must use these exact
string keys (snake_case) as the `category` value. Do not invent synonyms.
Display labels are what a user sees; keys are what code and fixtures use.

| key | display label | one-line definition (from PRD.md) |
|---|---|---|
| `arbitration` | Arbitration / class-action waiver | Forces disputes into individual arbitration, blocks joining a class action |
| `auto_renewal` | Auto-renewal | Renews automatically; cancellation is made difficult or easy to miss |
| `personal_guarantee` | Personal guarantee | Signer is personally liable if the business/entity defaults |
| `scope_creep` | Scope creep / unlimited revisions | Vague scope lets the other party demand unlimited extra work or withhold payment |
| `non_compete` | Non-compete | Restricts taking a new job or starting a competing business |
| `ip_assignment` | IP assignment ambiguity | Unclear or missing transfer of ownership of created work |
| `indemnification` | Indemnification | Makes one party responsible for funding the other's legal defense |
| `liability_cap` | Liability cap | Caps a vendor's financial exposure regardless of actual damages |
| `fee_escalator` | Fee / rent escalator | Rent or fees can increase unpredictably (CPI, fixed annual bump, pass-through) |
| `early_termination` | Early termination penalty | Breaking a lease/contract early triggers a liquidated-damages-style penalty |
| `data_privacy` | Data/privacy rights grab | Broad or perpetual rights to user content/data, or buried tracking consent |

These 11 keys are the full v1 red-line list from PRD.md. The 7 starter
red lines a new user's list is pre-populated with (ticket 04) are:
`scope_creep`, `ip_assignment`, `non_compete`, `indemnification`,
`personal_guarantee`, `auto_renewal`, `arbitration`. The remaining 4
(`liability_cap`, `fee_escalator`, `early_termination`, `data_privacy`) exist
as categories the engine/eval suite must support, but are not pre-populated
for a new user — a user can add any of them like any custom red line.

## Severity

Three-tier scale: `"low" | "medium" | "high"` (spec default, ticket-confirmed
in BUILD-REPORT.md). Judged per-document from the clause's actual wording,
never looked up from a fixed table keyed by category.

## Flag shape (all tickets must agree on this)

```ts
type Flag = {
  category: string;       // one of the 11 keys above
  severity: "low" | "medium" | "high";
  sourceSentence: string; // exact verbatim substring of the document's extracted text
  explanation: string;    // plain-English, grounded only in sourceSentence/documentText
  counterOffer: string;   // drafted alternative language for this specific clause
};

type AnalyzeResult = {
  summary: string;
  flags: Flag[];
};
```

`analyzeDocument(documentText: string, redLines: RedLine[]) => Promise<AnalyzeResult>`
`answerQuestion(documentText: string, question: string) => Promise<string>`

`RedLine = { id: string; category: string; description: string }` — a user's
own red line always carries the category key it matches against, plus their
own editable description text (ticket 04).
