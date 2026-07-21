import { describe, expect, it } from "vitest";
import { accuracyConceptById, accuracyConceptsForDomain, phaseOneAccuracyConcepts, phaseOneAccuracySummary, phaseOneRoadmapCoverage } from ".";
import { PHASE_ONE_DOMAINS } from "./types";
import { validateConceptCollection } from "./validateConcept";

describe("Phase 1 strengthened concept contracts", () => {
  it("passes the complete accuracy contract", () => {
    expect(validateConceptCollection(phaseOneAccuracyConcepts)).toEqual([]);
  });

  it("covers every Phase 1 domain with multiple topic-specific concepts", () => {
    for (const domain of PHASE_ONE_DOMAINS) {
      expect(accuracyConceptsForDomain(domain).length).toBeGreaterThanOrEqual(3);
    }
  });

  it("provides all example modes and misconception checks", () => {
    const requiredKinds = ["foundational", "visual", "real-world", "misconception", "boundary", "challenge", "connection"];
    for (const concept of phaseOneAccuracyConcepts) {
      expect(new Set(concept.examples.map((example) => example.kind))).toEqual(new Set(requiredKinds));
      expect(concept.misconceptions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("indexes contracts by stable ID", () => {
    expect(accuracyConceptById("algebra.linear-equation")?.title).toContain("Linear");
    expect(accuracyConceptById("calculus.derivative")?.validation.tolerance).toBe(1e-5);
  });

  it("traces every roadmap row to a domain-correct contract", () => {
    expect(phaseOneRoadmapCoverage).toHaveLength(44);
    expect(new Set(phaseOneRoadmapCoverage.map(({ domain, topic }) => `${domain}:${topic}`)).size).toBe(44);
    for (const item of phaseOneRoadmapCoverage) {
      expect(accuracyConceptById(item.conceptId)?.domain, `${item.topic} is not mapped correctly`).toBe(item.domain);
    }
  });

  it("reports auditable aggregate coverage", () => {
    const summary = phaseOneAccuracySummary();
    expect(summary.domainCount).toBe(5);
    expect(summary.conceptCount).toBe(44);
    expect(summary.exampleCount).toBe(308);
    expect(summary.misconceptionCount).toBe(88);
  });
});
