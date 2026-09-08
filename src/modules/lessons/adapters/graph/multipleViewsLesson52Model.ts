export type MultipleViewId = "algebra" | "graph" | "table" | "detail";
export type MultipleLayout = "single" | "grid" | "split" | "stack";
export type MultipleViewBounds = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export const MULTIPLE_FULL_BOUNDS: MultipleViewBounds = {
  xMin: -5,
  xMax: 5,
  yMin: -2.3,
  yMax: 2.3,
};
export const multipleViewValue = (x: number) => Math.sin(x) + 0.25 * x;
export const multipleViewSlope = (x: number) => Math.cos(x) + 0.25;
export const clampMultipleX = (x: number) =>
  Math.max(-5, Math.min(5, Math.round(x * 10) / 10));

export function detailBounds(x: number): MultipleViewBounds {
  const y = multipleViewValue(x);
  return { xMin: x - 0.4, xMax: x + 0.4, yMin: y - 0.4, yMax: y + 0.4 };
}

export function multipleGraphPosition(
  x: number,
  y: number,
  bounds: MultipleViewBounds,
  width: number,
  height: number,
) {
  return {
    x: ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width,
    y: ((bounds.yMax - y) / (bounds.yMax - bounds.yMin)) * height,
  };
}

export function multipleCurvePath(
  bounds: MultipleViewBounds,
  width: number,
  height: number,
) {
  return Array.from({ length: 401 }, (_, index) => {
    const x = bounds.xMin + ((bounds.xMax - bounds.xMin) * index) / 400;
    const point = multipleGraphPosition(
      x,
      multipleViewValue(x),
      bounds,
      width,
      height,
    );
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function multipleXFromPixel(
  pixelX: number,
  bounds: MultipleViewBounds,
  width: number,
) {
  return clampMultipleX(
    bounds.xMin + (pixelX / width) * (bounds.xMax - bounds.xMin),
  );
}

export const MULTIPLE_TABLE_X = [-1, 0, 1, 2, 3, 4] as const;
