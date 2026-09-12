// Pure validation for adding/editing a user's red line (ticket 04). Kept
// free of Supabase/Next.js so it can be unit-tested with plain inputs, and
// run inside the API routes before anything reaches the database.

import { CANONICAL_CATEGORY_KEYS } from "./category-labels";

export type RedLineInput = {
  category: string;
  description: string;
};

export type ValidationResult = { valid: true } | { valid: false; error: string };

/** True once whitespace is stripped — a description of only spaces isn't a
 * real one. */
export function isNonEmptyDescription(description: string): boolean {
  return description.trim().length > 0;
}

/** True when `category` is one of the 11 canonical red-line category keys
 * from .scratch/redline-v1/red-line-categories.md. A red line's category is
 * what the Analysis Engine matches flags against, so it can't be arbitrary
 * text. */
export function isKnownCategory(category: string): boolean {
  return CANONICAL_CATEGORY_KEYS.includes(category);
}

/**
 * Validates a full add/edit payload. Returns the first failing rule so the
 * API route can return one clear error message.
 */
export function validateRedLineInput(input: RedLineInput): ValidationResult {
  if (!isKnownCategory(input.category)) {
    return { valid: false, error: "That's not a category Redline recognizes." };
  }
  if (!isNonEmptyDescription(input.description)) {
    return { valid: false, error: "Description can't be empty." };
  }
  return { valid: true };
}
