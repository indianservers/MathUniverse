import { describe, expect, it } from "vitest";
import {
  THREE_VARIABLE_PRACTICES_113,
  THREE_VARIABLE_SYSTEMS_113,
  combineToEliminateThree113,
  isThreeVariableOperationDrop113,
  isThreeVariablePracticeCorrect113,
  solveThreeVariableSystem113,
  threeVariableOperationPayload113,
} from "./threeVariableSystemsLesson113Model";

describe("threeVariableSystemsLesson113Model", () => {
  it("solves and verifies every selectable system", () => {
    for (const system of THREE_VARIABLE_SYSTEMS_113) {
      const solved = solveThreeVariableSystem113(system);
      expect(solved.valid).toBe(true);
      expect(solved.checks).toEqual(
        system.equations.map((equation) => equation.d),
      );
    }
  });

  it("matches the target triple and elimination reductions", () => {
    const system = THREE_VARIABLE_SYSTEMS_113[0];
    expect(solveThreeVariableSystem113(system)).toMatchObject({
      determinant: 4,
      x: 2,
      y: 1,
      z: 3,
      valid: true,
    });
    expect(
      combineToEliminateThree113(system.equations[0], system.equations[1], "y")
        .combined,
    ).toEqual({ a: 2, b: 0, c: 2, d: 10 });
    expect(
      combineToEliminateThree113(system.equations[0], system.equations[2], "y")
        .combined,
    ).toEqual({ a: 0, b: 0, c: 2, d: 6 });
  });

  it("validates elimination payloads for the current variable", () => {
    const system = THREE_VARIABLE_SYSTEMS_113[0];
    const payload = threeVariableOperationPayload113(system, "y");
    expect(isThreeVariableOperationDrop113(payload, system, "y")).toBe(true);
    expect(isThreeVariableOperationDrop113("", system, "y")).toBe(false);
    expect(isThreeVariableOperationDrop113(payload, system, "x")).toBe(false);
  });

  it("grades all three practice coordinates", () => {
    expect(
      THREE_VARIABLE_PRACTICES_113.map((system) => {
        const solved = solveThreeVariableSystem113(system);
        return isThreeVariablePracticeCorrect113(system, [
          solved.x,
          solved.y,
          solved.z,
        ]);
      }),
    ).toEqual([true, true]);
    expect(
      isThreeVariablePracticeCorrect113(
        THREE_VARIABLE_PRACTICES_113[0],
        [4, 2, 2],
      ),
    ).toBe(false);
  });
});
