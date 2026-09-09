import { describe, expect, it } from "vitest";
import {
  LITERAL_FORMULAS_110,
  LITERAL_PRACTICES_110,
  isLiteralOperationDrop110,
  literalOperationPayload110,
  solveLiteralFormula110,
} from "./literalEquationsLesson110Model";

describe("literalEquationsLesson110Model", () => {
  it("rearranges and verifies every selectable subject", () => {
    for (const formula of LITERAL_FORMULAS_110) {
      for (const subject of formula.variables) {
        const solved = solveLiteralFormula110(
          formula,
          subject,
          formula.defaults,
        );
        expect(solved.numericResult).toBeCloseTo(formula.defaults[subject]);
        expect(solved.checkCorrect).toBe(true);
      }
    }
  });

  it("uses the target rectangle calculation from the mockup", () => {
    const solved = solveLiteralFormula110(LITERAL_FORMULAS_110[0], "w", {
      A: 24,
      l: 6,
      w: 0,
    });
    expect(solved.arrangement.result).toBe("w = A / l");
    expect(solved.arrangement.divisor).toBe("l");
    expect(solved.numericResult).toBe(4);
    expect(solved.check).toEqual({ left: 24, right: 24 });
  });

  it("validates only the current inverse-operation payload", () => {
    const formula = LITERAL_FORMULAS_110[0];
    const payload = literalOperationPayload110(formula, "w");
    expect(payload).toBe("rectangle-area:w:l");
    expect(isLiteralOperationDrop110(payload, formula, "w")).toBe(true);
    expect(isLiteralOperationDrop110("", formula, "w")).toBe(false);
    expect(isLiteralOperationDrop110("rectangle-area:l:w", formula, "w")).toBe(
      false,
    );
  });

  it("calculates both generated practice problems", () => {
    expect(
      LITERAL_PRACTICES_110.map(
        (practice) =>
          solveLiteralFormula110(
            practice,
            practice.defaultSubject,
            practice.defaults,
          ).numericResult,
      ),
    ).toEqual([5, 6]);
  });
});
