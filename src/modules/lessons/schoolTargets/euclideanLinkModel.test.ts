import { describe, expect, it } from "vitest";
import { checkReverseFraction, euclideanArea, euclideanLink, reverseEuclideanLink } from "./euclideanLinkModel";
describe("Euclidean and continued-fraction synchronization", () => {
  it("maps the default remainder chain to quotients and stops before dividing by zero", () => {
    const model = euclideanLink(43, 19);
    expect(model.chain).toEqual([43, 19, 5, 4, 1, 0]);
    expect(model.terms).toEqual([2, 3, 1, 4]);
    expect(model.reciprocalRows.map(row => row.reciprocal)).toEqual([[19, 5], [5, 4], [4, 1], null]);
  });
  it("handles common-factor, Fibonacci, below-one and integer examples", () => {
    expect(euclideanLink(84, 30)).toMatchObject({ divisor: 6, terms: [2, 1, 4], reduced: [14, 5] });
    expect(euclideanLink(34, 21).terms).toEqual([1, 1, 1, 1, 1, 1, 2]);
    expect(euclideanLink(5, 7).terms).toEqual([0, 1, 2, 2]);
    expect(euclideanLink(21, 7).chain).toEqual([21, 7, 0]);
  });
  it("reconstructs edited quotients and validates supported bounds", () => {
    expect(reverseEuclideanLink(["2", "3", "1", "4"]).reduced).toEqual([43, 19]);
    expect(reverseEuclideanLink(["3", "2", "2", "1"]).reduced).toEqual([24, 7]);
    expect(reverseEuclideanLink(["0", "2"]).reduced).toEqual([1, 2]);
    for (const input of [[""], ["1", "0"], ["-1"], ["2.2"], ["1000000", "1000000"], Array(13).fill("2")]) expect(() => reverseEuclideanLink(input)).toThrow();
  });
  it("exactly covers area for every pair up to 100 including grouped large quotients", () => {
    for (let a = 1; a <= 100; a++) for (let b = 1; b <= 100; b++) {
      const area = euclideanArea(a, b);
      expect(area.groups.reduce((sum, group) => sum + group.width, 0) + area.remainderWidth).toBeCloseTo(1, 12);
      expect(area.quotient * b + area.remainder).toBe(a);
      expect(area.groups.length).toBeLessThanOrEqual(24);
    }
    expect(euclideanArea(1000000, 1).groups).toEqual([{ x: 0, width: 1, count: 1000000, value: 1000000 }]);
    expect(() => euclideanArea(10, 0)).toThrow();
  });
  it("checks reverse practice against reconstruction rather than a hardcoded unrelated fraction", () => {
    expect(checkReverseFraction("24/7", [3, 2, 2, 1])).toBe(true);
    expect(checkReverseFraction("48/14", [3, 2, 2, 1])).toBe(true);
    expect(checkReverseFraction("43/12", [3, 2, 2, 1])).toBe(false);
    expect(checkReverseFraction("0/0", [3, 2, 2, 1])).toBe(false);
    expect(checkReverseFraction("3.4", [3, 2, 2, 1])).toBe(false);
  });
});
