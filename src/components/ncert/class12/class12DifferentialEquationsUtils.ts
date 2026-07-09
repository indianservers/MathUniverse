export type DEPreset = "growth" | "xy-separable" | "linear-exp" | "linear-x";

export function classifyDifferentialEquation(input: string) {
  const orderMatches = input.match(/d\^(\d)y|d(\d)y|dy\/dx/g);
  const order = orderMatches ? Math.max(...orderMatches.map((match) => Number(match.match(/\d/)?.[0] ?? 1))) : 0;
  const degree = /\(dy\/dx\)\^2|\(y'\)\^2/.test(input) ? 2 : order > 0 ? 1 : 0;
  return { order, degree };
}

export function differentialEquationPreset(preset: DEPreset) {
  const data: Record<DEPreset, { equation: string; type: string; solution: string; verification: string; steps: string[] }> = {
    growth: { equation: "dy/dx = ky", type: "Separable", solution: "y = C e^(kx)", verification: "y' = k C e^(kx) = ky", steps: ["Separate dy/y = k dx.", "Integrate both sides.", "ln|y| = kx + C.", "Rewrite as y = C e^(kx)."] },
    "xy-separable": { equation: "dy/dx = x/y", type: "Separable", solution: "y^2 = x^2 + C", verification: "Differentiate y^2 = x^2 + C to get dy/dx = x/y.", steps: ["Write y dy = x dx.", "Integrate both sides.", "y^2/2 = x^2/2 + C.", "Multiply by 2."] },
    "linear-exp": { equation: "dy/dx + y = e^x", type: "Linear first order", solution: "y e^x = e^(2x)/2 + C", verification: "Integrating factor is e^x.", steps: ["Identify P(x)=1.", "IF = e^x.", "Multiply both sides.", "Integrate d/dx(y e^x) = e^(2x)."] },
    "linear-x": { equation: "dy/dx + 2y = x", type: "Linear first order", solution: "y e^(2x) = integral x e^(2x) dx + C", verification: "Integrating factor is e^(2x).", steps: ["Identify P(x)=2.", "IF = e^(2x).", "Multiply the equation.", "Integrate both sides."] },
  };
  return data[preset];
}

export function applyInitialConditionForGrowth(k: number, x0: number, y0: number) {
  const c = y0 / Math.exp(k * x0);
  return { c, solution: `y = ${formatNumber(c)} e^(${formatNumber(k)}x)` };
}

function formatNumber(value: number) {
  return value.toFixed(3).replace(/\.?0+$/, "");
}
