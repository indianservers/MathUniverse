import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { caseStudiesForDomain, caseStudySummary, engineeringCaseStudies } from "./engineeringCaseStudies";

describe("engineering case studies", () => {
  it("covers every engineering math domain with industry scenarios", () => {
    const coveredDomainIds = new Set(engineeringCaseStudies.map((caseStudy) => caseStudy.domainId));
    expect(engineeringMathDomains.every((domain) => coveredDomainIds.has(domain.id))).toBe(true);
    expect(caseStudySummary().coveredDomainCount).toBe(engineeringMathDomains.length);

    engineeringMathDomains.forEach((domain) => {
      expect(caseStudiesForDomain(domain.id).length).toBeGreaterThanOrEqual(2);
    });
  });

  it("connects every case study to labs, formulas, evidence, and success criteria", () => {
    expect(engineeringCaseStudies.every((caseStudy) => caseStudy.labRoutes.length >= 2)).toBe(true);
    expect(engineeringCaseStudies.every((caseStudy) => caseStudy.labRoutes.every((route) => route.startsWith("/")))).toBe(true);
    expect(engineeringCaseStudies.every((caseStudy) => caseStudy.formulaQueries.length >= 2)).toBe(true);
    expect(engineeringCaseStudies.every((caseStudy) => caseStudy.portfolioEvidence.length >= 3)).toBe(true);
    expect(engineeringCaseStudies.every((caseStudy) => caseStudy.successCriteria.length >= 3)).toBe(true);
    expect(engineeringCaseStudies.every((caseStudy) => caseStudy.estimatedMinutes > 0)).toBe(true);
  });

  it("summarizes industry depth for the hub", () => {
    const summary = caseStudySummary();
    expect(summary.caseStudyCount).toBe(engineeringCaseStudies.length);
    expect(summary.industryCount).toBeGreaterThanOrEqual(10);
    expect(summary.routeCount).toBeGreaterThanOrEqual(12);
    expect(summary.evidenceCount).toBeGreaterThanOrEqual(engineeringCaseStudies.length * 3);
    expect(summary.totalMinutes).toBeGreaterThan(900);
  });

  it("includes recognizable engineering industries", () => {
    expect(caseStudiesForDomain("engineering-calculus").some((caseStudy) => caseStudy.industry === "Robotics")).toBe(true);
    expect(caseStudiesForDomain("optimization-operations-research").some((caseStudy) => caseStudy.title.includes("LP"))).toBe(true);
    expect(caseStudiesForDomain("complex-special-control").some((caseStudy) => caseStudy.industry === "Control systems")).toBe(true);
  });

  it("renders industry case studies on the Engineering Mathematics hub", async () => {
    const source = await readFile("src/pages/EngineeringMath.tsx", "utf8");
    expect(source).toContain("Industry Case Studies");
    expect(source).toContain("caseStudiesForDomain");
    expect(source).toContain("caseStudySummary");
  });
});
