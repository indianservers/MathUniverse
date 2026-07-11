export const MAX_FRACTAL_RENDER_ITERATION = 5;
export const MAX_FRACTAL_MATH_ITERATION = 12;
export const MAX_FRACTAL_ITERATION = MAX_FRACTAL_RENDER_ITERATION;
export const DEFAULT_SOLID_ROWS = 4;
export const DEFAULT_SOLID_COLS = 4;
export const MAX_STACK_HEIGHT = 4;

export type RationalFraction = {
  numerator: number;
  denominator: number;
  text: string;
};

export type CarpetCell = {
  x: number;
  y: number;
  size: number;
  level: number;
  key: string;
};

export type SierpinskiStats = {
  iteration: number;
  retainedSquares: number;
  newlyRemovedSquares: number;
  cumulativeRemovedSquares: number;
  sideScaleDenominator: number;
  sideScaleText: string;
  smallestAreaDenominator: number;
  retainedAreaNumerator: number;
  retainedAreaDenominator: number;
  retainedAreaText: string;
  removedAreaNumerator: number;
  removedAreaDenominator: number;
  removedAreaText: string;
  retainedAreaDecimal: number;
  removedAreaDecimal: number;
  retainedPercent: number;
  removedPercent: number;
};

export type CubeStackGrid = number[][];

export type SolidPreset = {
  id: string;
  title: string;
  description: string;
  grid: CubeStackGrid;
};

export type ProjectionName = "top" | "front" | "left" | "right";
export type ProjectionOrientation = "front" | "back" | "left" | "right";

export type ProjectionSet = Record<ProjectionName, number[][]>;

export type ProjectionValidation = {
  topMatches: boolean;
  frontMatches: boolean;
  leftMatches: boolean;
  rightMatches: boolean;
  cubeCountMatches: boolean;
  acceptsAlternative: boolean;
  message: string;
};

export type ProjectionMismatch = {
  name: ProjectionName;
  expected: number[][];
  actual: number[][];
};

export type ReconstructionValidation = ProjectionValidation & {
  mismatches: ProjectionMismatch[];
};

export function clampFractalIteration(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX_FRACTAL_ITERATION, Math.round(value)));
}

export function assertSierpinskiIteration(value: number, maxIteration = MAX_FRACTAL_MATH_ITERATION) {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error("Sierpinski iteration must be a finite whole number.");
  }
  if (value < 0) {
    throw new Error("Sierpinski iteration cannot be negative.");
  }
  if (value > maxIteration) {
    throw new Error(`Sierpinski iteration ${value} is above the supported math limit ${maxIteration}.`);
  }
  return value;
}

function fraction(numerator: number, denominator: number): RationalFraction {
  return { numerator, denominator, text: `${numerator}/${denominator}` };
}

export function getSierpinskiRetainedSquareCount(iterationValue: number) {
  const iteration = assertSierpinskiIteration(iterationValue);
  return 8 ** iteration;
}

export function getSierpinskiNewlyRemovedSquareCount(iterationValue: number) {
  const iteration = assertSierpinskiIteration(iterationValue);
  return iteration === 0 ? 0 : 8 ** (iteration - 1);
}

export function getSierpinskiCumulativeRemovedSquareCount(iterationValue: number) {
  const iteration = assertSierpinskiIteration(iterationValue);
  return iteration === 0 ? 0 : (8 ** iteration - 1) / 7;
}

export function getSierpinskiSmallestSideScale(iterationValue: number): RationalFraction {
  const iteration = assertSierpinskiIteration(iterationValue);
  return fraction(1, 3 ** iteration);
}

export function getSierpinskiSmallestSquareArea(iterationValue: number): RationalFraction {
  const iteration = assertSierpinskiIteration(iterationValue);
  return fraction(1, 9 ** iteration);
}

export function getSierpinskiRetainedAreaFraction(iterationValue: number): RationalFraction {
  const iteration = assertSierpinskiIteration(iterationValue);
  return fraction(8 ** iteration, 9 ** iteration);
}

