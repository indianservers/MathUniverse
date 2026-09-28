/** Public-friendly slugs retained alongside the studio's original URLs. */
export const differentialEquationRouteAliases: Record<string, string> = {
  "equation-explorer": "explorer",
  "direction-fields": "slope-fields",
  homogeneous: "homogeneous-first-order",
  growth: "growth-models",
  oscillations: "mechanical-oscillations",
};

const preferredSlugs = Object.fromEntries(
  Object.entries(differentialEquationRouteAliases).map(([slug, id]) => [id, slug]),
);

export function differentialEquationRouteFor(id: string) {
  return id === "home" ? "/differential-equations" : `/differential-equations/${preferredSlugs[id] ?? id}`;
}
