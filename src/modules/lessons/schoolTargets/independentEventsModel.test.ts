import { describe, expect, it } from "vitest";
import { DIE_EVENTS, independentEvents, simulateIndependent, URN_COMPARISON, type DieEvent } from "./independentEventsModel";
describe("coin and die independence", () => {
  it("derives three favorable default outcomes out of twelve", () => {
    expect(independentEvents("H", "even")).toMatchObject({ countA: 6, countB: 6, countAB: 3, pA: .5, pB: .5, pAB: .25, conditional: .5 });
  });
  it("satisfies both independence identities for all selectable pairs", () => {
    for (const a of ["H", "T", "either"] as const) for (const b of Object.keys(DIE_EVENTS) as DieEvent[]) {
      const model = independentEvents(a, b);
      expect(model.outcomes).toHaveLength(12);
      expect(model.pAB).toBeCloseTo(model.pA * model.pB);
      expect(model.conditional).toBeCloseTo(model.pB);
    }
  });
  it("samples two random values per trial and counts actual matches", () => {
    const values = [0, .2, .8, .8, 0, .9, 0, 0]; let i = 0;
    expect(simulateIndependent(4, "H", "even", () => values[i++])).toEqual({ trials: 4, hits: 2 });
    expect(i).toBe(8);
  });
  it("has exact frequency for an exhaustive evenly weighted sample", () => {
    const values: number[] = [];
    for (const c of [.25, .75]) for (let d = 0; d < 6; d++) values.push(c, (d + .5) / 6);
    let i = 0;
    expect(simulateIndependent(12, "H", "even", () => values[i++])).toEqual({ trials: 12, hits: 3 });
  });
  it("handles certain events and rejects invalid batch sizes", () => {
    expect(simulateIndependent(10, "either", "any", () => .5)).toEqual({ trials: 10, hits: 10 });
    expect(() => simulateIndependent(-1, "H", "even")).toThrow(RangeError);
    expect(() => simulateIndependent(1.5, "H", "even")).toThrow(RangeError);
    expect(URN_COMPARISON.redBefore).not.toBe(URN_COMPARISON.redAfterRed);
  });
});
