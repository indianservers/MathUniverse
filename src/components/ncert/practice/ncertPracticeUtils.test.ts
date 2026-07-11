import { describe, expect, it } from "vitest";
import { checkNCERTPracticeAnswer, normalizePracticeText } from "./ncertPracticeUtils";

describe("NCERT practice utilities", () => {
  it("checks numeric answers with tolerance", () => {
    const result = checkNCERTPracticeAnswer("3.14", {
      id: "pi",
      prompt: "Approximate pi",
      answer: 3.141,
      tolerance: 0.01,
      hint: "Use decimals",
      explanation: "Close enough.",
    });
    expect(result.ok).toBe(true);
  });

  it("checks normalized string and multi-answer responses", () => {
    expect(normalizePracticeText("  Like   Terms ")).toBe("like terms");
    expect(checkNCERTPracticeAnswer("same denominator", {
      id: "fraction",
      prompt: "What do we need?",
      answer: ["common denominator", "same denominator"],
      hint: "Make denominators match.",
      explanation: "Correct.",
    }).ok).toBe(true);
  });

  it("returns targeted common mistake feedback", () => {
    const result = checkNCERTPracticeAnswer("36", {
      id: "bodmas",
      prompt: "Evaluate 8 + 4 x 3.",
      answer: 20,
      hint: "Multiply first.",
      explanation: "4 x 3 is done first.",
      commonMistakes: [{ answer: 36, feedback: "You added first. Use multiplication before addition." }],
    });
    expect(result.ok).toBe(false);
    expect(result.matchedCommonMistake).toBe(true);
    expect(result.message).toContain("multiplication");
  });
});
