# 06: Q&A box

**What to build:** On an analyzed document's page, a user can ask a free-text question and get an answer grounded only in that document's text, via the Analysis Engine's `answerQuestion` interface.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] A user can type a question about the currently viewed document and submit it
- [ ] The answer shown is produced by `answerQuestion(documentText, question)` and states only what the document's text supports
- [ ] When the document doesn't address the question, the answer explicitly says so rather than guessing
- [ ] The Q&A box works against ticket 03's engine interface (stub or real, whichever is wired in at the time)
