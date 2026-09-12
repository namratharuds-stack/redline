// zod schemas used to validate untrusted model output before the Analysis
// Engine trusts it. Kept separate from types.ts (the product-facing types)
// so the "what shape do we accept from the model" concern is distinct from
// "what shape does the rest of the app get back".

import { z } from "zod";

export const candidateFlagSchema = z.object({
  category: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  sourceSentence: z.string(),
  explanation: z.string(),
  counterOffer: z.string(),
});

export const analyzeModelResponseSchema = z.object({
  summary: z.string(),
  flags: z.array(candidateFlagSchema),
});

export type CandidateFlag = z.infer<typeof candidateFlagSchema>;
export type AnalyzeModelResponse = z.infer<typeof analyzeModelResponseSchema>;

export const answerModelResponseSchema = z.object({
  answer: z.string(),
});

export type AnswerModelResponse = z.infer<typeof answerModelResponseSchema>;
