import { describe, expect, it } from "vitest";
import { cnfForm, dpllSat, evalGate, satWitness, xorFromAndOrNot } from "./logicMath";

describe("logic gates", () => {
  it("matches XOR with (P∨Q) ∧ ¬(P∧Q)", () => {
    for (const p of [false, true]) {
      for (const q of [false, true]) {
        expect(xorFromAndOrNot(p, q)).toBe(evalGate("XOR", p, q));
      }
    }
  });

  it("gives a SAT witness and CNF for XOR", () => {
    expect(satWitness("XOR")).toEqual({ p: false, q: true, out: true });
    expect(cnfForm("XOR")).toContain("∧");
  });

  it("solves a 2-clause formula with DPLL", () => {
    const hit = dpllSat([["P", "Q"], ["~P", "Q"]]);
    expect(hit.sat).toBe(true);
    expect(hit.assignment.Q).toBe(true);
  });
});
