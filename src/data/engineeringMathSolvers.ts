export type IterationRow = {
  step: number;
  x: number;
  y?: number;
  error?: number;
};

export type RootFindingReport = {
  method: "bisection" | "newton";
  root: number;
  residual: number;
  iterations: IterationRow[];
};

export type OdeComparisonReport = {
  equation: string;
  euler: IterationRow[];
  rk4: IterationRow[];
  finalError: number;
};

export type TransformPreset = {
  signal: string;
  laplace: string;
  condition: string;
  sampleAt: number;
  value: number;
};

export type HeatGridReport = {
  alpha: number;
  stable: boolean;
  grid: number[][];
  centerValue: number;
};

export type MarkovQueueReport = {
  transition: number[][];
  afterSteps: number[];
  steadyState: number[];
  utilization: number;
  stable: boolean;
};

export type VectorFieldReport = {
  field: string;
  divergence: number;
  curlZ: number;
  fluxEstimate: number;
  circulationEstimate: number;
};

export type EngineeringSolverPreset = {
  id: string;
  domainId: string;
  title: string;
  route: string;
  summary: string;
  formula: string;
  metricLabel: string;
  metricValue: string;
};

export const engineeringSolverPresets: EngineeringSolverPreset[] = [
  {
    id: "newton-root-cubic",
    domainId: "numerical-methods",
    title: "Newton root preset",
    route: "/syllabus-lab/newton-raphson-tangent-iteration",
    summary: "Solves x^3 - x - 2 = 0 from x0 = 1.5 and records the iteration protocol.",
    formula: "x_(n+1)=x_n-f(x_n)/f'(x_n)",
    metricLabel: "root",
    metricValue: round(runNewtonPreset().root, 6).toString(),
  },
  {
    id: "bisection-bracket-cubic",
    domainId: "numerical-methods",
    title: "Bisection bracket preset",
    route: "/syllabus-lab/newton-raphson-tangent-iteration",
    summary: "Brackets the same cubic root on [1, 2] with deterministic sign checks.",
    formula: "f(a)f(b)<0",
    metricLabel: "residual",
    metricValue: round(runBisectionPreset().residual, 8).toString(),
  },
  {
    id: "euler-rk4-growth",
    domainId: "engineering-differential-equations",
    title: "Euler vs RK4 preset",
    route: "/syllabus-lab/euler-vs-rk4-solution-comparison",
    summary: "Compares y'=0.5y over one unit interval using Euler and RK4.",
    formula: "y_(n+1)=y_n+h f(x_n,y_n)",
    metricLabel: "final gap",
    metricValue: round(runOdeComparisonPreset().finalError, 6).toString(),
  },
  {
    id: "laplace-decay",
    domainId: "transforms-signals",
    title: "Laplace decay preset",
    route: "/syllabus-lab/laplace-transform-workflow",
    summary: "Evaluates L{e^(-at)}=1/(s+a) for engineering decay signals.",
    formula: "L{e^(-at)}=1/(s+a)",
    metricLabel: "F(2)",
    metricValue: round(laplaceDecayPreset(1.2, 2).value, 6).toString(),
  },
  {
    id: "heat-stability-grid",
    domainId: "partial-differential-equations",
    title: "Heat equation grid preset",
    route: "/syllabus-lab/heat-equation-color-map",
    summary: "Runs an explicit heat-equation grid with boundary values and stability check.",
    formula: "u_i^(n+1)=u_i^n+r(u_(i+1)^n-2u_i^n+u_(i-1)^n)",
    metricLabel: "center",
    metricValue: round(runHeatGridPreset().centerValue, 6).toString(),
  },
  {
    id: "markov-queue-reliability",
    domainId: "probability-statistics-stochastic",
    title: "Markov and queue preset",
    route: "/syllabus-lab/reliability-markov-queueing-lab",
    summary: "Computes a two-state transition forecast and M/M/1 utilization.",
    formula: "pi_(n+1)=pi_n P, rho=lambda/mu",
    metricLabel: "rho",
    metricValue: round(runMarkovQueuePreset().utilization, 6).toString(),
  },
  {
    id: "vector-field-div-curl",
    domainId: "vector-calculus-fields",
    title: "Vector field theorem preset",
    route: "/syllabus-lab/vector-calculus-field-theorems",
    summary: "Evaluates divergence, curl, flux estimate, and circulation estimate for a linear field.",
    formula: "div F, curl F, flux, circulation",
    metricLabel: "div/curl",
    metricValue: `${round(runVectorFieldPreset().divergence, 3)} / ${round(runVectorFieldPreset().curlZ, 3)}`,
  },
];

export function runNewtonPreset() {
  return newtonRoot((x) => x ** 3 - x - 2, (x) => 3 * x ** 2 - 1, 1.5, 6);
}

export function runBisectionPreset() {
  return bisectionRoot((x) => x ** 3 - x - 2, 1, 2, 24);
}

export function runOdeComparisonPreset() {
  return compareEulerRk4((x, y) => 0.5 * y + 0 * x, 0, 1, 1, 8, Math.exp(0.5));
}

export function runHeatGridPreset() {
  return explicitHeatStep([0, 0.3, 0.8, 1, 0.8, 0.3, 0], 0.2, 8);
}

export function runMarkovQueuePreset() {
  return markovQueueReport([[0.84, 0.16], [0.28, 0.72]], [1, 0], 8, 2.4, 3.6);
}

export function runVectorFieldPreset() {
  return vectorFieldReport({ a: 1.25, b: -0.4, c: 0.9, d: 0.35 }, 2);
}

