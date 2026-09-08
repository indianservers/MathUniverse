import { expect, it } from "vitest";
import { collatzRange, collatzTrace } from "./collatzLessonModel";
it("computes actual reference stopping times and peaks", () => {
  expect(collatzTrace(27)).toMatchObject({ stopping: 111, peak: 9232n, reachedOne: true });
  expect(collatzTrace(6)).toMatchObject({ stopping: 8, peak: 16n });
  expect(collatzTrace(19)).toMatchObject({ stopping: 20, peak: 88n });
  expect(collatzTrace(97)).toMatchObject({ stopping: 118, peak: 9232n });
  expect(collatzTrace(1)).toMatchObject({ stopping: 0, peak: 1n, values: [1n] });
});
it("checks each transition for starts 1 through 1000", () => {
  for (let n = 1; n <= 1000; n++) {
    const trace = collatzTrace(n);
    expect(trace.reachedOne).toBe(true);
    trace.values.slice(1).forEach((value, i) => expect(value).toBe(trace.values[i] % 2n === 0n ? trace.values[i] / 2n : 3n * trace.values[i] + 1n));
    expect(trace.peak).toBe(trace.values.reduce((max, v) => v > max ? v : max));
  }
});
it("reports bounded unresolved orbits without claiming counterexamples", () => {
  expect(collatzTrace(27, 3)).toMatchObject({ stopping: null, transitions: 3, reachedOne: false });
  expect(collatzRange(1, 10, "all", 0)).toEqual({ checked: 10, reached: 1, unresolved: [2, 3, 4, 5, 6, 7, 8, 9, 10] });
});
it("counts filtered ranges exactly and finds the real first100 leader", () => {
  expect(collatzRange(1, 100, "even")).toMatchObject({ checked: 50, reached: 50, unresolved: [] });
  expect(collatzRange(2, 8, "odd")).toMatchObject({ checked: 3, reached: 3 });
  const sorted = Array.from({ length: 100 }, (_, i) => collatzTrace(i + 1)).sort((a, b) => b.stopping! - a.stopping!);
  expect(sorted[0].start).toBe(97);
});
it("rejects invalid starts and search bounds", () => {
  expect(() => collatzTrace(0)).toThrow(); expect(() => collatzTrace(100001)).toThrow();
  expect(() => collatzRange(5, 1, "all")).toThrow(); expect(() => collatzTrace(27, 10001)).toThrow();
});
it("checks the full supported range without unresolved starts at the configured limit", () => {
  expect(collatzRange(1, 100000, "all")).toEqual({ checked: 100000, reached: 100000, unresolved: [] });
}, 30000);
