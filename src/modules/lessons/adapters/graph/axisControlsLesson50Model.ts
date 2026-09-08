export type AxisScale = "linear" | "log";
export type AxisControlState = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xTick: number;
  yTick: number;
  xScale: AxisScale;
  yScale: AxisScale;
  originX: number;
  originY: number;
};

export const DEFAULT_AXIS_STATE: AxisControlState = {
  xMin: -4,
  xMax: 4,
  yMin: 0,
  yMax: 18,
  xTick: 1,
  yTick: 2,
  xScale: "linear",
  yScale: "linear",
  originX: 0,
  originY: 0,
};
export const AXIS_PRESETS = {
  default: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
  zoom: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
  origin: { xMin: -2, xMax: 2, yMin: -2, yMax: 2 },
  wide: { xMin: -20, xMax: 20, yMin: -10, yMax: 10 },
} as const;

export const axisFunctionValue = (x: number) => 2 ** x;

export function normalizeAxisState(state: AxisControlState): AxisControlState {
  let { xMin, xMax, yMin, yMax } = state;
  if (xMax <= xMin) xMax = xMin + 1;
  if (yMax <= yMin) yMax = yMin + 1;
  if (state.xScale === "log") {
    xMin = Math.max(0.1, xMin);
    xMax = Math.max(xMin + 0.1, xMax);
  }
  if (state.yScale === "log") {
    yMin = Math.max(0.1, yMin);
    yMax = Math.max(yMin + 0.1, yMax);
  }
  return {
    ...state,
    xMin,
    xMax,
    yMin,
    yMax,
    xTick: Math.max(0.1, Math.abs(state.xTick)),
    yTick: Math.max(0.1, Math.abs(state.yTick)),
  };
}

const projectAxis = (
  value: number,
  min: number,
  max: number,
  scale: AxisScale,
) =>
  scale === "log"
    ? (Math.log10(value) - Math.log10(min)) /
      (Math.log10(max) - Math.log10(min))
    : (value - min) / (max - min);
const unprojectAxis = (
  ratio: number,
  min: number,
  max: number,
  scale: AxisScale,
) =>
  scale === "log"
    ? 10 ** (Math.log10(min) + ratio * (Math.log10(max) - Math.log10(min)))
    : min + ratio * (max - min);

export function axisGraphPosition(
  x: number,
  y: number,
  state: AxisControlState,
  width = 620,
  height = 500,
) {
  const normalized = normalizeAxisState(state);
  return {
    x:
      projectAxis(x, normalized.xMin, normalized.xMax, normalized.xScale) *
      width,
    y:
      (1 -
        projectAxis(y, normalized.yMin, normalized.yMax, normalized.yScale)) *
      height,
  };
}

export function axisWorldFromPixels(
  pixelX: number,
  pixelY: number,
  state: AxisControlState,
  width = 620,
  height = 500,
) {
  const normalized = normalizeAxisState(state);
  return {
    x: unprojectAxis(
      pixelX / width,
      normalized.xMin,
      normalized.xMax,
      normalized.xScale,
    ),
    y: unprojectAxis(
      1 - pixelY / height,
      normalized.yMin,
      normalized.yMax,
      normalized.yScale,
    ),
  };
}

export function axisCurvePath(state: AxisControlState) {
  const normalized = normalizeAxisState(state),
    points: string[] = [];
  for (let index = 0; index <= 500; index += 1) {
    const ratio = index / 500;
    const x = unprojectAxis(
      ratio,
      normalized.xMin,
      normalized.xMax,
      normalized.xScale,
    );
    const y = axisFunctionValue(x);
    if (y <= normalized.yMax * 1.25 && y >= Math.max(0.0001, normalized.yMin)) {
      const point = axisGraphPosition(x, y, normalized);
      points.push(`${point.x},${point.y}`);
    }
  }
  return points.join(" ");
}

export function applyAxisPreset(
  state: AxisControlState,
  preset: keyof typeof AXIS_PRESETS,
) {
  return normalizeAxisState({
    ...state,
    ...AXIS_PRESETS[preset],
    xScale: "linear",
    yScale: "linear",
    originX: 0,
    originY: 0,
  });
}
