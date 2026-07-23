import { describe, expect, it } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import { createLessonInteractionEvent } from "../engine/lessonInteraction";
import { createLessonChallenge } from "../engine/lessonRuntime";
import { calculatorLessonPreset, calculatorLessonPresetIds } from "./calculatorLessonPresets";

describe("calculator lesson concept presets", () => {
  it("registers all and only the 18 calculator lessons", () => {
    const calculatorIds = lessonCatalog.filter((lesson) => lesson.adapter === "calculator").map((lesson) => lesson.id);
    expect(calculatorLessonPresetIds).toEqual(calculatorIds);
    expect(new Set(calculatorLessonPresetIds.map((id) => calculatorLessonPreset(id).id)).size).toBe(18);
    expect(calculatorIds.every((id) => lessonCatalog.find((lesson) => lesson.id === id)?.preset.specificity === "lesson")).toBe(true);
  });

  it("builds practice from active calculator evidence", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 2)!;
    const evidence = createLessonInteractionEvent({ controlId: "calculator-expression", kind: "input", before: { expression: "1/2" }, after: { challengePrompt: "What result is displayed for 1/2+3/4?", challengeExpected: "1.25", challengeHint: "Read the calculated result.", challengeKind: "numeric" }, affectedOutputs: ["calculator-result"] });
    expect(createLessonChallenge(lesson, 123, [evidence])).toMatchObject({ expected: "1.25", factoryId: "calculator.fractions" });
  });
});
