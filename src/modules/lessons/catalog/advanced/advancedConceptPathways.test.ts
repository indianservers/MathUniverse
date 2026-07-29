import { describe, expect, it } from "vitest";
import { advancedConceptLessons } from "./advancedConceptLessons";
import { adjacentLessonInPathway, advancedConceptPathways, lessonsForAdvancedPathway, pathwaysForAdvancedLesson } from "./advancedConceptPathways";

describe("Phase 3 advanced concept pathways", () => {
  it("creates curated pathways that only reference registered advanced lessons", () => {
    const lessonIds = new Set(advancedConceptLessons.map((lesson) => lesson.id));
    expect(advancedConceptPathways).toHaveLength(3);

    for (const pathway of advancedConceptPathways) {
      expect(pathway.lessonIds.length, pathway.id).toBeGreaterThanOrEqual(8);
      expect(pathway.lessonIds.every((id) => lessonIds.has(id)), pathway.id).toBe(true);
      expect(lessonsForAdvancedPathway(pathway), pathway.id).toHaveLength(pathway.lessonIds.length);
      expect(pathway.capstonePrompt.length, pathway.id).toBeGreaterThan(40);
    }
  });

  it("finds pathways and adjacent steps for shared lessons", () => {
    const zetaPathways = pathwaysForAdvancedLesson("advanced-2008");
    expect(zetaPathways.map((pathway) => pathway.id)).toEqual(["number-theory-patterns", "special-functions-and-equations"]);

    const firstPathway = advancedConceptPathways[0];
    const adjacent = adjacentLessonInPathway(firstPathway, "advanced-2001");
    expect(adjacent.previous).toBeUndefined();
    expect(adjacent.next?.id).toBe("advanced-2002");
  });
});
