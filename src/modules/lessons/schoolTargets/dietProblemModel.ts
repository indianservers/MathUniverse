import { regionVertices, visibleRegion, type RegionConstraint } from "./feasibleRegionModel";

export const dietCost = (x: number, y: number) => 4 * x + 5 * y;
export function dietMix(x: number, y: number, protein = 9, calcium = 9, whole = false) {
  const suppliedProtein = 3 * x + y, suppliedCalcium = x + 3 * y;
  return { x, y, cost: dietCost(x, y), protein: suppliedProtein, calcium: suppliedCalcium,
    feasible: x >= 0 && y >= 0 && suppliedProtein >= protein - 1e-8 && suppliedCalcium >= calcium - 1e-8 && (!whole || Number.isInteger(x) && Number.isInteger(y)) };
}

export function dietProblem(protein = 9, calcium = 9, whole = false) {
  if (![protein, calcium].every(n => Number.isFinite(n) && n >= 0 && n <= 30)) throw new RangeError("Requirements must be between 0 and 30");
  const make = (a: number, b: number, c: number, label: string, color: string): RegionConstraint => ({ a, b, c, label, color, enabled: true });
  const constraints = [make(-3, -1, -protein, `3x + y ≥ ${protein}`, "#168ce4"), make(-1, -3, -calcium, `x + 3y ≥ ${calcium}`, "#fa8519"), make(-1, 0, 0, "x ≥ 0", "#334155"), make(0, -1, 0, "y ≥ 0", "#334155")];
  const vertices = regionVertices(constraints);
  const continuous = vertices.map(([x, y]) => dietMix(x, y, protein, calcium)).sort((a, b) => a.cost - b.cost)[0];
  // Each nutrient contributes at least one unit per serving, so this feasible bound
  // limits enumeration without excluding a cheaper nonnegative integer solution.
  const bound = Math.ceil(Math.max(protein, calcium));
  const integers = [];
  for (let x = 0; x <= bound; x++) for (let y = 0; y <= bound; y++) {
    const mix = dietMix(x, y, protein, calcium, true);
    if (mix.feasible) integers.push(mix);
  }
  integers.sort((a, b) => a.cost - b.cost || a.x - b.x);
  const optimum = whole ? integers[0] : continuous;
  const extent = Math.max(14, Math.ceil(Math.max(protein, calcium) / 2) * 2);
  return { constraints, vertices, continuous, optimum, integers, extent,
    polygon: visibleRegion(constraints, { left: 0, right: extent, bottom: 0, top: extent }) };
}

export function servingValue(value: number, whole: boolean, max: number) {
  return Math.max(0, Math.min(max, whole ? Math.round(value) : Math.round(value * 4) / 4));
}
