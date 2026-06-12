import { describe, expect, it } from "vitest";
import { buildProblemResultCards } from "./resultCards";
import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

function classification(kind: ProblemClassification["kind"] = "linear-equation"): ProblemClassification {
  return {
    assumptions: ["Solve for x."],
    confidence: "high",
    kind,
    normalizedInput: "2*x+5=15",
    rawInput: "2x + 5 = 15",
    reason: "Detected test problem.",
    warnings: [],
  };
}

function result(overrides: Partial<ProblemSolverResult> = {}): ProblemSolverResult {
  return {
    assumptions: ["Solve for x."],
    canCopy: true,
    kind: "linear-equation",
    method: "Linear isolation",
    normalizedInput: "2*x+5=15",
    result: "x = 5",
    restrictions: [],
    steps: ["Start.", "Finish."],
    title: "Linear Equation",
    verification: ["Check."],
    warnings: [],
    ...overrides,
  };
}

describe("result cards", () => {
  it("builds relevant cards for solved problems", () => {
    const cards = buildProblemResultCards(classification(), result(), null);
    expect(cards.map((card) => card.type)).toEqual(expect.arrayContaining(["input-interpretation", "classification", "assumptions", "steps", "final-answer", "verification", "alternative-method", "related-concepts", "practice"]));
    expect(cards.slice(0, 2).map((card) => card.type)).toEqual(["final-answer", "steps"]);
    expect(cards.some((card) => card.type === "warnings")).toBe(false);
    expect(cards.some((card) => card.type === "domain")).toBe(false);
  });

  it("shows domain and warning cards only when present", () => {
    const cards = buildProblemResultCards(classification("simplify"), result({ kind: "simplify", restrictions: ["x != 1"], warnings: ["Domain restriction."] }), null);
    expect(cards.some((card) => card.type === "domain")).toBe(true);
    expect(cards.some((card) => card.type === "warnings")).toBe(true);
  });

  it("adds visual and table cards when visual data exists", () => {
    const cards = buildProblemResultCards(classification(), result(), {
      curves: [],
      description: "visual",
      markers: [],
      table: [{ x: 0, y: 5 }],
      title: "Visual",
      viewport: { xMin: -1, xMax: 1, yMin: -1, yMax: 1 },
      warnings: [],
    });
    expect(cards.some((card) => card.type === "visual")).toBe(true);
    expect(cards.some((card) => card.type === "table")).toBe(true);
  });
});