export function getSierpinskiRemovedAreaFraction(iterationValue: number): RationalFraction {
  const retained = getSierpinskiRetainedAreaFraction(iterationValue);
  return fraction(retained.denominator - retained.numerator, retained.denominator);
}

export function getSierpinskiStats(value: number): SierpinskiStats {
  const iteration = clampFractalIteration(value);
  return getSierpinskiIterationSummary(iteration);
}

export function getSierpinskiIterationSummary(value: number): SierpinskiStats {
  const iteration = assertSierpinskiIteration(value);
  const retainedSquares = getSierpinskiRetainedSquareCount(iteration);
  const newlyRemovedSquares = getSierpinskiNewlyRemovedSquareCount(iteration);
  const cumulativeRemovedSquares = getSierpinskiCumulativeRemovedSquareCount(iteration);
  const sideScale = getSierpinskiSmallestSideScale(iteration);
  const smallestArea = getSierpinskiSmallestSquareArea(iteration);
  const retainedArea = getSierpinskiRetainedAreaFraction(iteration);
  const removedArea = getSierpinskiRemovedAreaFraction(iteration);
  const retainedAreaDecimal = retainedArea.numerator / retainedArea.denominator;
  const removedAreaDecimal = removedArea.numerator / removedArea.denominator;

  return {
    iteration,
    retainedSquares,
    newlyRemovedSquares,
    cumulativeRemovedSquares,
    sideScaleDenominator: sideScale.denominator,
    sideScaleText: sideScale.text,
    smallestAreaDenominator: smallestArea.denominator,
    retainedAreaNumerator: retainedArea.numerator,
    retainedAreaDenominator: retainedArea.denominator,
    retainedAreaText: retainedArea.text,
    removedAreaNumerator: removedArea.numerator,
    removedAreaDenominator: removedArea.denominator,
    removedAreaText: removedArea.text,
    retainedAreaDecimal,
    removedAreaDecimal,
    retainedPercent: retainedAreaDecimal * 100,
    removedPercent: removedAreaDecimal * 100,
  };
}

export function getSierpinskiTable(iteration: number) {
  const end = clampFractalIteration(iteration);
  return Array.from({ length: end + 1 }, (_, index) => getSierpinskiStats(index));
}

export function getSierpinskiMathTable(iteration: number) {
  const end = assertSierpinskiIteration(iteration);
  return Array.from({ length: end + 1 }, (_, index) => getSierpinskiIterationSummary(index));
}

export function generateSierpinskiRemovedSquares(iterationValue: number): CarpetCell[] {
  const iteration = clampFractalIteration(iterationValue);
  const cells: CarpetCell[] = [];

  const visit = (x: number, y: number, size: number, level: number, key: string) => {
    if (level > iteration) return;
    const third = size / 3;
    cells.push({ x: x + third, y: y + third, size: third, level, key: `${key}-center-${level}` });
    if (level === iteration) return;
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        if (row === 1 && col === 1) continue;
        visit(x + col * third, y + row * third, third, level + 1, `${key}-${row}${col}`);
      }
    }
  };

  if (iteration > 0) visit(0, 0, 1, 1, "root");
  return cells;
}

export function generateSierpinskiRetainedSquares(iterationValue: number): CarpetCell[] {
  const iteration = clampFractalIteration(iterationValue);
  let cells: CarpetCell[] = [{ x: 0, y: 0, size: 1, level: 0, key: "root" }];
  for (let level = 1; level <= iteration; level += 1) {
    cells = cells.flatMap((cell) => {
      const third = cell.size / 3;
      const next: CarpetCell[] = [];
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 3; col += 1) {
          if (row === 1 && col === 1) continue;
          next.push({
            x: cell.x + col * third,
            y: cell.y + row * third,
            size: third,
            level,
            key: `${cell.key}-${row}${col}`,
          });
        }
      }
      return next;
    });
  }
  return cells;
}

