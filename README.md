# Redline

**Know what you're signing.** Upload a contract, lease, or freelance agreement. Redline flags the risky clauses, quotes the exact sentence each one came from, and drafts a counter-offer for each.

[**Live app →**](https://redline-sigma-five.vercel.app)

---

## Who it's for

Freelancers, independent contractors, and small-business owners signing vendor, contractor, lease, and partnership agreements. Flat-fee lawyer review runs $250–$750 for a standard contract and $500–$5,000 for a lease, so most people either skip review or paste the document into a general chatbot. A chatbot won't rank severity, won't draft a counter-offer, and can invent clauses. The research behind this is in [`research/`](research) and [`PRD.md`](PRD.md).

## What it does

- **Plain-English summary** of the document
- **Risk flags ranked by severity.** Each flag shows the exact source sentence, and severity is judged from that document's own wording, not a fixed default for each category.
- **A drafted counter-offer** for every flagged clause
- **Q&A** that answers only from the uploaded document
- **Your own red-lines list**, which decides what gets flagged. It starts with scope creep, IP assignment, non-compete, indemnification, personal guarantees, auto-renewal, and arbitration.
- **A saved library** of past documents

## The one rule: every flag cites its source

A flag Redline can't trace to a verbatim sentence in the document gets **dropped, not shown** ([ADR-0001](docs/adr/0001-every-flag-cites-its-source.md)). That makes every flag checkable: you can find the quoted sentence in your own document and judge whether it means what the flag says.

This rule drove other product decisions too:
- **No OCR.** A citation pointing at misread text is worse than no citation, so scanned PDFs are rejected with a clear message.
- **Parsing happens in the browser.** Only the extracted text is sent or stored, never the raw file.
- **The citation check is production code, not just a test.** Model output is validated with `zod`, and any flag whose quote isn't an exact substring of the document is removed before the user sees it.

## How it's evaluated

[`tests/eval/`](tests/eval) runs against fixture documents:

| Check | What it tests |
|---|---|
| Detection rate | Each of the 11 red-line categories is caught on a contract with all 11 planted |
| False positives | A clean agreement returns zero flags |
| Source citation | Every returned quote is an exact substring of the document |
| Severity correlation | Spearman correlation between returned severities and benchmark bands |
| Unsupported claims | An LLM judge checks that no output states something the text doesn't support (runs only when an API key is set) |

In the first live run (`npm run smoke`), all 11 planted categories were detected and all 11 quotes matched the source text exactly. That's one document, not a benchmark. The severity benchmark is still a stand-in and needs a human-ranked set before it counts as evidence of judgment quality. [`BUILD-REPORT.md`](BUILD-REPORT.md) lists what's verified and what isn't.

## Stack

Next.js on Vercel · Supabase for auth and Postgres with row-level security · model calls through OpenRouter, with the model set by environment variable · `pdfjs-dist` for in-browser PDF parsing · `zod` for output validation · Vitest

## Run it locally

```bash
npm install
npm run dev
```

Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENROUTER_API_KEY`, and `OPENROUTER_MODEL`, then run the SQL in [`supabase/migrations/`](supabase/migrations) against your Supabase project.

```bash
npm test          # unit + eval suite
npm run smoke     # one live run against the fixture contract
```

## Out of scope for v1

Payments, OCR, and document sharing between users. Redline is a reading aid and doesn't replace legal advice.

---

Built by [Namratha Rudrappa](https://namratharudrappa.com)
