import { describe, expect, it } from "vitest";
import { configForPath, matchesStudioTerm, matchesStudioTerms } from "./StudioLessonLinks";

describe("studio lesson relevance", () => {
  it("matches complete words instead of arbitrary substrings", () => {
    expect(matchesStudioTerm("Discrete and Applied Mathematics", "set")).toBe(false);
    expect(matchesStudioTerm("Set Theory and Relations", "set")).toBe(true);
    expect(matchesStudioTerm("Sets and finite structures", "set")).toBe(true);
  });

  it("supports plural forms without cross-topic matches", () => {
    expect(matchesStudioTerms("Functions and polynomial equations", ["function", "polynomial"])).toBe(true);
    expect(matchesStudioTerms("Financial Mathematics and Modelling", ["set", "relation", "logic"])).toBe(false);
  });

  it("keeps every supported studio route mapped to a relevance configuration", () => {
    for (const route of ["/algebra", "/calculus", "/geometry", "/trigonometry", "/statistics", "/linear-algebra", "/set-theory", "/number-systems", "/discrete-world", "/complex-numbers"]) {
      expect(configForPath(route), route).not.toBeNull();
    }
  });

  it("uses a tighter number-systems matcher", () => {
    expect(configForPath("/number-systems")?.terms).toContain("rational number");
    expect(configForPath("/number-systems")?.exclude).toContain("complex");
  });
});
