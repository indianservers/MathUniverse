import { describe, expect, it } from "vitest";
import {
  SIMULTANEOUS_PRACTICES_112,
  SIMULTANEOUS_SYSTEMS_112,
  combineSimultaneousSystem112,
  isSimultaneousOperationDrop112,
  isSimultaneousPracticeCorrect112,
  simultaneousOperationPayload112,
  solveSimultaneousSystem112,
} from "./simultaneousLinearEquationsLesson112Model";

describe("simultaneousLinearEquationsLesson112Model", () => {
  it("solves and verifies every selectable system", () => {
    for (const system of SIMULTANEOUS_SYSTEMS_112) {
      const solved = solveSimultaneousSystem112(system);
      expect(solved.valid).toBe(true);
      expect(solved.firstCheck).toBe(system.first.c);
      expect(solved.secondCheck).toBe(system.second.c);
    }
  });

  it("matches the target elimination and ordered pair", () => {
    const system = SIMULTANEOUS_SYSTEMS_112[0];
    expect(combineSimultaneousSystem112(system).combined).toEqual({
      a: 2,
      b: 0,
      c: 8,
    });
    expect(solveSimultaneousSystem112(system)).toMatchObject({
      determinant: -2,
      x: 4,
      y: 3,
      valid: true,
    });
  });

  it("ties drag operations to the current system and method", () => {
    const system = SIMULTANEOUS_SYSTEMS_112[0];
    const payload = simultaneousOperationPayload112(system, "Elimination");
    expect(isSimultaneousOperationDrop112(payload, system, "Elimination")).toBe(
      true,
    );
    expect(isSimultaneousOperationDrop112("", system, "Elimination")).toBe(
      false,
    );
    expect(
      isSimultaneousOperationDrop112(payload, system, "Substitution"),
    ).toBe(false);
  });

  it("grades ordered-pair practice through both equations", () => {
    expect(
      SIMULTANEOUS_PRACTICES_112.map((system) => {
        const solution = solveSimultaneousSystem112(system);
        return isSimultaneousPracticeCorrect112(system, solution.x, solution.y);
      }),
    ).toEqual([true, true]);
    expect(
      isSimultaneousPracticeCorrect112(SIMULTANEOUS_PRACTICES_112[0], 3, 3),
    ).toBe(false);
  });
});
