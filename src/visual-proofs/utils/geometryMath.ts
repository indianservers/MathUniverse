export type Point = {
  x: number;
  y: number;
};

export function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number) {
  return (radians * 180) / Math.PI;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(value: number, digits = 2) {
  return Number.isInteger(value) ? String(value) : value.toFixed(digits).replace(/\.?0+$/, "");
}

export function distanceBetweenPoints(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function triangleArea(a: Point, b: Point, c: Point) {
  return Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
}

export function interpolatePoint(a: Point, b: Point, t: number): Point {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

export function angleBetweenPoints(center: Point, a: Point, b: Point) {
  const first = Math.atan2(a.y - center.y, a.x - center.x);
  const second = Math.atan2(b.y - center.y, b.x - center.x);
  return radToDeg(Math.abs(second - first));
}

export function regularPolygonPoints(sides: number, cx: number, cy: number, radius: number, rotation = -90): Point[] {
  return Array.from({ length: sides }, (_, index) => {
    const angle = degToRad(rotation + (index * 360) / sides);
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
}

export function polygonPoints(points: Point[]) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}
