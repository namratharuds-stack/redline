import { describe, expect, it } from "vitest";
import {
  shouldRedirectAwayFromAuthPages,
  shouldRedirectToLogin,
} from "./redirect-rules";

describe("shouldRedirectToLogin", () => {
  it("redirects an unauthenticated visitor at /home", () => {
    expect(shouldRedirectToLogin("/home", false)).toBe(true);
  });

  it("redirects an unauthenticated visitor at a nested /home path", () => {
    expect(shouldRedirectToLogin("/home/documents/123", false)).toBe(true);
  });

  it("does not redirect a signed-in visitor at /home", () => {
    expect(shouldRedirectToLogin("/home", true)).toBe(false);
  });

  it("does not redirect a signed-in visitor at a nested /home path", () => {
    expect(shouldRedirectToLogin("/home/documents/123", true)).toBe(false);
  });

  it("does not redirect an unauthenticated visitor at the root path", () => {
    expect(shouldRedirectToLogin("/", false)).toBe(false);
  });

  it("does not redirect an unauthenticated visitor at /login", () => {
    expect(shouldRedirectToLogin("/login", false)).toBe(false);
  });

  it("does not redirect an unauthenticated visitor at /signup", () => {
    expect(shouldRedirectToLogin("/signup", false)).toBe(false);
  });

  it("does not treat a lookalike path as protected", () => {
    expect(shouldRedirectToLogin("/homestead", false)).toBe(false);
  });
});

describe("shouldRedirectAwayFromAuthPages", () => {
  it("redirects a signed-in visitor away from /login", () => {
    expect(shouldRedirectAwayFromAuthPages("/login", true)).toBe(true);
  });

  it("redirects a signed-in visitor away from /signup", () => {
    expect(shouldRedirectAwayFromAuthPages("/signup", true)).toBe(true);
  });

  it("does not redirect an unauthenticated visitor away from /login", () => {
    expect(shouldRedirectAwayFromAuthPages("/login", false)).toBe(false);
  });

  it("does not redirect an unauthenticated visitor away from /signup", () => {
    expect(shouldRedirectAwayFromAuthPages("/signup", false)).toBe(false);
  });

  it("does not redirect a signed-in visitor away from unrelated paths", () => {
    expect(shouldRedirectAwayFromAuthPages("/home", true)).toBe(false);
  });
});