export function generateSierpinskiCells(iteration: number, mode: "removed" | "retained" = "removed") {
  return mode === "retained" ? generateSierpinskiRetainedSquares(iteration) : generateSierpinskiRemovedSquares(iteration);
}

export function createEmptyGrid(rows = DEFAULT_SOLID_ROWS, cols = DEFAULT_SOLID_COLS): CubeStackGrid {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

export function cloneGrid(grid: CubeStackGrid): CubeStackGrid {
  return grid.map((row) => [...row]);
}

export function normalizeGrid(grid: CubeStackGrid): CubeStackGrid {
  return grid.map((row) => row.map((height) => Math.max(0, Math.min(MAX_STACK_HEIGHT, Math.round(height)))));
}

export function setStackHeight(grid: CubeStackGrid, row: number, col: number, height: number): CubeStackGrid {
  const next = cloneGrid(grid);
  if (!next[row] || next[row][col] === undefined) return next;
  next[row][col] = Math.max(0, Math.min(MAX_STACK_HEIGHT, Math.round(height)));
  return next;
}

export function changeStackHeight(grid: CubeStackGrid, row: number, col: number, delta: number): CubeStackGrid {
  return setStackHeight(grid, row, col, (grid[row]?.[col] ?? 0) + delta);
}

export function cubeCount(grid: CubeStackGrid) {
  return grid.reduce((total, row) => total + row.reduce((rowTotal, height) => rowTotal + height, 0), 0);
}

export function getTopProjection(grid: CubeStackGrid): number[][] {
  return normalizeGrid(grid).map((row) => row.map((height) => (height > 0 ? 1 : 0)));
}

export function getFrontHeights(grid: CubeStackGrid): number[] {
  const normalized = normalizeGrid(grid);
  const cols = normalized[0]?.length ?? 0;
  return Array.from({ length: cols }, (_, col) => Math.max(...normalized.map((row) => row[col] ?? 0)));
}

export function getLeftHeights(grid: CubeStackGrid): number[] {
  return normalizeGrid(grid).map((row) => Math.max(...row));
}

export function getRightHeights(grid: CubeStackGrid): number[] {
  return [...getLeftHeights(grid)].reverse();
}

export function getCubeCount(grid: CubeStackGrid) {
  return cubeCount(grid);
}

export function heightsToProjection(heights: number[], maxHeight = MAX_STACK_HEIGHT): number[][] {
  return Array.from({ length: maxHeight }, (_, row) => heights.map((height) => (height >= maxHeight - row ? 1 : 0)));
}

export function getProjection(grid: CubeStackGrid, name: ProjectionName): number[][] {
  if (name === "top") return getTopProjection(grid);
  if (name === "front") return heightsToProjection(getFrontHeights(grid));
  if (name === "left") return heightsToProjection(getLeftHeights(grid));
  return heightsToProjection(getRightHeights(grid));
}

export function getFrontProjection(grid: CubeStackGrid, orientation: ProjectionOrientation = "front") {
  if (orientation === "back") {
    return heightsToProjection([...getFrontHeights(grid)].reverse());
  }
  if (orientation === "left") return getProjection(grid, "left");
  if (orientation === "right") return getProjection(grid, "right");
  return getProjection(grid, "front");
}

export function getSideProjection(grid: CubeStackGrid, orientation: "left" | "right" = "left") {
  return getProjection(grid, orientation);
}

export function getProjectionSet(grid: CubeStackGrid): ProjectionSet {
  return {
    top: getProjection(grid, "top"),
    front: getProjection(grid, "front"),
    left: getProjection(grid, "left"),
    right: getProjection(grid, "right"),
  };
}

export function gridsEqual(a: number[][], b: number[][]) {
  return a.length === b.length && a.every((row, rowIndex) => row.length === (b[rowIndex]?.length ?? -1) && row.every((value, colIndex) => value === b[rowIndex][colIndex]));
}

export function validateProjectionMatch(candidate: CubeStackGrid, target: CubeStackGrid, requireCubeCount = false): ProjectionValidation {
  const topMatches = gridsEqual(getTopProjection(candidate), getTopProjection(target));
  const frontMatches = gridsEqual(getProjection(candidate, "front"), getProjection(target, "front"));
  const leftMatches = gridsEqual(getProjection(candidate, "left"), getProjection(target, "left"));
  const rightMatches = gridsEqual(getProjection(candidate, "right"), getProjection(target, "right"));
  const cubeCountMatches = cubeCount(candidate) === cubeCount(target);
  const acceptsAlternative = topMatches && frontMatches && leftMatches && rightMatches && (!requireCubeCount || cubeCountMatches);
  return {
    topMatches,
    frontMatches,
    leftMatches,
    rightMatches,
    cubeCountMatches,
    acceptsAlternative,
    message: acceptsAlternative
      ? "Projection match. This solid has the same visible views."
      : "Not yet. Compare the highlighted projection checks, then adjust cube stacks.",
  };
}

export function findProjectionMismatches(actual: ProjectionSet, expected: ProjectionSet): ProjectionMismatch[] {
  return (["top", "front", "left", "right"] as ProjectionName[])
    .filter((name) => !gridsEqual(actual[name], expected[name]))
    .map((name) => ({ name, actual: actual[name], expected: expected[name] }));
}

export function validateSolidReconstruction(candidate: CubeStackGrid, expectedProjections: ProjectionSet, expectedCubeCount?: number): ReconstructionValidation {
  const actual = getProjectionSet(candidate);
  const mismatches = findProjectionMismatches(actual, expectedProjections);
  const cubeCountMatches = expectedCubeCount === undefined || cubeCount(candidate) === expectedCubeCount;
  const acceptsAlternative = mismatches.length === 0 && cubeCountMatches;
  return {
    topMatches: gridsEqual(actual.top, expectedProjections.top),
    frontMatches: gridsEqual(actual.front, expectedProjections.front),
    leftMatches: gridsEqual(actual.left, expectedProjections.left),
    rightMatches: gridsEqual(actual.right, expectedProjections.right),
    cubeCountMatches,
    acceptsAlternative,
    mismatches,
    message: acceptsAlternative
      ? "Projection reconstruction is valid."
      : "Projection reconstruction still differs in one or more views.",
  };
}

const g = (rows: number[][]) => normalizeGrid(rows);

export const solidPresets: SolidPreset[] = [
  { id: "single", title: "Single cube", description: "One cube, one square in every view.", grid: g([[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]) },
  { id: "tower", title: "Tower", description: "Same footprint, taller front and side view.", grid: g([[0, 0, 0, 0], [0, 4, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]) },
  { id: "staircase", title: "Staircase", description: "Heights increase one step at a time.", grid: g([[1, 2, 3, 4], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]) },
  { id: "l-shape", title: "L-shape", description: "A corner path with two visible arms.", grid: g([[2, 1, 1, 0], [2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0]]) },
  { id: "corner-tower", title: "Corner tower", description: "A tall stack anchors smaller blocks.", grid: g([[4, 2, 0, 0], [2, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]) },
  { id: "symmetric", title: "Symmetric block", description: "Balanced views from both sides.", grid: g([[0, 1, 1, 0], [1, 3, 3, 1], [1, 3, 3, 1], [0, 1, 1, 0]]) },
  { id: "grade8-challenge", title: "Grade 8 challenge", description: "Irregular model for reading top, front, and side views.", grid: g([[0, 2, 3, 0], [1, 4, 2, 1], [0, 2, 0, 1], [0, 0, 1, 0]]) },
];

export const nonUniqueProjectionExamples: Array<{ title: string; a: CubeStackGrid; b: CubeStackGrid; projections: ProjectionSet }> = [
  {
    title: "Same views, different hidden cube",
    a: g([[2, 2, 0, 0], [2, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]),
    b: g([[2, 2, 0, 0], [2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]),
    projections: getProjectionSet(g([[2, 2, 0, 0], [2, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])),
  },
];

export function getSolidPreset(id: string) {
  return solidPresets.find((preset) => preset.id === id) ?? solidPresets[0];
}
