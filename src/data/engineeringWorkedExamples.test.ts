import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { engineeringWorkedExamples, workedExamplesForDomain, workedExampleSummary } from "./engineeringWorkedExamples";

describe("engineering worked examples", () => {
  it("covers every engineering math domain", () => {
    const coveredDomainIds = new Set(engineeringWorkedExamples.map((example) => example.domainId));
    expect(engineeringMathDomains.every((domain) => coveredDomainIds.has(domain.id))).toBe(true);
    expect(workedExampleSummary().coveredDomainCount).toBe(engineeringMathDomains.length);
  });

  it("gives each domain multiple worked examples with real steps", () => {
    engineeringMathDomains.forEach((domain) => {
      const examples = workedExamplesForDomain(domain.id);
      expect(examples.length).toBeGreaterThanOrEqual(2);
      expect(examples.every((example) => example.steps.length >= 3)).toBe(true);
      expect(examples.every((example) => example.answerCheck.length > 0)).toBe(true);
      expect(examples.every((example) => example.application.length > 20)).toBe(true);
    });
  });

  it("keeps examples route-backed into native app surfaces", () => {
    expect(engineeringWorkedExamples.every((example) => example.route.startsWith("/"))).toBe(true);
    expect(engineeringWorkedExamples.every((example) => example.route.startsWith("/syllabus-lab/"))).toBe(true);
    expect(workedExampleSummary().routeCount).toBeGreaterThan(8);
    expect(workedExampleSummary().stepCount).toBeGreaterThanOrEqual(engineeringWorkedExamples.length * 3);
  });

  it("includes recognizable engineering examples", () => {
    expect(workedExamplesForDomain("numerical-methods").some((example) => example.title.includes("Newton"))).toBe(true);
    expect(workedExamplesForDomain("vector-calculus-fields").some((example) => example.title.includes("Divergence"))).toBe(true);
    expect(workedExamplesForDomain("complex-special-control").some((example) => example.title.includes("pole"))).toBe(true);
  });

  it("renders worked examples on the Engineering Mathematics hub", async () => {
    const source = await readFile("src/pages/EngineeringMath.tsx", "utf8");
    expect(source).toContain("Worked Examples");
    expect(source).toContain("workedExamplesForDomain");
    expect(source).toContain("workedExampleSummary");
  });
});
