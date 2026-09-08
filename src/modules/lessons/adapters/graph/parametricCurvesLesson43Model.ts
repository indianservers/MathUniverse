export const clampParametricRadius = (value: number) =>
  Math.max(1, Math.min(5, Math.round(value * 10) / 10));
export const clampParametricTime = (value: number) => {
  const tau = Math.PI * 2;
  return ((value % tau) + tau) % tau;
};

export function parametricPoint(a: number, b: number, t: number) {
  return { x: a * Math.cos(t), y: b * Math.sin(t) };
}

export function parametricVelocity(a: number, b: number, t: number) {
  const dx = -a * Math.sin(t);
  const dy = b * Math.cos(t);
  return { dx, dy, speed: Math.hypot(dx, dy) };
}

const graphX = (x: number) => 365 + x * 82;
const graphY = (y: number) => 290 - y * 112;

export function parametricPath(a: number, b: number) {
  return Array.from({ length: 361 }, (_, degree) => {
    const point = parametricPoint(a, b, (degree * Math.PI) / 180);
    return `${graphX(point.x)},${graphY(point.y)}`;
  }).join(" ");
}

export function lissajousPath(a: number, b: number) {
  return Array.from({ length: 721 }, (_, index) => {
    const t = ((index * Math.PI) / 360) * 2;
    return `${graphX(a * Math.sin(2 * t))},${graphY(b * Math.sin(3 * t))}`;
  }).join(" ");
}

export const parametricGraphPosition = (point: { x: number; y: number }) => ({
  x: graphX(point.x),
  y: graphY(point.y),
});

export function timeFromGraphPosition(
  pixelX: number,
  pixelY: number,
  a: number,
  b: number,
) {
  const normalizedX = (pixelX - 365) / 82 / a;
  const normalizedY = (290 - pixelY) / 112 / b;
  return clampParametricTime(Math.atan2(normalizedY, normalizedX));
}

export const formatParametricTime = (t: number) =>
  `${(t / Math.PI).toFixed(2).replace(/\.00$/, "")}π`;
export const PARAMETRIC_TABLE_TIMES = [
  0,
  Math.PI / 2,
  Math.PI,
  Math.PI * 1.5,
] as const;
