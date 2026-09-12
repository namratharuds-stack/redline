import { describe, expect, it } from "vitest";
import { shouldShowOnboarding } from "./should-show-onboarding";

describe("shouldShowOnboarding", () => {
  it("shows onboarding when user_metadata is undefined (brand-new user)", () => {
    expect(shouldShowOnboarding(undefined)).toBe(true);
  });

  it("shows onboarding when user_metadata is null", () => {
    expect(shouldShowOnboarding(null)).toBe(true);
  });

  it("shows onboarding when user_metadata has no onboarded key", () => {
    expect(shouldShowOnboarding({})).toBe(true);
  });

  it("shows onboarding when onboarded is explicitly false", () => {
    expect(shouldShowOnboarding({ onboarded: false })).toBe(true);
  });

  it("shows onboarding when onboarded is a truthy non-boolean value", () => {
    // Guards against a malformed write (e.g. the string "true") silently
    // being treated as onboarded.
    expect(shouldShowOnboarding({ onboarded: "true" })).toBe(true);
  });

  it("hides onboarding once onboarded is exactly true", () => {
    expect(shouldShowOnboarding({ onboarded: true })).toBe(false);
  });

  it("hides onboarding when onboarded is true alongside unrelated fields", () => {
    expect(
      shouldShowOnboarding({ onboarded: true, full_name: "Jamie Rivera" })
    ).toBe(false);
  });
});
