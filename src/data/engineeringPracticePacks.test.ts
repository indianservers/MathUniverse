import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { engineeringPracticePacks, practiceCoverageSummary, practicePackForDomain } from "./engineeringPracticePacks";

describe("engineering practice packs", () => {
  it("covers every engineering math domain", () => {
    const coveredDomains = new Set(engineeringPracticePacks.map((pack) => pack.domainId));
    expect(engineeringMathDomains.every((domain) => coveredDomains.has(domain.id))).toBe(true);
    expect(practiceCoverageSummary().coveredDomainCount).toBe(engineeringMathDomains.length);
  });

  it("keeps every pack useful for exam preparation", () => {
    engineeringPracticePacks.forEach((pack) => {
      expect(pack.examFocus.length).toBeGreaterThanOrEqual(3);
      expect(pack.skills.length).toBeGreaterThanOrEqual(4);
      expect(pack.commonMistakes.length).toBeGreaterThanOrEqual(3);
      expect(pack.prompts.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("keeps prompts route-backed and level-balanced", () => {
    const prompts = engineeringPracticePacks.flatMap((pack) => pack.prompts);
    const levels = new Set(prompts.map((prompt) => prompt.level));
    expect(prompts.every((prompt) => prompt.route.startsWith("/"))).toBe(true);
    expect(levels.has("foundation")).toBe(true);
    expect(levels.has("exam")).toBe(true);
    expect(levels.has("challenge")).toBe(true);
    expect(practiceCoverageSummary().examPromptCount).toBeGreaterThanOrEqual(engineeringMathDomains.length);
  });

  it("finds the selected domain practice pack", () => {
    const calculusPack = practicePackForDomain("engineering-calculus");
    expect(calculusPack?.title).toContain("Calculus");
    expect(calculusPack?.prompts.some((prompt) => prompt.route.includes("partial-derivative"))).toBe(true);
  });

  it("renders practice packs on the Engineering Mathematics hub", async () => {
    const source = await readFile("src/pages/EngineeringMath.tsx", "utf8");
    expect(source).toContain("Practice Pack");
    expect(source).toContain("practicePackForDomain");
    expect(source).toContain("practiceCoverageSummary");
  });
});
