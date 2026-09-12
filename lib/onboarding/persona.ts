// Self-identified persona, captured optionally during onboarding (ticket 08).
// Like `{ onboarded: true }` (ticket 07, see should-show-onboarding.ts), this
// is a single value stored in Supabase Auth's per-user `user_metadata`
// (`{ persona: <value> }`) rather than a new table — see
// components/onboarding-intro.tsx (where it's asked) and
// app/home/home-client.tsx (where supabase.auth.updateUser is called).
//
// This file only owns the allowed set and the pure check that a value
// belongs to it before anything gets sent.

export const PERSONA_OPTIONS = [
  { value: "freelancer", label: "Freelancer or independent contractor" },
  { value: "small_business_owner", label: "Small business owner" },
  { value: "landlord_or_tenant", label: "Landlord or tenant" },
  { value: "other", label: "Something else" },
] as const;

export type Persona = (typeof PERSONA_OPTIONS)[number]["value"];

const PERSONA_VALUES: readonly string[] = PERSONA_OPTIONS.map(
  (option) => option.value
);

/** True only for one of the canonical persona values above. Guards against
 * a malformed or tampered-with value (e.g. free text) ever reaching
 * user_metadata — this is passive analytics, so a bad value there would
 * just sit in the aggregate with no way to clean it up. */
export function isValidPersona(value: string): value is Persona {
  return PERSONA_VALUES.includes(value);
}
