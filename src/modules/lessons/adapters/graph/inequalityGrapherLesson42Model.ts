export type ShadeDirection = "below" | "none" | "above";
export type InequalityRule = {
  id: "a" | "b";
  slope: number;
  intercept: number;
  inclusive: boolean;
  shade: ShadeDirection;
  color: string;
};

export const DEFAULT_INEQUALITY_RULES: InequalityRule[] = [
  {
    id: "a",
    slope: 0.8,
    intercept: 1,
    inclusive: true,
    shade: "below",
    color: "#168bd5",
  },
  {
    id: "b",
    slope: -0.5,
    intercept: 2,
    inclusive: false,
    shade: "above",
    color: "#7c3aed",
  },
];

export const inequalityBoundary = (rule: InequalityRule, x: number) =>
  rule.slope * x + rule.intercept;

export function inequalityLabel(rule: InequalityRule) {
  const relation =
    rule.shade === "below"
      ? rule.inclusive
        ? "≤"
        : "<"
      : rule.shade === "above"
        ? rule.inclusive
          ? "≥"
          : ">"
        : "=";
  const slope = `${rule.slope}`;
  const intercept =
    rule.intercept < 0
      ? ` − ${Math.abs(rule.intercept)}`
      : ` + ${rule.intercept}`;
  return `y ${relation} ${slope}x${intercept}`;
}

export function inequalityPointResult(
  rule: InequalityRule,
  x: number,
  y: number,
) {
  const rhs = inequalityBoundary(rule, x);
  const epsilon = 0.000001;
  const satisfies =
    rule.shade === "none"
      ? Math.abs(y - rhs) < epsilon
      : rule.shade === "below"
        ? rule.inclusive
          ? y <= rhs + epsilon
          : y < rhs - epsilon
        : rule.inclusive
          ? y >= rhs - epsilon
          : y > rhs + epsilon;
  return { lhs: y, rhs, satisfies };
}

export function inequalitySystemResult(
  rules: InequalityRule[],
  x: number,
  y: number,
) {
  const results = rules.map((rule) => ({
    rule,
    ...inequalityPointResult(rule, x, y),
  }));
  return { results, satisfies: results.every((result) => result.satisfies) };
}

const graphX = (x: number) => 360 + x * 44;
const graphY = (y: number) => 315 - y * 44;

export function inequalityRegionPolygon(rule: InequalityRule) {
  const leftY = graphY(inequalityBoundary(rule, -7));
  const rightY = graphY(inequalityBoundary(rule, 7));
  if (rule.shade === "below") return `52,${leftY} 668,${rightY} 668,620 52,620`;
  if (rule.shade === "above") return `52,${leftY} 668,${rightY} 668,8 52,8`;
  return "";
}

export const inequalityLinePoints = (rule: InequalityRule) =>
  `52,${graphY(inequalityBoundary(rule, -7))} 668,${graphY(inequalityBoundary(rule, 7))}`;

export const inequalityGraphPosition = (x: number, y: number) => ({
  x: graphX(x),
  y: graphY(y),
});
export const inequalityPointFromPixels = (pixelX: number, pixelY: number) => ({
  x: Math.max(-7, Math.min(7, Math.round(((pixelX - 360) / 44) * 2) / 2)),
  y: Math.max(-7, Math.min(7, Math.round(((315 - pixelY) / 44) * 2) / 2)),
});
