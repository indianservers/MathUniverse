import type { Pt, TrianglePts } from "./triangleGeometry";
import { clampPoint, dist, sub, triangleArea } from "./triangleGeometry";

export type SnapMode = "off" | "grid" | "integer" | "angle";
export type LockMode = "none" | "isosceles" | "right";

export function snapPoint(p: Pt, mode: SnapMode, origin?: Pt): Pt {
  if (mode === "off") return p;
  if (mode === "angle" && origin) {
    const v = sub(p, origin);
    const r = Math.hypot(v.x, v.y);
    if (r < 1e-6) return p;
    const step = Math.PI / 12;
    const ang = Math.round(Math.atan2(v.y, v.x) / step) * step;
    return { x: origin.x + r * Math.cos(ang), y: origin.y + r * Math.sin(ang) };
  }
  const step = mode === "integer" ? 1 : 0.5;
  return { x: Math.round(p.x / step) * step, y: Math.round(p.y / step) * step };
}

export function applyLock(tri: TrianglePts, who: "A" | "B" | "C", next: Pt, lock: LockMode): TrianglePts {
  const draft = { ...tri, [who]: next };
  if (lock === "none") return draft;
  if (lock === "isosceles") {
    const apex = tri.A;
    if (who === "C") {
      const r = dist(apex, tri.B);
      const v = sub(next, apex);
      const len = Math.hypot(v.x, v.y) || 1;
      return { ...draft, C: { x: apex.x + (v.x / len) * r, y: apex.y + (v.y / len) * r } };
    }
    if (who === "B") {
      const r = dist(apex, tri.C);
      const v = sub(next, apex);
      const len = Math.hypot(v.x, v.y) || 1;
      return { ...draft, B: { x: apex.x + (v.x / len) * r, y: apex.y + (v.y / len) * r } };
    }
  }
  if (lock === "right") {
    const B = who === "B" ? next : tri.B;
    const A = who === "A" ? next : tri.A;
    const C = who === "C" ? next : tri.C;
    const ba = sub(A, B);
    if (who === "C") {
      const len = dist(B, next) || 1;
      const n = { x: -ba.y, y: ba.x };
      const nu = Math.hypot(n.x, n.y) || 1;
      const sign = (next.x - B.x) * n.x + (next.y - B.y) * n.y >= 0 ? 1 : -1;
      return { A, B, C: { x: B.x + sign * (n.x / nu) * len, y: B.y + sign * (n.y / nu) * len } };
    }
    if (who === "A") {
      const len = dist(B, A) || 1;
      const bc = sub(C, B);
      const n = { x: -bc.y, y: bc.x };
      const nu = Math.hypot(n.x, n.y) || 1;
      const sign = (A.x - B.x) * n.x + (A.y - B.y) * n.y >= 0 ? 1 : -1;
      return { B, C, A: { x: B.x + sign * (n.x / nu) * len, y: B.y + sign * (n.y / nu) * len } };
    }
  }
  return draft;
}

export function nudgePoint(p: Pt, dx: number, dy: number) {
  return clampPoint({ x: p.x + dx, y: p.y + dy });
}

export function setSideLength(tri: TrianglePts, side: "AB" | "BC" | "CA", length: number): TrianglePts {
  if (!(length > 0.4)) return tri;
  const from = side[0] as "A" | "B" | "C";
  const to = side[1] as "A" | "B" | "C";
  const origin = tri[from];
  const tip = tri[to];
  const v = sub(tip, origin);
  const len = Math.hypot(v.x, v.y) || 1;
  const next = { ...tri, [to]: clampPoint({ x: origin.x + (v.x / len) * length, y: origin.y + (v.y / len) * length }) };
  return triangleArea(next.A, next.B, next.C) < 0.35 ? tri : next;
}

export function encodeTriangle(tri: TrianglePts) {
  const pack = (p: Pt) => `${round(p.x)},${round(p.y)}`;
  return `${pack(tri.A)};${pack(tri.B)};${pack(tri.C)}`;
}

export function parseTriangle(raw: string | null): TrianglePts | null {
  if (!raw) return null;
  const parts = raw.split(";").map((item) => item.split(",").map(Number));
  if (parts.length !== 3) return null;
  const [A, B, C] = parts;
  if (!A || !B || !C || A.length < 2 || B.length < 2 || C.length < 2) return null;
  if ([A[0], A[1], B[0], B[1], C[0], C[1]].some((n) => !Number.isFinite(n))) return null;
  const tri = { A: { x: A[0]!, y: A[1]! }, B: { x: B[0]!, y: B[1]! }, C: { x: C[0]!, y: C[1]! } };
  return triangleArea(tri.A, tri.B, tri.C) < 0.2 ? null : tri;
}

export function parseLayers(raw: string | null) {
  if (!raw) return null;
  const set = new Set(raw.split(",").filter(Boolean));
  return {
    sides: set.has("sides"),
    angles: set.has("angles"),
    arcs: set.has("arcs"),
    altitudes: set.has("altitudes"),
    median: set.has("median"),
    bisector: set.has("bisector"),
    perp: set.has("perp"),
    grid: set.has("grid"),
    coords: set.has("coords"),
  };
}

export function encodeLayers(layers: Record<string, boolean>) {
  return Object.entries(layers).filter(([, on]) => on).map(([key]) => key).join(",");
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export function parseSnap(raw: string | null): SnapMode {
  if (raw === "grid" || raw === "integer" || raw === "angle") return raw;
  return "off";
}
