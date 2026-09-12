// The Analysis Engine's model-call boundary. This is the ONLY file in the
// codebase that is allowed to touch `fetch` for OpenRouter or read the
// OPENROUTER_* environment variables. Everything else in the engine talks
// to `callModel`, which returns the parsed (but not yet zod-validated) JSON
// body the model produced. Tests mock `fetch` itself, never this function,
// so the request-building and env-var logic below is exercised for real.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export type ChatMessage = {
  role: "system" | "user";
  content: string;
};

/**
 * Calls OpenRouter's chat completions endpoint with a JSON-object response
 * format and returns the parsed JSON payload the model produced (as
 * `unknown` — callers must validate it with zod before trusting it).
 *
 * Throws a clear, descriptive error if OPENROUTER_API_KEY or
 * OPENROUTER_MODEL is not set, if the HTTP call fails, or if the model's
 * response isn't valid JSON. Never fabricates or falls back to a default
 * model/response.
 */
export async function callModel(messages: ChatMessage[]): Promise<unknown> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Set it in the environment before calling the Analysis Engine."
    );
  }

  const model = process.env.OPENROUTER_MODEL;
  if (!model) {
    throw new Error(
      "OPENROUTER_MODEL is not set. Set it in the environment before calling the Analysis Engine."
    );
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      provider: {
        order: ["fireworks"],
        allow_fallbacks: false,
        require_parameters: true,
      },
      reasoning: { effort: "low" },
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(
      `OpenRouter request failed with status ${response.status}: ${bodyText}`
    );
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error(
      "OpenRouter response did not contain a message content string."
    );
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error(
      "OpenRouter response content was not valid JSON despite requesting response_format: json_object."
    );
  }
}
