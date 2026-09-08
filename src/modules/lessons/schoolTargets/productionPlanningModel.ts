import { regionVertices, type RegionConstraint } from "./feasibleRegionModel";

export const PRODUCTION_CONSTRAINTS: RegionConstraint[] = [
  { a: 2, b: 3, c: 18, label: "Wood", color: "#008dd2", enabled: true },
  { a: 3, b: 2, c: 18, label: "Labour", color: "#7131de", enabled: true },
  { a: -1, b: 0, c: 0, label: "Tables", color: "#334155", enabled: true },
  { a: 0, b: -1, c: 0, label: "Chairs", color: "#334155", enabled: true },
];
export function productionMix(x: number, y: number, whole = false) {
  const wood = 2 * x + 3 * y, labour = 3 * x + 2 * y;
  return { x, y, wood, labour, woodLeft: 18 - wood, labourLeft: 18 - labour, profit: 40 * x + 50 * y,
    feasible: Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && wood <= 18 + 1e-8 && labour <= 18 + 1e-8 && (!whole || Number.isInteger(x) && Number.isInteger(y)) };
}
export function productionPlanning() {
  const corners = regionVertices(PRODUCTION_CONSTRAINTS).map(([x, y]) => productionMix(x, y));
  const continuous = [...corners].sort((a, b) => b.profit - a.profit)[0];
  const integers = [];
  for (let x = 0; x <= 6; x++) for (let y = 0; y <= 6; y++) {
    const point = productionMix(x, y, true);
    if (point.feasible) integers.push(point);
  }
  const integer = [...integers].sort((a, b) => b.profit - a.profit)[0];
  return { corners, continuous, integer, integers };
}
export function productionQuantity(value: number, whole: boolean) {
  if (!Number.isFinite(value)) throw new RangeError("Quantity must be finite");
  return Math.max(0, Math.min(6, Math.round(value * (whole ? 1 : 10)) / (whole ? 1 : 10)));
}
