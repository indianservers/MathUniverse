import { describe, expect, it } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import { checkLessonAnswer, createLessonChallenge } from "./lessonRuntime";
import { createLessonInteractionEvent } from "./lessonInteraction";

describe("lesson runtime challenges", () => {
  it("creates deterministic challenges for all 674 lessons", () => {
    for (const lesson of lessonCatalog) {
      const seed = lesson.id * 104729 + 17;
      expect(createLessonChallenge(lesson, seed)).toEqual(createLessonChallenge(lesson, seed));
    }
  });

  it("checks numeric answers with a small tolerance", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.adapter === "calculator")!;
    const challenge = createLessonChallenge(lesson, 1234);
    expect(checkLessonAnswer(challenge, challenge.expected, true).correct).toBe(true);
    expect(checkLessonAnswer(challenge, "999999", true).correct).toBe(false);
  });

  it("requires a live interaction for capability checks", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.adapter === "platform")!;
    const challenge = createLessonChallenge(lesson, 1234);
    expect(checkLessonAnswer(challenge, challenge.expected, false).correct).toBe(false);
    expect(checkLessonAnswer(challenge, challenge.expected, true).correct).toBe(true);
  });

  it("uses active-state evidence for non-priority discrete challenges", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 574)!;
    const evidence = createLessonInteractionEvent({
      controlId: "primary-control",
      kind: "selection",
      before: { weight: 2 },
      after: { challengePrompt: "What is the current minimum spanning-tree weight?", challengeExpected: "4", challengeHint: "Add the highlighted weights.", challengeKind: "numeric" },
      affectedOutputs: ["discrete-result"],
    });
    const challenge = createLessonChallenge(lesson, 574, [evidence]);
    expect(challenge.prompt).toContain("spanning-tree");
    expect(challenge.expected).toBe("4");
    expect(challenge.factoryId).toBe("discrete.mst");
  });

  it("uses active finance assumptions instead of the adapter-wide simple-interest challenge", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 603)!;
    const evidence = createLessonInteractionEvent({
      controlId: "primary-control",
      kind: "slider",
      before: { a: 50_000, b: 400, c: 900 },
      after: {
        challengePrompt: "How many whole units are required to break even?",
        challengeExpected: "100.00",
        challengeHint: "Divide fixed cost by contribution per unit.",
        challengeKind: "numeric",
      },
      affectedOutputs: ["finance-result"],
    });
    const challenge = createLessonChallenge(lesson, 603, [evidence]);
    expect(challenge.prompt).toContain("break even");
    expect(challenge.expected).toBe("100.00");
    expect(challenge.factoryId).toBe("finance.break-even");
  });

  it("uses active series state instead of the adapter-wide arithmetic challenge", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 344)!;
    const evidence = createLessonInteractionEvent({
      controlId: "primary-control",
      kind: "slider",
      before: { a: 1, b: 0, n: 4 },
      after: {
        challengePrompt: "What degree-8 Taylor approximation is displayed?",
        challengeExpected: "2.718",
        challengeHint: "Add the Taylor terms about the selected centre.",
        challengeKind: "numeric",
      },
      affectedOutputs: ["sequence-result"],
    });
    const challenge = createLessonChallenge(lesson, 344, [evidence]);
    expect(challenge.prompt).toContain("Taylor");
    expect(challenge.expected).toBe("2.718");
    expect(challenge.factoryId).toBe("sequence.taylor-maclaurin");
  });

  it("uses active matrix concept state instead of the adapter-wide determinant challenge", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 363)!;
    const evidence = createLessonInteractionEvent({
      controlId: "primary-control",
      kind: "input",
      before: { a: 1, b: 1, c: 1, d: 0 },
      after: {
        challengePrompt: "What is the length of the second orthogonal vector?",
        challengeExpected: "0.707",
        challengeHint: "Subtract the projection before measuring.",
        challengeKind: "numeric",
      },
      affectedOutputs: ["matrix-result"],
    });
    const challenge = createLessonChallenge(lesson, 363, [evidence]);
    expect(challenge.prompt).toContain("orthogonal");
    expect(challenge.expected).toBe("0.707");
    expect(challenge.factoryId).toBe("matrix.gram-schmidt");
  });
});
