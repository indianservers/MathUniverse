export const TRACE_X_MIN = -2 * Math.PI;
export const TRACE_X_MAX = 2 * Math.PI;
export const TRACE_STEP_OPTIONS = [0.01, 0.1, 0.5, 1] as const;

export const traceModeValue = (x: number) => Math.sin(x) + 0.3 * x;
export const traceModeSlope = (x: number) => Math.cos(x) + 0.3;
export const clampTraceX = (x: number) =>
  Math.max(TRACE_X_MIN, Math.min(TRACE_X_MAX, x));
export const snapTraceX = (x: number, step: number) =>
  Number((Math.round(clampTraceX(x) / step) * step).toFixed(4));

export type TraceView = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};
export const TRACE_MODE_VIEW: TraceView = {
  xMin: -2.4 * Math.PI,
  xMax: 2.4 * Math.PI,
  yMin: -2.5,
  yMax: 3.5,
};

export function traceGraphPosition(
  x: number,
  y: number,
  view = TRACE_MODE_VIEW,
) {
  return {
    x: 35 + ((x - view.xMin) / (view.xMax - view.xMin)) * 620,
    y: 25 + ((view.yMax - y) / (view.yMax - view.yMin)) * 500,
  };
}

export function traceXFromPixel(
  pixelX: number,
  step: number,
  view = TRACE_MODE_VIEW,
) {
  return snapTraceX(
    view.xMin + ((pixelX - 35) / 620) * (view.xMax - view.xMin),
    step,
  );
}

export function traceFunctionPath(view = TRACE_MODE_VIEW) {
  return Array.from({ length: 601 }, (_, index) => {
    const x = view.xMin + ((view.xMax - view.xMin) * index) / 600;
    const point = traceGraphPosition(x, traceModeValue(x), view);
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function traceTangentPath(x: number, view = TRACE_MODE_VIEW) {
  const y = traceModeValue(x),
    slope = traceModeSlope(x);
  return [-2, 2]
    .map((offset) => {
      const point = traceGraphPosition(x + offset, y + slope * offset, view);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export function nearbyTraceValues(x: number, step: number) {
  return Array.from({ length: 9 }, (_, index) => {
    const value = Number((x + (index - 4) * step).toFixed(4));
    return { x: value, y: traceModeValue(value) };
  });
}
