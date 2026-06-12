import { describe, expect, it } from "vitest";
import { compileFunction } from "./graphingUtils";
import { generateValueTable } from "./valueTable";

describe("value table", () => {
  it("marks roots for quadratic table values", () => {
    const fn = compileFunction("x^2 - 5x + 6");
    if (!fn) throw new Error("Expected graphable function");
    const table = generateValueTable(fn, [-1, 0, 1, 2, 3, 4]);
    expect(table.find((row) => row.x === 2)?.y).toBe(0);
    expect(table.find((row) => row.x === 3)?.y).toBe(0);
  });

  it("evaluates linear table values", () => {
    const fn = compileFunction("2*x + 5");
    if (!fn) throw new Error("Expected graphable function");
    expect(generateValueTable(fn, [5])[0]).toEqual({ x: 5, y: 15 });
  });

  it("marks undefined values", () => {
    const fn = compileFunction("1/(x-1)");
    if (!fn) throw new Error("Expected graphable function");
    expect(generateValueTable(fn, [1])[0]).toEqual({ x: 1, y: null });
  });
});
