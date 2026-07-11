import { describe, expect, it } from "vitest";
import {
  changeStackHeight,
  createEmptyGrid,
  cubeCount,
  generateSierpinskiRemovedSquares,
  generateSierpinskiRetainedSquares,
  getCubeCount,
  getFrontHeights,
  getProjection,
  getProjectionSet,
  getSierpinskiCumulativeRemovedSquareCount,
  getSierpinskiIterationSummary,
  getSierpinskiMathTable,
  getSierpinskiNewlyRemovedSquareCount,
  getSierpinskiRemovedAreaFraction,
  getSierpinskiRetainedAreaFraction,
  getSierpinskiRetainedSquareCount,
  getSierpinskiSmallestSideScale,
  getSierpinskiStats,
  getSierpinskiTable,
  getTopProjection,
  nonUniqueProjectionExamples,
  setStackHeight,
  solidPresets,
  validateSolidReconstruction,
  validateProjectionMatch,
} from "./fractalsSolidViewsMath";

describe("Sierpinski carpet math", () => {
  it("computes exact iteration counts and area fractions", () => {
    expect(getSierpinskiStats(0)).toMatchObject({
      retainedSquares: 1,
      newlyRemovedSquares: 0,
      cumulativeRemovedSquares: 0,
      retainedAreaText: "1/1",
      removedAreaText: "0/1",
    });
    expect(getSierpinskiStats(1)).toMatchObject({
      retainedSquares: 8,
      newlyRemovedSquares: 1,
      cumulativeRemovedSquares: 1,
      sideScaleText: "1/3",
      retainedAreaText: "8/9",
      removedAreaText: "1/9",
    });
    expect(getSierpinskiStats(4)).toMatchObject({
      retainedSquares: 4096,
      newlyRemovedSquares: 512,
      cumulativeRemovedSquares: 585,
      sideScaleText: "1/81",
      retainedAreaText: "4096/6561",
      removedAreaText: "2465/6561",
    });
  });

  it("generates removed and retained cells by the recurrence", () => {
    expect(generateSierpinskiRemovedSquares(0)).toHaveLength(0);
    expect(generateSierpinskiRemovedSquares(1)).toHaveLength(1);
    expect(generateSierpinskiRemovedSquares(2)).toHaveLength(9);
    expect(generateSierpinskiRetainedSquares(3)).toHaveLength(512);
  });

  it("builds sequence rows only up to the selected iteration", () => {
    expect(getSierpinskiTable(3).map((row) => row.retainedSquares)).toEqual([1, 8, 64, 512]);
  });

  it("exposes exact typed formula helpers without render clamping", () => {
    expect(getSierpinskiRetainedSquareCount(6)).toBe(262144);
    expect(getSierpinskiNewlyRemovedSquareCount(6)).toBe(32768);
    expect(getSierpinskiCumulativeRemovedSquareCount(6)).toBe(37449);
    expect(getSierpinskiSmallestSideScale(4)).toEqual({ numerator: 1, denominator: 81, text: "1/81" });
    expect(getSierpinskiRetainedAreaFraction(4).text).toBe("4096/6561");
    expect(getSierpinskiRemovedAreaFraction(4).text).toBe("2465/6561");
    expect(getSierpinskiIterationSummary(6).iteration).toBe(6);
    expect(getSierpinskiMathTable(6)).toHaveLength(7);
  });

  it("rejects invalid exact math iterations instead of silently hiding mistakes", () => {
    expect(() => getSierpinskiRetainedSquareCount(-1)).toThrow(/negative/i);
    expect(() => getSierpinskiRetainedSquareCount(1.5)).toThrow(/whole number/i);
  });
});

describe("solid views math", () => {
  it("edits and clamps stack heights", () => {
    const grid = createEmptyGrid();
    const raised = setStackHeight(grid, 1, 2, 9);
    expect(raised[1][2]).toBe(4);
    const lowered = changeStackHeight(raised, 1, 2, -2);
    expect(lowered[1][2]).toBe(2);
    expect(grid[1][2]).toBe(0);
  });

  it("computes top and front projections from cube stacks", () => {
    const grid = [
      [0, 2, 0, 0],
      [1, 3, 0, 0],
      [0, 0, 4, 0],
      [0, 0, 0, 0],
    ];
    expect(cubeCount(grid)).toBe(10);
    expect(getTopProjection(grid)).toEqual([
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ]);
    expect(getFrontHeights(grid)).toEqual([1, 3, 4, 0]);
    expect(getProjection(grid, "front")[0]).toEqual([0, 0, 1, 0]);
  });

  it("accepts alternate solids when projections match and cube count is optional", () => {
    const target = solidPresets.find((preset) => preset.id === "tower")?.grid ?? createEmptyGrid();
    const candidate = setStackHeight(createEmptyGrid(), 1, 1, 4);
    expect(validateProjectionMatch(candidate, target).acceptsAlternative).toBe(true);
    expect(validateProjectionMatch(candidate, target, true).cubeCountMatches).toBe(true);
  });

  it("validates projection reconstruction against generated projection sets", () => {
    const example = nonUniqueProjectionExamples[0];
    expect(getCubeCount(example.b)).toBeGreaterThan(getCubeCount(example.a));
    expect(validateSolidReconstruction(example.a, example.projections).acceptsAlternative).toBe(true);
    expect(validateSolidReconstruction(example.b, example.projections).acceptsAlternative).toBe(true);
    expect(validateSolidReconstruction(example.b, getProjectionSet(example.a), getCubeCount(example.a)).acceptsAlternative).toBe(false);
  });
});
