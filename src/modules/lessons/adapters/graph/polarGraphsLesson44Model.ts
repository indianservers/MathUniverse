export const clampPolarAngle = (degrees: number) =>
  ((Math.round(degrees) % 360) + 360) % 360;
export const clampPolarScale = (value: number) =>
  Math.max(1, Math.min(10, Math.round(value * 10) / 10));
export const clampPetalMultiplier = (value: number) =>
  Math.max(1, Math.min(10, Math.round(value)));

export function polarRosePoint(a: number, n: number, angleDegrees: number) {
  const theta = (clampPolarAngle(angleDegrees) * Math.PI) / 180;
  const radius = a * Math.sin(n * theta);
  return {
    theta,
    radius,
    x: radius * Math.cos(theta),
    y: radius * Math.sin(theta),
  };
}

export const polarPetalCount = (n: number) =>
  Math.abs(n) % 2 === 0 ? Math.abs(n) * 2 : Math.abs(n);

const plot = (x: number, y: number, scale: number) => ({
  x: 350 + x * scale,
  y: 300 - y * scale,
});

export function polarRosePath(a: number, n: number) {
  const scale = 230 / Math.max(5, a);
  return Array.from({ length: 721 }, (_, index) => {
    const theta = (index * Math.PI * 2) / 720;
    const radius = a * Math.sin(n * theta);
    const point = plot(
      radius * Math.cos(theta),
      radius * Math.sin(theta),
      scale,
    );
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function polarReferencePath(a: number) {
  const scale = 230 / Math.max(5, a);
  return Array.from({ length: 361 }, (_, degree) => {
    const theta = (degree * Math.PI) / 180;
    const radius = 2 + Math.cos(theta);
    const point = plot(
      radius * Math.cos(theta),
      radius * Math.sin(theta),
      scale,
    );
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function polarGraphPosition(a: number, point: { x: number; y: number }) {
  const scale = 230 / Math.max(5, a);
  return plot(point.x, point.y, scale);
}

export function polarAngleFromPixels(pixelX: number, pixelY: number) {
  return clampPolarAngle(
    (Math.atan2(300 - pixelY, pixelX - 350) * 180) / Math.PI,
  );
}
