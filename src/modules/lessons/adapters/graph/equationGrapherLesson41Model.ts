export type EquationId = "ellipse" | "line" | "circle";
export type EquationDefinition = {
  id: EquationId;
  label: string;
  description: string;
  color: string;
  dashed?: boolean;
  residual: (x: number, y: number) => number;
};

export const EQUATION_41_DEFINITIONS: EquationDefinition[] = [
  {
    id: "ellipse",
    label: "x²/9 + y²/4 = 1",
    description: "Ellipse (solution set)",
    color: "#08a0b8",
    residual: (x, y) => (x * x) / 9 + (y * y) / 4 - 1,
  },
  {
    id: "line",
    label: "y = 0.5x + 1",
    description: "Line (solution set)",
    color: "#7c3aed",
    residual: (x, y) => y - (0.5 * x + 1),
  },
  {
    id: "circle",
    label: "x² + y² = 9",
    description: "Circle (comparison)",
    color: "#4388f5",
    dashed: true,
    residual: (x, y) => x * x + y * y - 9,
  },
];

export const clampEquationPoint = (value: number, snap = false) => {
  const bounded = Math.max(-6, Math.min(6, Number.isFinite(value) ? value : 0));
  return snap ? Math.round(bounded * 2) / 2 : Math.round(bounded * 100) / 100;
};

export function equationPointAnalysis(x: number, y: number) {
  return EQUATION_41_DEFINITIONS.map((equation) => {
    const residual = equation.residual(x, y);
    return {
      ...equation,
      residual,
      satisfies: Math.abs(residual) < 0.001,
      leftValue:
        equation.id === "ellipse"
          ? (x * x) / 9 + (y * y) / 4
          : equation.id === "line"
            ? y
            : x * x + y * y,
      rightValue:
        equation.id === "line"
          ? 0.5 * x + 1
          : equation.id === "ellipse"
            ? 1
            : 9,
    };
  });
}

const graphX = (x: number) => 360 + x * 45;
const graphY = (y: number) => 300 - y * 45;

export function equationCurvePath(id: EquationId) {
  const points: string[] = [];
  if (id === "line") {
    for (let x = -6.5; x <= 6.5; x += 0.05)
      points.push(`${graphX(x)},${graphY(0.5 * x + 1)}`);
  } else {
    for (let degree = 0; degree <= 360; degree += 1) {
      const radians = (degree * Math.PI) / 180;
      const radiusX = 3;
      const radiusY = id === "ellipse" ? 2 : 3;
      points.push(
        `${graphX(radiusX * Math.cos(radians))},${graphY(radiusY * Math.sin(radians))}`,
      );
    }
  }
  return points.join(" ");
}

export function equationIntersections() {
  const ellipseLine = [-2, 2].map((x) => ({
    x,
    y: 0.5 * x + 1,
    pair: "Ellipse & line",
  }));
  const ellipseCircle = [-3, 3].map((x) => ({
    x,
    y: 0,
    pair: "Ellipse & circle",
  }));
  const roots = [(-1 + Math.sqrt(33)) / 2, (-1 - Math.sqrt(33)) / 2];
  const lineCircle = roots.map((x) => ({
    x,
    y: 0.5 * x + 1,
    pair: "Line & circle",
  }));
  return [...ellipseLine, ...ellipseCircle, ...lineCircle];
}

export const equationGraphPosition = (x: number, y: number) => ({
  x: graphX(x),
  y: graphY(y),
});
export const equationPointFromPixels = (
  pixelX: number,
  pixelY: number,
  snap: boolean,
) => ({
  x: clampEquationPoint((pixelX - 360) / 45, snap),
  y: clampEquationPoint((300 - pixelY) / 45, snap),
});
