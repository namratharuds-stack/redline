import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeDocument, answerQuestion } from "./index";
import type { RedLine } from "./types";
import {
  buildAnalyzeResponse,
  buildAnswerResponse,
  type SidecarEntry,
} from "../../tests/fixtures/build-stub-responses";
import adhesionSidecar from "../../tests/fixtures/adhesion-contract.sidecar.json";

const FIXTURES_DIR = join(process.cwd(), "tests", "fixtures");

const adhesionText = readFileSync(
  join(FIXTURES_DIR, "adhesion-contract.txt"),
  "utf-8"
);
const cleanText = readFileSync(
  join(FIXTURES_DIR, "clean-agreement.txt"),
  "utf-8"
);

const ALL_CATEGORY_KEYS = [
  "arbitration",
  "auto_renewal",
  "personal_guarantee",
  "scope_creep",
  "non_compete",
  "ip_assignment",
  "indemnification",
  "liability_cap",
  "fee_escalator",
  "early_termination",
  "data_privacy",
] as const;

const allRedLines: RedLine[] = ALL_CATEGORY_KEYS.map((category, index) => ({
  id: `rl-${index}`,
  category,
  description: `Flag anything matching the ${category} category.`,
}));

/** Builds a fake OpenRouter chat-completions response body carrying `content`. */
function fakeOpenRouterResponse(content: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content: JSON.stringify(content) } }],
    }),
    text: async () => "",
  };
}

function mockFetchReturning(content: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(fakeOpenRouterResponse(content));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** The system prompt from the first request `fetchMock` received. */
function systemPromptSentTo(fetchMock: ReturnType<typeof mockFetchReturning>) {
  const body = JSON.parse(fetchMock.mock.calls[0][1].body as string) as {
    messages: { role: string; content: string }[];
  };
  return body.messages.find((m) => m.role === "system")?.content ?? "";
}

beforeEach(() => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-api-key");
  vi.stubEnv("OPENROUTER_MODEL", "test-model");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("analyzeDocument", () => {
  it("returns one flag per category for a document covering all 11 categories", async () => {
    mockFetchReturning(
      buildAnalyzeResponse(adhesionSidecar as SidecarEntry[], "some summary")
    );

    const result = await analyzeDocument(adhesionText, allRedLines);

    expect(result.summary).toBe("some summary");
    expect(result.flags).toHaveLength(11);

    const returnedCategories = result.flags.map((f) => f.category).sort();
    expect(returnedCategories).toEqual([...ALL_CATEGORY_KEYS].sort());

    for (const entry of adhesionSidecar as SidecarEntry[]) {
      const flag = result.flags.find((f) => f.category === entry.category);
      expect(flag).toBeDefined();
      expect(flag?.severity).toBe(entry.expectedSeverityBand);
      expect(flag?.sourceSentence).toBe(entry.sourceSentence);
    }
  });

  it("only returns flags whose sourceSentence is an exact substring of the document text", async () => {
    mockFetchReturning(
      buildAnalyzeResponse(adhesionSidecar as SidecarEntry[], "some summary")
    );

    const result = await analyzeDocument(adhesionText, allRedLines);

    expect(result.flags.length).toBeGreaterThan(0);
    for (const flag of result.flags) {
      expect(adhesionText.includes(flag.sourceSentence)).toBe(true);
    }
  });

  it("drops a candidate flag whose sourceSentence is not an exact substring of the document", async () => {
    const rewordedSentence =
      "Any dispute, claim, or controversy that relates to this Agreement must be resolved through binding arbitration.";
    expect(adhesionText.includes(rewordedSentence)).toBe(false);

    const sidecarWithBadEntry: SidecarEntry[] = [
      ...(adhesionSidecar as SidecarEntry[]),
      {
        category: "arbitration",
        sourceSentence: rewordedSentence,
        expectedSeverityBand: "high",
      },
    ];

    mockFetchReturning(
      buildAnalyzeResponse(sidecarWithBadEntry, "some summary")
    );

    const result = await analyzeDocument(adhesionText, allRedLines);

    // The 11 real, verbatim-quoted flags survive...
    expect(result.flags).toHaveLength(11);
    // ...but the reworded, non-verbatim one is dropped silently.
    expect(
      result.flags.find((f) => f.sourceSentence === rewordedSentence)
    ).toBeUndefined();
  });

  it("returns zero flags for a clean document with no matching clauses", async () => {
    mockFetchReturning(buildAnalyzeResponse([], "clean summary"));

    const result = await analyzeDocument(cleanText, allRedLines);

    expect(result.summary).toBe("clean summary");
    expect(result.flags).toEqual([]);
  });

  it("tells the model not to compare the document with other contracts or rate it overall", async () => {
    const fetchMock = mockFetchReturning(buildAnalyzeResponse([], "summary"));

    await analyzeDocument(cleanText, allRedLines);

    const prompt = systemPromptSentTo(fetchMock);
    expect(prompt).toMatch(/do not compare the document with other contracts/i);
    expect(prompt).toMatch(/unusual/i);
    expect(prompt).toMatch(/favorable/i);
  });

  it("throws a clear error when OPENROUTER_API_KEY/OPENROUTER_MODEL are unset", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    vi.stubEnv("OPENROUTER_MODEL", "");
    // Deliberately not mocking fetch: the call must fail before ever
    // reaching the network.
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(analyzeDocument(cleanText, allRedLines)).rejects.toThrow(
      /OPENROUTER_API_KEY|OPENROUTER_MODEL/
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("answerQuestion", () => {
  it("returns the model's answer text end to end through the plumbing", async () => {
    mockFetchReturning({ answer: buildAnswerResponse("some answer text") });

    const answer = await answerQuestion(adhesionText, "some question");

    expect(answer).toBe("some answer text");
  });

  it("tells the model not to give a verdict on signing", async () => {
    const fetchMock = mockFetchReturning({ answer: "some answer text" });

    await answerQuestion(adhesionText, "Should I sign this? Yes or no.");

    expect(systemPromptSentTo(fetchMock)).toMatch(
      /never say whether the reader should sign/i
    );
  });

  it("tells the model not to compare the document with other contracts", async () => {
    const fetchMock = mockFetchReturning({ answer: "some answer text" });

    await answerQuestion(adhesionText, "Is this a good deal?");

    const prompt = systemPromptSentTo(fetchMock);
    expect(prompt).toMatch(/do not compare the document with other contracts/i);
    expect(prompt).toMatch(/unusual/i);
  });

  it("throws a clear error when OPENROUTER_API_KEY/OPENROUTER_MODEL are unset", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    vi.stubEnv("OPENROUTER_MODEL", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(
      answerQuestion(adhesionText, "some question")
    ).rejects.toThrow(/OPENROUTER_API_KEY|OPENROUTER_MODEL/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
