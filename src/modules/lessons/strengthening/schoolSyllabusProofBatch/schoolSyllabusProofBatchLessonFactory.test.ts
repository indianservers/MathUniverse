import { describe, expect, it } from "vitest";
import { expandedWorkedExamples } from "../../components/LessonSectionJourney";
import {
  schoolSyllabusProofLesson,
  schoolSyllabusProofSeed,
} from "./schoolSyllabusProofBatchLessonFactory";

describe("midpoint formula worked examples", () => {
  it("uses three numerical worked problems instead of theory prompts", () => {
    const lesson = schoolSyllabusProofLesson(schoolSyllabusProofSeed(10084));
    const examples = expandedWorkedExamples(lesson);

    expect(examples).toHaveLength(3);
    expect(examples.map((example) => example.prompt)).toEqual([
      "Find the midpoint of A(2, 4) and B(6, 8).",
      "Find the midpoint of P(-3, 5) and Q(7, -1).",
      "The midpoint of A(1, 2) and B(x, y) is M(3, 4). Find B.",
    ]);
    expect(examples.map((example) => example.answer)).toEqual([
      "M(4, 6)",
      "M(2, 2)",
      "B(5, 6)",
    ]);
    const steps = examples.flatMap((example) => example.steps).join(" ");
    expect(steps).toContain("\\frac{-3 + 7}{2}");
    expect(steps).not.toContain(" / ");
  });
});
