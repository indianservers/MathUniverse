import { describe, expect, it } from "vitest";
import { getSyllabusWorkspaceTemplate, syllabusWorkspaceTemplates, type GuidedActivityPhase } from "./syllabusWorkspaceTemplates";

const phases: GuidedActivityPhase[] = ["predict", "manipulate", "check", "reflect"];

describe("syllabus workspace templates", () => {
  it("covers the core billion-dollar workspace units with guided activity phases", () => {
    expect(syllabusWorkspaceTemplates.map((template) => template.id)).toEqual(expect.arrayContaining(["number-systems", "polynomials", "linear-equations", "euclid-geometry", "triangles", "circles", "quadrilaterals", "coordinate-geometry", "trigonometry", "statistics", "3d-solids"]));
    expect(syllabusWorkspaceTemplates.length).toBeGreaterThanOrEqual(11);

    for (const template of syllabusWorkspaceTemplates) {
      expect(template.outcomes.length).toBeGreaterThanOrEqual(3);
      expect(template.command.length).toBeGreaterThan(3);
      expect(template.steps.map((step) => step.phase)).toEqual(phases);
      expect(template.steps.every((step) => step.prompt.length > 20 && step.reveal.length > 20)).toBe(true);
    }
  });

  it("retrieves templates by stable route id", () => {
    expect(getSyllabusWorkspaceTemplate("circles")?.unit).toBe("Circles");
    expect(getSyllabusWorkspaceTemplate("missing")).toBeUndefined();
  });
});
