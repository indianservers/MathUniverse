export const PROPORTIONAL_FORMULA_IDS = [
  "equivalent-ratios", "cross-multiplication", "missing-fourth-term", "representative-fraction",
  "actual-distance-map-scale", "map-distance-actual-scale", "multi-term-ratio-share",
  "ratio-to-percentage", "ratio-to-pie-angle", "direct-proportion", "inverse-proportion", "constant-check",
] as const;

export type ProportionalVisualMode = (typeof PROPORTIONAL_FORMULA_IDS)[number];

export function getProportionalVisualMode(formulaId: string): ProportionalVisualMode | null {
  return PROPORTIONAL_FORMULA_IDS.find((id) => id === formulaId) ?? null;
}
