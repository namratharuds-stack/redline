// Pure validation for saving an analyzed document to a user's library
// (ticket 05). Kept free of Supabase/Next.js so it can be unit-tested with
// plain inputs, and run inside the API route before anything reaches the
// database.

import { DOCUMENT_TYPE_KEYS } from "./document-types";

/** True when `documentType` is one of the 4 canonical document-type keys.
 * A saved document's type drives the library selector and ticket 08's
 * analytics, so it can't be arbitrary text. */
export function isKnownDocumentType(documentType: string): boolean {
  return DOCUMENT_TYPE_KEYS.includes(documentType);
}
