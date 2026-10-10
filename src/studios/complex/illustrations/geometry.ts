import { addC, mulC, type C } from "../complexLabMath";
export type Point = [number, number];
export const TAU = 2 * Math.PI;
export const polar = (r: number, a: number): C => ({ re: r * Math.cos(a), im: r * Math.sin(a) });
export const rotateI = (z: C): C => mulC(z, { re: 0, im: 1 });
export const affine = (z: C, a: C, b: C): C => addC(mulC(a, z), b);
export const rootsOfUnity = (n: number) => Array.from({ length: n }, (_, k) => polar(1, TAU * k / n));
export const phasor = (angle: number) => ({ z: polar(1, angle), voltage: Math.sin(angle), current: Math.sin(angle - Math.PI / 4) });
export const plot = (z: C, scale = 45): Point => [100 + scale * z.re, 101 - scale * z.im];
export const smooth = (p: number) => { const q = Math.max(0, Math.min(1, p)); return q * q * (3 - 2 * q); };
export const path = (points: Point[], close = false) => points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ") + (close ? "Z" : "");
export const sample = (fn: (a: number) => Point, start: number, end: number, n = 80) => Array.from({ length: n + 1 }, (_, i) => fn(start + (end - start) * i / n));
export const helix = (t: number, turn = 0): Point => [100 + 35 * Math.cos(t + turn), 154 - t * 6.5 - 10 * Math.sin(t + turn)];
export type Rect = { x: number; y: number; width: number; height: number };
export const intersects = (a: Rect, b: Rect) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
/** Largest useful empty right-side rectangle, without moving any existing text/link. */
export function illustrationSlot(width: number, height: number, obstacles: Rect[]): Rect {
  let best: Rect = { x: width - 9, y: 36, width: 0, height: 0 }, score = -1;
  const starts = [36, ...obstacles.map(b => b.y + b.height + 5)];
  const ends = [height - 12, ...obstacles.map(b => b.y - 5)];
  for (const y of starts) for (const bottom of ends) {
    const h = Math.min(136, bottom - y);
    if (h < 18 || y < 32 || y + h > height - 10) continue;
    const blockers = obstacles.filter(b => b.y < y + h && b.y + b.height > y);
    const x = Math.max(width * .47, ...blockers.map(b => b.x + b.width + 5));
    const w = Math.min(width - x - 9, 148);
    if (w < 18) continue;
    const candidate = { x: width - 9 - w, y, width: w, height: h };
    const value = w * h * Math.min(1, Math.min(w, h) / Math.max(w, h) * 1.5);
    if (value > score && !obstacles.some(o => intersects(candidate, o))) { best = candidate; score = value; }
  }
  return best;
}