export function newtonRoot(f: (x: number) => number, df: (x: number) => number, initial: number, steps: number): RootFindingReport {
  let x = initial;
  const iterations: IterationRow[] = [];
  for (let step = 0; step <= steps; step += 1) {
    const y = f(x);
    iterations.push({ step, x: round(x, 10), y: round(y, 10), error: Math.abs(y) });
    const derivative = df(x);
    if (Math.abs(derivative) < 1e-12 || step === steps) break;
    x -= y / derivative;
  }
  return { method: "newton", root: x, residual: Math.abs(f(x)), iterations };
}

export function bisectionRoot(f: (x: number) => number, left: number, right: number, steps: number): RootFindingReport {
  let a = left;
  let b = right;
  let fa = f(a);
  const fb = f(b);
  if (fa * fb > 0) throw new Error("Bisection requires a sign-changing bracket.");
  const iterations: IterationRow[] = [];
  for (let step = 0; step < steps; step += 1) {
    const x = (a + b) / 2;
    const y = f(x);
    iterations.push({ step, x: round(x, 10), y: round(y, 10), error: Math.abs(b - a) / 2 });
    if (Math.abs(y) < 1e-12) break;
    if (fa * y <= 0) {
      b = x;
    } else {
      a = x;
      fa = y;
    }
  }
  const root = (a + b) / 2;
  return { method: "bisection", root, residual: Math.abs(f(root)), iterations };
}

export function compareEulerRk4(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  span: number,
  steps: number,
  exactFinal: number,
): OdeComparisonReport {
  const h = span / steps;
  const euler: IterationRow[] = [{ step: 0, x: x0, y: y0 }];
  const rk4: IterationRow[] = [{ step: 0, x: x0, y: y0 }];
  for (let step = 1; step <= steps; step += 1) {
    const previousEuler = euler[step - 1];
    const nextEulerY = previousEuler.y! + h * f(previousEuler.x, previousEuler.y!);
    euler.push({ step, x: round(x0 + step * h, 10), y: round(nextEulerY, 10), error: Math.abs(exactFinal - nextEulerY) });

    const previousRk = rk4[step - 1];
    const k1 = f(previousRk.x, previousRk.y!);
    const k2 = f(previousRk.x + h / 2, previousRk.y! + h * k1 / 2);
    const k3 = f(previousRk.x + h / 2, previousRk.y! + h * k2 / 2);
    const k4 = f(previousRk.x + h, previousRk.y! + h * k3);
    const nextRkY = previousRk.y! + h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    rk4.push({ step, x: round(x0 + step * h, 10), y: round(nextRkY, 10), error: Math.abs(exactFinal - nextRkY) });
  }
  return {
    equation: "y'=0.5y",
    euler,
    rk4,
    finalError: Math.abs((euler.at(-1)?.y ?? 0) - (rk4.at(-1)?.y ?? 0)),
  };
}

export function laplaceDecayPreset(a: number, s: number): TransformPreset {
  return {
    signal: `e^(-${a}t)`,
    laplace: `1/(s+${a})`,
    condition: `s > ${-a}`,
    sampleAt: s,
    value: 1 / (s + a),
  };
}

export function explicitHeatStep(initial: number[], r: number, steps: number): HeatGridReport {
  if (r <= 0 || r > 0.5) throw new Error("Explicit heat scheme requires 0 < r <= 0.5 for this preset.");
  const grid = [initial.map((value) => round(value, 8))];
  for (let step = 0; step < steps; step += 1) {
    const previous = grid[step];
    const next = previous.map((value, index) => {
      if (index === 0 || index === previous.length - 1) return value;
      return value + r * (previous[index + 1] - 2 * value + previous[index - 1]);
    });
    grid.push(next.map((value) => round(value, 8)));
  }
  const center = Math.floor(initial.length / 2);
  return { alpha: r, stable: r <= 0.5, grid, centerValue: grid.at(-1)?.[center] ?? 0 };
}

export function markovQueueReport(transition: number[][], initial: number[], steps: number, arrivalRate: number, serviceRate: number): MarkovQueueReport {
  let state = [...initial];
  for (let step = 0; step < steps; step += 1) {
    state = multiplyVectorMatrix(state, transition);
  }
  const steady = steadyState2x2(transition);
  const utilization = arrivalRate / serviceRate;
  return {
    transition,
    afterSteps: state.map((value) => round(value, 8)),
    steadyState: steady.map((value) => round(value, 8)),
    utilization,
    stable: utilization < 1,
  };
}

export function vectorFieldReport(field: { a: number; b: number; c: number; d: number }, radius: number): VectorFieldReport {
  const divergence = field.a + field.d;
  const curlZ = field.c - field.b;
  const area = Math.PI * radius ** 2;
  const circumferenceAreaFactor = Math.PI * radius ** 2;
  return {
    field: `F=<${field.a}x+${field.b}y, ${field.c}x+${field.d}y>`,
    divergence,
    curlZ,
    fluxEstimate: divergence * area,
    circulationEstimate: curlZ * circumferenceAreaFactor,
  };
}

function multiplyVectorMatrix(vector: number[], matrix: number[][]) {
  return matrix[0].map((_, column) => vector.reduce((sum, value, row) => sum + value * matrix[row][column], 0));
}

function steadyState2x2(matrix: number[][]) {
  const p01 = matrix[0][1];
  const p10 = matrix[1][0];
  const total = p01 + p10;
  if (total === 0) return [1, 0];
  return [p10 / total, p01 / total];
}

function round(value: number, places: number) {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}
