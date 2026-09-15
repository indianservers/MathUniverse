import { describe, expect, it } from "vitest";
import {
  cantorSegmentCount,
  combination,
  differenceTable,
  generateArithmeticSequence,
  generateCustomRecurrence,
  generateFibonacci,
  hexagonalNumber,
  hockeyStick,
  inverseTriangularIndex,
  kochSegmentCount,
  pascalRow,
  pentagonalNumber,
  polygonalNumber,
  rowSum,
  safeEvaluateRecurrence,
  sierpinskiCount,
  squareNumber,
  triangularNumber,
} from "./patternsMath";

describe("patternsMath", () => {
  it("computes figurate numbers", () => {
    expect(triangularNumber(1)).toBe(1);
    expect(triangularNumber(6)).toBe(21);
    expect(triangularNumber(10)).toBe(55);
    expect(triangularNumber(20)).toBe(210);
    expect(squareNumber(6)).toBe(36);
    expect(squareNumber(12)).toBe(144);
    expect(pentagonalNumber(1)).toBe(1);
    expect(pentagonalNumber(5)).toBe(35);
    expect(pentagonalNumber(10)).toBe(145);
    expect(hexagonalNumber(1)).toBe(1);
    expect(hexagonalNumber(4)).toBe(28);
    expect(hexagonalNumber(10)).toBe(190);
    expect(polygonalNumber(3, 6)).toBe(21);
    expect(polygonalNumber(6, 4)).toBe(triangularNumber(7));
    expect(inverseTriangularIndex(55)).toBe(10);
    expect(inverseTriangularIndex(45)).toBe(9);
  });

  it("builds sequences, Fibonacci, and differences", () => {
    expect(generateArithmeticSequence(3, 4, 5)).toEqual([3, 7, 11, 15, 19]);
    expect(generateFibonacci(10).map(Number)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
    const table = differenceTable([1, 4, 9, 16, 25]);
    expect(table[1]).toEqual([3, 5, 7, 9]);
    expect(table[2]).toEqual([2, 2, 2]);
  });

  it("evaluates a guarded recurrence", () => {
    expect(safeEvaluateRecurrence("a[n-1]+3", 4, [3, 6, 9]).value).toBe(12);
    const fib = generateCustomRecurrence(0, 1, "a[n-1]+a[n-2]", 8);
    expect(fib.ok && fib.values).toEqual([0, 1, 1, 2, 3, 5, 8, 13]);
    expect(safeEvaluateRecurrence("eval(1)", 2, [1]).ok).toBe(false);
  });

  it("matches Pascal identities", () => {
    expect(pascalRow(0)).toEqual([1]);
    expect(pascalRow(1)).toEqual([1, 1]);
    expect(pascalRow(4)).toEqual([1, 4, 6, 4, 1]);
    expect(pascalRow(6)).toEqual([1, 6, 15, 20, 15, 6, 1]);
    expect(combination(6, 2)).toBe(15);
    expect(combination(10, 3)).toBe(120);
    expect(rowSum(10)).toBe(1024);
    expect(hockeyStick(5, 2).sum).toBe(hockeyStick(5, 2).result);
  });

  it("counts fractal pieces", () => {
    expect(sierpinskiCount(0)).toBe(1);
    expect(sierpinskiCount(1)).toBe(3);
    expect(sierpinskiCount(2)).toBe(9);
    expect(sierpinskiCount(5)).toBe(243);
    expect(cantorSegmentCount(3)).toBe(8);
    expect(kochSegmentCount(0)).toBe(3);
    expect(kochSegmentCount(1)).toBe(12);
    expect(kochSegmentCount(2)).toBe(48);
  });
});
