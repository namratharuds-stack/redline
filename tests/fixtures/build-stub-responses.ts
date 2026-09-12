// These helpers exist so a future Analysis Engine test can build a fake
// OpenRouter API response body directly from a fixture's sidecar entries,
// without needing a live model call — the module-boundary mock/replay
// path described in ADR-0001 and issue 02-analysis-engine-core.
//
// Pure functions only: no test-runner imports, no app imports. The test
// runner for this repo hasn't been chosen yet, so this file must be usable
// from whichever one is picked later.

export type SidecarEntry = {
  category: string;
  sourceSentence: string;
  expectedSeverityBand: "low" | "medium" | "high";
};

type Flag = {
  category: string;
  severity: string;
  sourceSentence: string;
  explanation: string;
  counterOffer: string;
};

type AnalyzeResponse = {
  summary: string;
  flags: Flag[];
};

const EXPLANATIONS: Record<string, string> = {
  arbitration:
    "This clause forces disputes into individual arbitration and blocks joining a class action, limiting how you can seek relief.",
  auto_renewal:
    "This clause renews the agreement automatically and makes cancellation easy to miss.",
  personal_guarantee:
    "This clause makes the signer personally liable if the business entity defaults on its obligations.",
  scope_creep:
    "This clause lets the other party demand additional work beyond the agreed scope without additional pay.",
  non_compete:
    "This clause restricts your ability to take other work or start a competing business.",
  ip_assignment:
    "This clause transfers ownership of work broader than the scope of the engagement, including unrelated material.",
  indemnification:
    "This clause makes you responsible for funding the other party's legal defense, even for claims involving their own fault.",
  liability_cap:
    "This clause caps the other party's financial exposure regardless of the actual damages you might incur.",
  fee_escalator:
    "This clause lets a recurring fee increase unpredictably over the term.",
  early_termination:
    "This clause imposes a liquidated-damages-style penalty if you end the agreement early.",
  data_privacy:
    "This clause grants broad or perpetual rights over your content and usage data.",
};

const COUNTER_OFFERS: Record<string, string> = {
  arbitration:
    "Strike the mandatory arbitration and class-action waiver language; permit either party to bring claims in a court of competent jurisdiction.",
  auto_renewal:
    "Replace automatic renewal with a requirement that both parties affirmatively agree in writing to extend the term, with a simple email notice option.",
  personal_guarantee:
    "Remove the personal guarantee so only the business entity, not the individual signer, is liable for its obligations.",
  scope_creep:
    "Define scope precisely in an exhibit and bill any work beyond a stated revision allotment at an agreed hourly rate.",
  non_compete:
    "Narrow or remove the non-compete so it does not block ordinary work for other clients after the engagement ends.",
  ip_assignment:
    "Limit the assignment to deliverables actually described in the statement of work, not all work product created during the term.",
  indemnification:
    "Limit indemnification to claims arising from your own negligence or breach, excluding claims involving the other party's fault.",
  liability_cap:
    "Raise or remove the liability cap so it reflects the actual scale of harm a failure could cause.",
  fee_escalator:
    "Fix the fee for the term, or cap any increase at a modest, disclosed percentage agreed in advance.",
  early_termination:
    "Replace the liquidated-damages penalty with payment only for work already completed as of the termination date.",
  data_privacy:
    "Limit the data license to what is needed to deliver the service, remove the perpetual/irrevocable grant, and disclose any usage tracking plainly.",
};

/**
 * Builds the exact JSON shape the Analysis Engine's model-call boundary
 * should parse as a response to an analyze call, derived from a fixture's
 * sidecar entries.
 */
export function buildAnalyzeResponse(
  sidecarEntries: SidecarEntry[],
  summary: string
): AnalyzeResponse {
  return {
    summary,
    flags: sidecarEntries.map((entry) => ({
      category: entry.category,
      severity: entry.expectedSeverityBand,
      sourceSentence: entry.sourceSentence,
      explanation:
        EXPLANATIONS[entry.category] ??
        `This clause matches the "${entry.category}" red-line pattern.`,
      counterOffer:
        COUNTER_OFFERS[entry.category] ??
        `Renegotiate the "${entry.category}" clause to be more balanced.`,
    })),
  };
}

/**
 * Builds a plausible answer string for a stubbed answerQuestion call.
 */
export function buildAnswerResponse(answerText: string): string {
  return answerText;
}
