import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { assessmentSummary, buildEngineeringAssessmentPlans, engineeringExamSprints, sprintReadiness } from "./engineeringAssessmentPlanner";

describe("engineering assessment planner", () => {
  it("creates one readiness plan for every engineering domain", () => {
    const plans = buildEngineeringAssessmentPlans();
    const plannedDomainIds = new Set(plans.map((plan) => plan.domainId));
    expect(plans).toHaveLength(engineeringMathDomains.length);
    expect(engineeringMathDomains.every((domain) => plannedDomainIds.has(domain.id))).toBe(true);
    expect(plans.every((plan) => plan.score >= 0 && plan.score <= 100)).toBe(true);
  });

  it("adds actionable drill routes and evidence", () => {
    const plans = buildEngineeringAssessmentPlans();
    expect(plans.every((plan) => plan.drillRoute.startsWith("/"))).toBe(true);
    expect(plans.every((plan) => plan.drillRoute.startsWith("/syllabus-lab/"))).toBe(true);
    expect(plans.every((plan) => plan.nextAction.length > 0)).toBe(true);
    expect(plans.every((plan) => plan.evidence.length >= 5)).toBe(true);
  });

  it("summarizes the whole engineering exam readiness state", () => {
    const summary = assessmentSummary();
    expect(summary.domainCount).toBe(engineeringMathDomains.length);
    expect(summary.averageScore).toBeGreaterThan(50);
    expect(summary.topDomain.length).toBeGreaterThan(0);
    expect(summary.nextFocus.length).toBeGreaterThan(0);
  });

  it("scores mixed exam sprints with weakest-domain guidance", () => {
    expect(engineeringExamSprints.length).toBeGreaterThanOrEqual(4);
    engineeringExamSprints.forEach((sprint) => {
      const readiness = sprintReadiness(sprint);
      expect(readiness.averageScore).toBeGreaterThan(0);
      expect(readiness.weakestDomain.length).toBeGreaterThan(0);
      expect(readiness.route.startsWith("/")).toBe(true);
      expect(readiness.route.startsWith("/syllabus-lab/")).toBe(true);
    });
  });

  it("renders the exam planner on the Engineering Mathematics hub", async () => {
    const source = await readFile("src/pages/EngineeringMath.tsx", "utf8");
    expect(source).toContain("Exam Readiness Planner");
    expect(source).toContain("buildEngineeringAssessmentPlans");
    expect(source).toContain("engineeringExamSprints");
  });
});
