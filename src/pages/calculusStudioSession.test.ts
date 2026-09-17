import { describe, expect, it } from "vitest";
import {
  dailyChallenge,
  gradeChallenge,
  repairedLimitExpression,
  searchStudio,
} from "./calculusStudioSession";

describe("calculus studio session helpers", () => {
  it("finds formulas, advanced workbench, and modes", () => {
    expect(searchStudio("epsilon").some((item) => item.page === "advanced")).toBe(true);
    expect(searchStudio("∇f")[0]?.page).toBe("multivariable-vector");
    expect(searchStudio("FTC")[0]?.mode).toBe("ftc");
  });

  it("repairs common removable limits by rewriting the expression", () => {
    expect(repairedLimitExpression("sin(x)/x", 0, 1)).toBe("sinc(x)");
    expect(repairedLimitExpression("(x^2-1)/(x-1)", 1, 2)).toBe("x+1");
  });

  it("grades the daily challenge", () => {
    const result = gradeChallenge(String(dailyChallenge.answer));
    expect(result.solved).toBe(true);
  });
});
