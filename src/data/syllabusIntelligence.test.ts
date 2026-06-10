import { describe, expect, it } from "vitest";
import { allSyllabusTopics, syllabusLevels } from "./syllabus";
import { buildSyllabusIntelligence, recommendedLearningPath, syllabusCoverageSummary } from "./syllabusIntelligence";

describe("syllabus intelligence", () => {
  it("summarizes readiness without server data", () => {
    const summary = syllabusCoverageSummary(allSyllabusTopics);

    expect(summary.total).toBe(allSyllabusTopics.length);
    expect(summary.available + summary.mapped + summary.future).toBe(summary.total);
    expect(summary.readiness).toBeGreaterThan(50);
  });

  it("builds priority units with launchable recommended routes", () => {
    const units = buildSyllabusIntelligence(allSyllabusTopics);

    expect(units.length).toBeGreaterThan(5);
    expect(units[0].priorityScore).toBeGreaterThanOrEqual(units.at(-1)?.priorityScore ?? 0);
    expect(units.some((unit) => unit.workspaceTemplate && unit.recommendedRoute.startsWith("/workspace?template="))).toBe(true);
  });

  it("recommends focused next lessons for a selected class", () => {
    const class9 = syllabusLevels.find((level) => level.id === "class-9");
    const path = recommendedLearningPath("class-9", 4);

    expect(class9).toBeTruthy();
    expect(path).toHaveLength(4);
    expect(path.every((item) => item.topic.classLevel === "Class 9")).toBe(true);
    expect(path.every((item) => item.workspaceRoute.length > 1)).toBe(true);
  });
});
