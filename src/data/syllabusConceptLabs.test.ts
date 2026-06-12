import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { advancedSyllabusLabs, engineeringConceptLabId, syllabusConceptLabId } from "./advancedSyllabusLabs";
import { allSyllabusTopics } from "./syllabus";

describe("syllabus concept labs", () => {
  it("creates an interactive lab for every syllabus concept", () => {
    const labIds = new Set(advancedSyllabusLabs.map((lab) => lab.id));
    const concepts = allSyllabusTopics.flatMap((topic) =>
      topic.concepts.map((concept) => ({
        topic,
        concept,
        id: topic.classLevel === "Engineering" ? engineeringConceptLabId(topic.id, concept) : syllabusConceptLabId(topic.id, concept),
      })),
    );

    expect(concepts.length).toBeGreaterThan(200);
    expect(concepts.every(({ id }) => labIds.has(id))).toBe(true);
  });

  it("links syllabus topic cards to generated concept tools", async () => {
    const source = await readFile("src/components/syllabus/SyllabusTopicCard.tsx", "utf8");

    expect(source).toContain("Interactive Concept Tools");
    expect(source).toContain("syllabusConceptLabId");
    expect(source).toContain("engineeringConceptLabId");
    expect(source).toContain("/syllabus-lab/");
  });
});
