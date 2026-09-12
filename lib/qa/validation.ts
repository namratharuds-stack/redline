// Pure validation for a submitted Q&A question (ticket 06). Kept free of
// React/Next.js so it can be unit-tested with plain inputs, and used by both
// the client (to gate the submit button) and the API route.

/** True once whitespace is stripped — a question of only spaces isn't a real
 * one, and shouldn't be sent to the model. */
export function isSubmittableQuestion(question: string): boolean {
  return question.trim().length > 0;
}
