export type CartesianPoint = { x: number; y: number };

const snap = (value: number) =>
  Math.max(-5, Math.min(5, Math.round(value * 2) / 2));

export function cartesianPointAnalysis(xValue: number, yValue: number) {
  const x = snap(Number.isFinite(xValue) ? xValue : 0),
    y = snap(Number.isFinite(yValue) ? yValue : 0),
    quadrant =
      x === 0 && y === 0
        ? "Origin"
        : x === 0
          ? "y-axis"
          : y === 0
            ? "x-axis"
            : x > 0 && y > 0
              ? "Quadrant I"
              : x < 0 && y > 0
                ? "Quadrant II"
                : x < 0 && y < 0
                  ? "Quadrant III"
                  : "Quadrant IV";
  return {
    x,
    y,
    quadrant,
    orderedPair: `(${x}, ${y})`,
    horizontalDirection: x < 0 ? "left" : x > 0 ? "right" : "stay on y-axis",
    verticalDirection: y < 0 ? "down" : y > 0 ? "up" : "stay on x-axis",
    confirmed: Number.isFinite(x) && Number.isFinite(y),
  };
}

export function graphPosition(point: CartesianPoint) {
  return {
    x: 380 + snap(point.x) * 60,
    y: 310 - snap(point.y) * 50,
  };
}

export function pointFromGraphPosition(pixelX: number, pixelY: number) {
  return cartesianPointAnalysis((pixelX - 380) / 60, (310 - pixelY) / 50);
}

export const CARTESIAN_SAMPLE_POINTS = [
  { name: "P", x: 2, y: 3, tone: "cyan" },
  { name: "A", x: -3, y: 1, tone: "orange" },
  { name: "B", x: 0, y: -2, tone: "green" },
  { name: "C", x: 4, y: -1, tone: "pink" },
] as const;
