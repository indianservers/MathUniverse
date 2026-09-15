export type Point = { x: number; y: number };

export function translate(p: Point, t: Point): Point {
  return { x: p.x + t.x, y: p.y + t.y };
}

export function rotate(p: Point, c: Point, deg: number): Point {
  const r = (deg * Math.PI) / 180;
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: c.x + dx * Math.cos(r) - dy * Math.sin(r), y: c.y + dx * Math.sin(r) + dy * Math.cos(r) };
}

export function reflect(p: Point, verticalX: number): Point {
  return { x: 2 * verticalX - p.x, y: p.y };
}

export function dilate(p: Point, c: Point, k: number): Point {
  return { x: c.x + k * (p.x - c.x), y: c.y + k * (p.y - c.y) };
}

export function applyTransform(mode: string, p: Point, t: Point, rot: number, k: number, origin: Point): Point {
  if (mode === "Translate") return translate(p, t);
  if (mode === "Rotate") return rotate(p, origin, rot);
  if (mode === "Reflect") return reflect(p, origin.x);
  if (mode === "Dilate") return dilate(p, origin, k);
  return dilate(rotate(translate(p, t), origin, rot), origin, k);
}

export function isIsometry(mode: string, k: number) {
  return mode !== "Dilate" && mode !== "Compose" ? true : Math.abs(k - 1) < 0.05;
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
