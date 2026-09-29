import { describe, expect, it } from "vitest";
import { solveLinearProgram } from "./linearProgram";

describe("linear program", () => {
  it("finds the optimum at a feasible corner and reports binding constraints", () => {
    const result = solveLinearProgram([{ name: "labor", a: 2, b: 1, limit: 100 }, { name: "machine", a: 1, b: 1, limit: 90 }, { name: "material", a: 0, b: 1, limit: 80 }], { x: 50, y: 40 });
    expect(result.best?.x).toBeCloseTo(10);
    expect(result.best?.y).toBeCloseTo(80);
    expect(result.value).toBeCloseTo(3700);
    expect(result.binding).toEqual(["labor", "machine", "material"]);
  });
});
