export type UnitId = "mm" | "cm" | "m" | "in";

export const UNITS: Array<{ id: UnitId; label: string; toCm: number }> = [
  { id: "mm", label: "mm", toCm: 0.1 },
  { id: "cm", label: "cm", toCm: 1 },
  { id: "m", label: "m", toCm: 100 },
  { id: "in", label: "in", toCm: 2.54 },
];

export type AaRect = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
};

export function defaultRects(): AaRect[] {
  return [
    { id: "r1", label: "1", x: 2, y: 1.8, w: 8.2, h: 6.8, fill: "#cfe8fb", stroke: "#3b82f6" },
    { id: "r2", label: "2", x: 10.2, y: 1.8, w: 6, h: 4.1, fill: "#e4d4f4", stroke: "#8b5cf6" },
    { id: "r3", label: "3", x: 2, y: 8.6, w: 6.4, h: 4.6, fill: "#dde8b8", stroke: "#84cc16" },
    { id: "r4", label: "4", x: 10.2, y: 5.9, w: 10.4, h: 7.3, fill: "#f3dfb3", stroke: "#f59e0b" },
  ];
}

export function rectArea(r: AaRect) {
  return Math.max(0, r.w) * Math.max(0, r.h);
}

export function rectPerimeter(r: AaRect) {
  return 2 * (Math.max(0, r.w) + Math.max(0, r.h));
}

export function unionArea(rects: AaRect[]) {
  const visible = rects.filter((r) => r.w > 1e-9 && r.h > 1e-9);
  if (!visible.length) return 0;
  const xs = [...new Set(visible.flatMap((r) => [r.x, r.x + r.w]))].sort((a, b) => a - b);
  const ys = [...new Set(visible.flatMap((r) => [r.y, r.y + r.h]))].sort((a, b) => a - b);
  let area = 0;
  for (let i = 0; i < xs.length - 1; i += 1) {
    for (let j = 0; j < ys.length - 1; j += 1) {
      const cx = (xs[i]! + xs[i + 1]!) / 2;
      const cy = (ys[j]! + ys[j + 1]!) / 2;
      if (visible.some((r) => cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h)) {
        area += (xs[i + 1]! - xs[i]!) * (ys[j + 1]! - ys[j]!);
      }
    }
  }
  return area;
}

type Edge = { x1: number; y1: number; x2: number; y2: number };

function rectEdges(r: AaRect): Edge[] {
  const x2 = r.x + r.w;
  const y2 = r.y + r.h;
  return [
    { x1: r.x, y1: r.y, x2, y2: r.y },
    { x1: x2, y1: r.y, x2, y2 },
    { x1: x2, y1: y2, x2: r.x, y2 },
    { x1: r.x, y1: y2, x2: r.x, y2: r.y },
  ];
}

function covered(edge: Edge, rects: AaRect[], owner: string) {
  const mx = (edge.x1 + edge.x2) / 2;
  const my = (edge.y1 + edge.y2) / 2;
  const nx = edge.y1 === edge.y2 ? 0 : 1;
  const ny = edge.x1 === edge.x2 ? 0 : 1;
  const probe = { x: mx + nx * 0.001, y: my + ny * 0.001 };
  const probe2 = { x: mx - nx * 0.001, y: my - ny * 0.001 };
  const inside = (p: { x: number; y: number }) =>
    rects.some((r) => r.id !== owner && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h);
  return inside(probe) || inside(probe2);
}

export function unionPerimeter(rects: AaRect[]) {
  const visible = rects.filter((r) => r.w > 1e-9 && r.h > 1e-9);
  let length = 0;
  for (const r of visible) {
    for (const edge of rectEdges(r)) {
      if (!covered(edge, visible, r.id)) length += Math.hypot(edge.x2 - edge.x1, edge.y2 - edge.y1);
    }
  }
  return length;
}

export function convertFromCm(cm: number, unit: UnitId) {
  const factor = UNITS.find((item) => item.id === unit)?.toCm ?? 1;
  return cm / factor;
}

export function convertAreaFromCm2(cm2: number, unit: UnitId) {
  const linear = convertFromCm(1, unit);
  return cm2 * linear * linear;
}

export function roundTo(n: number, precision: number) {
  if (!Number.isFinite(n)) return 0;
  const digits = Math.max(0, Math.round(-Math.log10(precision)));
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function fmt(n: number, precision: number) {
  return roundTo(n, precision).toFixed(Math.max(0, Math.round(-Math.log10(precision))));
}

export function scaleRects(rects: AaRect[], k: number, origin = { x: 2, y: 1.8 }): AaRect[] {
  return rects.map((r) => ({
    ...r,
    x: origin.x + (r.x - origin.x) * k,
    y: origin.y + (r.y - origin.y) * k,
    w: r.w * k,
    h: r.h * k,
  }));
}

export function hitRect(rects: AaRect[], x: number, y: number) {
  return [...rects].reverse().find((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
}

export type Handle = { id: string; rectId: string; corner: "se" | "ne" | "sw" | "nw"; x: number; y: number };

export function handlesFor(rects: AaRect[]): Handle[] {
  return rects.flatMap((r) => [
    { id: `${r.id}-nw`, rectId: r.id, corner: "nw" as const, x: r.x, y: r.y },
    { id: `${r.id}-ne`, rectId: r.id, corner: "ne" as const, x: r.x + r.w, y: r.y },
    { id: `${r.id}-sw`, rectId: r.id, corner: "sw" as const, x: r.x, y: r.y + r.h },
    { id: `${r.id}-se`, rectId: r.id, corner: "se" as const, x: r.x + r.w, y: r.y + r.h },
  ]);
}

export function resizeRect(r: AaRect, corner: Handle["corner"], x: number, y: number, snap: number): AaRect {
  const nx = snap > 0 ? Math.round(x / snap) * snap : x;
  const ny = snap > 0 ? Math.round(y / snap) * snap : y;
  let { x: rx, y: ry, w, h } = r;
  if (corner === "se") {
    w = Math.max(0.4, nx - rx);
    h = Math.max(0.4, ny - ry);
  } else if (corner === "ne") {
    w = Math.max(0.4, nx - rx);
    const bottom = ry + h;
    ry = Math.min(ny, bottom - 0.4);
    h = bottom - ry;
  } else if (corner === "sw") {
    const right = rx + w;
    rx = Math.min(nx, right - 0.4);
    w = right - rx;
    h = Math.max(0.4, ny - ry);
  } else {
    const right = rx + w;
    const bottom = ry + h;
    rx = Math.min(nx, right - 0.4);
    ry = Math.min(ny, bottom - 0.4);
    w = right - rx;
    h = bottom - ry;
  }
  return { ...r, x: rx, y: ry, w, h };
}

export function areaUncertainty(area: number, perimeter: number, precision: number) {
  return 0.5 * perimeter * precision;
}

export function relativeError(value: number, absErr: number) {
  if (Math.abs(value) < 1e-12) return 0;
  return (100 * absErr) / value;
}
