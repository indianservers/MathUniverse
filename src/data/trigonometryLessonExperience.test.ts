import { describe, expect, it } from "vitest";
import {
  trigonometryLessonExperiences,
  validateTrigonometryLessonExperienceMetadata,
} from "./trigonometryLessonExperience";
import { trigonometryConcepts } from "./trigonometryConcepts";

describe("trigonometry lesson experience metadata", () => {
  it("maps every existing trigonometry concept to one safe lesson experience", () => {
    const validation = validateTrigonometryLessonExperienceMetadata();

    expect(validation.valid).toBe(true);
    expect(validation.conceptCount).toBe(trigonometryConcepts.length);
    expect(validation.experienceCount).toBe(trigonometryConcepts.length);
    expect(validation.duplicateConceptIds).toEqual([]);
    expect(validation.duplicateExperienceIds).toEqual([]);
    expect(validation.orphanedExperienceIds).toEqual([]);
    expect(validation.missingExperienceConceptIds).toEqual([]);
  });

  it("declares math safety and future phase ownership for every experience", () => {
    expect(trigonometryLessonExperiences.length).toBeGreaterThan(0);

    for (const experience of trigonometryLessonExperiences) {
      expect(experience.title.trim()).not.toBe("");
      expect(experience.formulas.length).toBeGreaterThan(0);
      expect(experience.interactionModel).toContain("slider");
      expect(experience.interactionModel).toContain("live-values");
      expect(experience.mathSafety.angleMode).toBe("both");
      expect(experience.mathSafety.tolerance).toBeGreaterThan(0);
      expect(experience.phaseOwner).toMatch(/^phase-(0[1-9]|10)$/);
    }
  });
});
