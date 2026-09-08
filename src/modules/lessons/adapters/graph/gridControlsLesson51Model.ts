export type GridControlState = {
  majorSpacing: number;
  subdivisions: number;
  snap: boolean;
  opacity: number;
  estimate: boolean;
  labels: boolean;
  selectedX: number;
};

export const DEFAULT_GRID_STATE: GridControlState = {
  majorSpacing: 1,
  subdivisions: 4,
  snap: true,
  opacity: 0.8,
  estimate: true,
  labels: true,
  selectedX: 1.5,
};
export const GRID_MAJOR_OPTIONS = [0.5, 1, 2, 4] as const;
export const GRID_SUBDIVISION_OPTIONS = [1, 2, 4, 8] as const;
export const GRID_BOUNDS = { xMin: -3.5, xMax: 3.5, yMin: -1.3, yMax: 4.2 };
export const gridFunctionValue = (x: number) => 0.5 * x * x;

export function snapGridX(
  x: number,
  state: Pick<GridControlState, "majorSpacing" | "subdivisions" | "snap">,
) {
  const bounded = Math.max(GRID_BOUNDS.xMin, Math.min(GRID_BOUNDS.xMax, x));
  if (!state.snap) return Math.round(bounded * 100) / 100;
  const interval = state.majorSpacing / state.subdivisions;
  return Number((Math.round(bounded / interval) * interval).toFixed(4));
}

export function gridGraphPosition(
  x: number,
  y: number,
  width = 620,
  height = 540,
) {
  return {
    x: ((x - GRID_BOUNDS.xMin) / (GRID_BOUNDS.xMax - GRID_BOUNDS.xMin)) * width,
    y:
      ((GRID_BOUNDS.yMax - y) / (GRID_BOUNDS.yMax - GRID_BOUNDS.yMin)) * height,
  };
}

export function gridXFromPixel(
  pixelX: number,
  state: GridControlState,
  width = 620,
) {
  return snapGridX(
    GRID_BOUNDS.xMin + (pixelX / width) * (GRID_BOUNDS.xMax - GRID_BOUNDS.xMin),
    state,
  );
}

export function gridCurvePath(width = 620, height = 540) {
  return Array.from({ length: 401 }, (_, index) => {
    const x =
      GRID_BOUNDS.xMin + ((GRID_BOUNDS.xMax - GRID_BOUNDS.xMin) * index) / 400;
    const point = gridGraphPosition(x, gridFunctionValue(x), width, height);
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function gridLines(
  state: Pick<GridControlState, "majorSpacing" | "subdivisions">,
) {
  const minorSpacing = state.majorSpacing / state.subdivisions;
  const vertical = [],
    horizontal = [];
  for (
    let x = Math.ceil(GRID_BOUNDS.xMin / minorSpacing) * minorSpacing;
    x <= GRID_BOUNDS.xMax + 1e-9;
    x += minorSpacing
  )
    vertical.push({
      value: Number(x.toFixed(5)),
      major:
        Math.abs(x / state.majorSpacing - Math.round(x / state.majorSpacing)) <
        1e-6,
    });
  for (
    let y = Math.ceil(GRID_BOUNDS.yMin / minorSpacing) * minorSpacing;
    y <= GRID_BOUNDS.yMax + 1e-9;
    y += minorSpacing
  )
    horizontal.push({
      value: Number(y.toFixed(5)),
      major:
        Math.abs(y / state.majorSpacing - Math.round(y / state.majorSpacing)) <
        1e-6,
    });
  return { vertical, horizontal, minorSpacing };
}
