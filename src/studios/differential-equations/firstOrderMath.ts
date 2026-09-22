export type Field = (x: number, y: number) => number;

export type ExplorerExample = {
  id: string;
  label: string;
  equation: string;
  order: number;
  degree: string;
  linear: "Linear" | "Nonlinear";
  kind: "Ordinary" | "Partial";
  autonomous: string;
  family: string;
  particular: string;
  known: string;
  meaning: string;
  balance: string;
  field?: Field;
};

export const explorerExamples: ExplorerExample[] = [
  {
    id: "linear-nonauto",
    label: "dy/dx = x + y",
    equation: "dy/dx = x + y",
    order: 1,
    degree: "1",
    linear: "Linear",
    kind: "Ordinary",
    autonomous: "Non-autonomous (x appears explicitly)",
    family: "y = Ce^x − x − 1",
    particular: "One C, or one point (x₀, y₀), picks one curve",
    known: "The slope at every (x, y), not yet a curve",
    meaning: "A slope rule. A solution is a curve whose tangent matches that rule.",
    balance: "Linear and non-homogeneous: the x term is not a multiple of y.",
    field: (x, y) => x + y,
  },
  {
    id: "product",
    label: "dy/dx = xy",
    equation: "dy/dx = xy",
    order: 1,
    degree: "1",
    linear: "Linear",
    kind: "Ordinary",
    autonomous: "Non-autonomous",
    family: "y = C exp(x²/2)",
    particular: "y(0) = y₀ fixes C = y₀",
    known: "Separable slope f(x)g(y)",
    meaning: "Growth rate proportional to both position x and height y.",
    balance: "Linear homogeneous: y' − x y = 0 has no forcing term. It is separable, but not homogeneous of equal degree, because f(tx, ty) = t² x y.",
    field: (x, y) => x * y,
  },
  {
    id: "second-order",
    label: "y'' + 3y' + 2y = 0",
    equation: "y'' + 3y' + 2y = 0",
    order: 2,
    degree: "1",
    linear: "Linear",
    kind: "Ordinary",
    autonomous: "Autonomous (no explicit independent variable)",
    family: "y = C₁e^(−x) + C₂e^(−2x)",
    particular: "Two initial values, y(x₀) and y'(x₀), fix C₁ and C₂",
    known: "A linear relation among y, y', and y''",
    meaning: "The second derivative is determined by y and y'. Solutions are a two-parameter family.",
    balance: "Linear and homogeneous: every term contains y or a derivative, and the right side is 0.",
  },
  {
    id: "logistic",
    label: "y' = y(1 − y)",
    equation: "y' = y(1 − y)",
    order: 1,
    degree: "1",
    linear: "Nonlinear",
    kind: "Ordinary",
    autonomous: "Autonomous",
    family: "Logistic curves between the equilibria y = 0 and y = 1",
    particular: "y(0) = y₀ selects one member, if y₀ ≠ 0",
    known: "Slope depends only on y",
    meaning: "A population that grows when small and levels off near 1.",
    balance: "Nonlinear. The y² term means it is not a linear equation, homogeneous or otherwise.",
    field: (_x, y) => y * (1 - y),
  },
  {
    id: "standard-linear",
    label: "x dy/dx + y = x²",
    equation: "x dy/dx + y = x²",
    order: 1,
    degree: "1",
    linear: "Linear",
    kind: "Ordinary",
    autonomous: "Non-autonomous",
    family: "y = x²/3 + C/x for x ≠ 0",
    particular: "One point with x₀ ≠ 0 fixes C",
    known: "Can be written y' + y/x = x",
    meaning: "A linear first-order equation. The integrating factor is x.",
    balance: "Linear and non-homogeneous once it is in standard form. The x term is the forcing.",
    field: (x, y) => (x === 0 ? Number.NaN : x - y / x),
  },
];

export type MethodId = "separable" | "homogeneous" | "exact" | "linear" | "bernoulli";

export type MethodPreset = {
  id: string;
  equation: string;
  method: MethodId;
  /** Every method that really applies. Defaults to the primary method. */
  methods?: MethodId[];
  test: string;
  rewrite: string;
  lab: string;
};

export function applicableMethods(preset: MethodPreset): MethodId[] {
  return preset.methods?.length ? preset.methods : [preset.method];
}

export const methodPresets: MethodPreset[] = [
  {
    id: "sep",
    equation: "dy/dx = x y",
    method: "separable",
    test: "The right-hand side factors as f(x) g(y) = x · y.",
    rewrite: "dy/y = x dx, provided y ≠ 0.",
    lab: "/differential-equations/separable",
  },
  {
    id: "hom",
    equation: "dy/dx = (x + y)/(x − y)",
    method: "homogeneous",
    test: "Numerator and denominator are both homogeneous of degree 1, so the slope depends only on y/x.",
    rewrite: "Set v = y/x. Then dy/dx = v + x dv/dx, and the equation becomes separable in v and x.",
    lab: "/differential-equations/homogeneous-first-order",
  },
  {
    id: "exact",
    equation: "(2x + y) dx + (x + 2y) dy = 0",
    method: "exact",
    test: "M = 2x + y, N = x + 2y. ∂M/∂y = 1 and ∂N/∂x = 1.",
    rewrite: "Because the partials match, there is F with dF = M dx + N dy, and solutions are F(x, y) = C.",
    lab: "/differential-equations/exact",
  },
  {
    id: "lin",
    equation: "dy/dx + y = x",
    method: "linear",
    test: "Already in standard form dy/dx + P(x)y = Q(x) with P = 1 and Q = x.",
    rewrite: "Integrating factor e^{∫P dx} = e^x turns the left side into d/dx(y e^x).",
    lab: "/differential-equations/linear-first-order",
  },
  {
    id: "bern",
    equation: "dy/dx + y = y²",
    method: "bernoulli",
    test: "dy/dx + P y = Q y^n with P = 1, Q = 1, n = 2. n is neither 0 nor 1.",
    rewrite: "v = y^{1−n} = 1/y produces a linear equation for v.",
    lab: "/differential-equations/bernoulli",
  },
  {
    id: "overlap",
    equation: "dy/dx = y",
    method: "separable",
    methods: ["separable", "linear"],
    test: "The slope factors as 1 · y, and the same equation is linear: dy/dx − y = 0.",
    rewrite: "Separation gives dy/y = dx. The integrating factor e^{−x} produces the same exponential family.",
    lab: "/differential-equations/separable",
  },
];

export const methodLabels: Record<MethodId, string> = {
  separable: "Separable",
  homogeneous: "Homogeneous first-order",
  exact: "Exact",
  linear: "Linear first-order",
  bernoulli: "Bernoulli",
};

export type ExactPreset = {
  id: string;
  label: string;
  m: string;
  n: string;
  my: string;
  nx: string;
  exact: boolean;
  steps: string[];
  potential?: string;
  field: (x: number, y: number) => number;
};

export const exactPresets: ExactPreset[] = [
  {
    id: "quadratic",
    label: "(2x + y) dx + (x + 2y) dy = 0",
    m: "2x + y",
    n: "x + 2y",
    my: "1",
    nx: "1",
    exact: true,
    steps: [
      "Integrate M with respect to x: F = x² + x y + g(y).",
      "Differentiate in y: ∂F/∂y = x + g'(y).",
      "Match N: x + g'(y) = x + 2y, so g'(y) = 2y.",
      "g(y) = y². Potential F = x² + x y + y².",
      "Solution family: x² + x y + y² = C.",
    ],
    potential: "x² + xy + y² = C",
    field: (x, y) => x * x + x * y + y * y,
  },
  {
    id: "not-exact",
    label: "y dx + x² dy = 0",
    m: "y",
    n: "x²",
    my: "1",
    nx: "2x",
    exact: false,
    steps: [
      "∂M/∂y = 1 and ∂N/∂x = 2x.",
      "They are not equal, so this equation is not exact.",
      "Do not build a potential function until an integrating factor is justified.",
    ],
    field: () => Number.NaN,
  },
  {
    id: "product",
    label: "(y + e^x) dx + (x) dy = 0",
    m: "y + e^x",
    n: "x",
    my: "1",
    nx: "1",
    exact: true,
    steps: [
      "Integrate M in x: F = x y + e^x + g(y).",
      "∂F/∂y = x + g'(y).",
      "Match N = x, so g'(y) = 0.",
      "Solution family: x y + e^x = C.",
    ],
    potential: "xy + e^x = C",
    field: (x, y) => x * y + Math.exp(x),
  },
];

export type LinearPreset = {
  id: string;
  label: string;
  standard: string;
  p: string;
  q: string;
  integratingFactor: string;
  steps: string[];
  solution: (x: number, c: number) => number;
  constantFromPoint: (x: number, y: number) => number;
  note: string;
};

export const linearPresets: LinearPreset[] = [
  {
    id: "yx",
    label: "y' + y = x",
    standard: "dy/dx + 1·y = x",
    p: "1",
    q: "x",
    integratingFactor: "e^{∫1 dx} = e^x",
    steps: [
      "Multiply by e^x: e^x y' + e^x y = x e^x.",
      "Left side is d/dx(y e^x).",
      "Integrate: y e^x = (x − 1) e^x + C.",
      "Solve: y = x − 1 + C e^{−x}.",
    ],
    solution: (x, c) => x - 1 + c * Math.exp(-x),
    constantFromPoint: (x, y) => (y - x + 1) * Math.exp(x),
    note: "y(0) = 1 forces C = 2.",
  },
  {
    id: "exp",
    label: "y' + 2y = e^x",
    standard: "dy/dx + 2y = e^x",
    p: "2",
    q: "e^x",
    integratingFactor: "e^{∫2 dx} = e^{2x}",
    steps: [
      "Multiply by e^{2x}: d/dx(y e^{2x}) = e^{3x}.",
      "Integrate: y e^{2x} = e^{3x}/3 + C.",
      "Solve: y = e^x/3 + C e^{−2x}.",
    ],
    solution: (x, c) => Math.exp(x) / 3 + c * Math.exp(-2 * x),
    constantFromPoint: (x, y) => (y - Math.exp(x) / 3) * Math.exp(2 * x),
    note: "The homogeneous piece decays when the coefficient of y is positive.",
  },
  {
    id: "xsq",
    label: "x y' + y = x²",
    standard: "dy/dx + y/x = x, for x > 0",
    p: "1/x",
    q: "x",
    integratingFactor: "e^{∫ dx/x} = x",
    steps: [
      "Divide by x first so the leading coefficient is 1.",
      "Multiply by x: d/dx(x y) = x².",
      "Integrate: x y = x³/3 + C.",
      "Solve: y = x²/3 + C/x.",
    ],
    solution: (x, c) => (x === 0 ? Number.NaN : (x * x) / 3 + c / x),
    constantFromPoint: (x, y) => (x === 0 ? Number.NaN : x * (y - (x * x) / 3)),
    note: "x = 0 is a singular point. Keep the initial x₀ away from 0.",
  },
  {
    id: "power",
    label: "y' − y/x = x²",
    standard: "dy/dx + (−1/x) y = x², for x > 0",
    p: "−1/x",
    q: "x²",
    integratingFactor: "e^{∫ −dx/x} = 1/x",
    steps: [
      "Multiply by 1/x: d/dx(y/x) = x.",
      "Integrate: y/x = x²/2 + C.",
      "Solve: y = x³/2 + C x.",
    ],
    solution: (x, c) => (x * x * x) / 2 + c * x,
    constantFromPoint: (x, y) => (x === 0 ? Number.NaN : y / x - (x * x) / 2),
    note: "P is not defined at x = 0.",
  },
];

export type BernoulliCase = {
  n: number;
  title: string;
  equation: string;
  steps: string[];
  solution?: (x: number, c: number) => number;
};

export const bernoulliCases: BernoulliCase[] = [
  {
    n: 0,
    title: "n = 0 is already linear",
    equation: "y' + y = 1",
    steps: [
      "y^0 = 1, so the equation is dy/dx + y = 1.",
      "No substitution is required.",
      "Integrating factor e^x gives y = 1 + C e^{−x}.",
    ],
    solution: (x, c) => 1 + c * Math.exp(-x),
  },
  {
    n: 1,
    title: "n = 1 collapses to a linear equation",
    equation: "y' + y = y",
    steps: [
      "Move the right side: y' + y − y = 0.",
      "That is y' = 0.",
      "Solutions are the constant family y = C.",
    ],
    solution: (_x, c) => c,
  },
  {
    n: 2,
    title: "n = 2 needs v = y^{1−n}",
    equation: "y' + y = y²",
    steps: [
      "P = 1, Q = 1, n = 2.",
      "Set v = y^{1−2} = 1/y, so y = 1/v and y' = −v'/v².",
      "Substitute: −v'/v² + 1/v = 1/v².",
      "Multiply by −v²: v' − v = −1.",
      "Integrating factor e^{−x}: v = 1 + C e^x.",
      "Back-substitute: y = 1/(1 + C e^x), where the denominator is not zero.",
    ],
    solution: (x, c) => 1 / (1 + c * Math.exp(x)),
  },
];

export type HomogeneousPreset = {
  id: string;
  label: string;
  field: Field;
  steps: string[];
  closedForm: string;
};

export const homogeneousPresets: HomogeneousPreset[] = [
  {
    id: "classic",
    label: "dy/dx = (x + y)/(x − y)",
    field: (x, y) => (x === y ? Number.NaN : (x + y) / (x - y)),
    steps: [
      "Numerator and denominator are both homogeneous of degree 1.",
      "Set v = y/x, so y = v x and dy/dx = v + x dv/dx.",
      "v + x dv/dx = (1 + v)/(1 − v).",
      "x dv/dx = (1 + v²)/(1 − v).",
      "Separate: (1 − v)/(1 + v²) dv = dx/x.",
      "Integrate: arctan(v) − ½ ln(1 + v²) = ln|x| + C.",
      "Back-substitute: arctan(y/x) = ln √(x² + y²) + C.",
    ],
    closedForm: "arctan(y/x) = ln √(x² + y²) + C",
  },
  {
    id: "sum-over-x",
    label: "dy/dx = (x + y)/x",
    field: (x, y) => (x === 0 ? Number.NaN : 1 + y / x),
    steps: [
      "Numerator and denominator are homogeneous of degree 1.",
      "Set v = y/x, so y = v x and dy/dx = v + x dv/dx.",
      "v + x dv/dx = 1 + v.",
      "x dv/dx = 1.",
      "Integrate: v = ln|x| + C.",
      "Back-substitute: y = x (ln|x| + C).",
    ],
    closedForm: "y = x (ln|x| + C)",
  },
  {
    id: "circles",
    label: "dy/dx = (x² + y²)/(x y)",
    field: (x, y) => (x === 0 || y === 0 ? Number.NaN : (x * x + y * y) / (x * y)),
    steps: [
      "Both numerator and denominator are homogeneous of degree 2.",
      "Set v = y/x. Then dy/dx = v + x dv/dx = (1 + v²)/v.",
      "x dv/dx = 1/v.",
      "Separate: v dv = dx/x.",
      "Integrate: v²/2 = ln|x| + C.",
      "Back-substitute: y² = x² (2 ln|x| + K).",
    ],
    closedForm: "y² = x² (2 ln|x| + K)",
  },
  {
    id: "ratio",
    label: "dy/dx = y/x",
    field: (x, y) => (x === 0 ? Number.NaN : y / x),
    steps: [
      "The slope is already a function of y/x.",
      "Set v = y/x. Then v + x dv/dx = v.",
      "x dv/dx = 0, so v is constant.",
      "Back-substitute: y = C x.",
      "Rays through the origin are the solution family, except the vertical line x = 0.",
    ],
    closedForm: "y = C x",
  },
];

export function eulerStep(f: Field, x: number, y: number, h: number) {
  return y + h * f(x, y);
}

export function heunStep(f: Field, x: number, y: number, h: number) {
  const slope = f(x, y);
  const prediction = y + h * slope;
  return y + (h / 2) * (slope + f(x + h, prediction));
}

export function rk4Step(f: Field, x: number, y: number, h: number) {
  const k1 = f(x, y);
  const k2 = f(x + h / 2, y + (h * k1) / 2);
  const k3 = f(x + h / 2, y + (h * k2) / 2);
  const k4 = f(x + h, y + h * k3);
  return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

export function exactLinear(x0: number, y0: number, x: number) {
  return x - 1 + (y0 - (x0 - 1)) * Math.exp(-(x - x0));
}

export function compareMethods(x0: number, y0: number, h: number, steps: number) {
  const f: Field = (x, y) => x - y;
  let euler = y0;
  let heun = y0;
  let rk4 = y0;
  const rows = [];
  for (let index = 0; index < steps; index += 1) {
    const x = x0 + index * h;
    euler = eulerStep(f, x, euler, h);
    heun = heunStep(f, x, heun, h);
    rk4 = rk4Step(f, x, rk4, h);
    const next = x + h;
    const truth = exactLinear(x0, y0, next);
    rows.push({
      x: next,
      euler,
      heun,
      rk4,
      exact: truth,
      eulerError: Math.abs(euler - truth),
      heunError: Math.abs(heun - truth),
      rk4Error: Math.abs(rk4 - truth),
    });
  }
  return rows;
}

export function integrateField(f: Field, x0: number, y0: number, x1: number, h = 0.05) {
  const points = [{ x: x0, y: y0 }];
  let x = x0;
  let y = y0;
  const step = x1 >= x0 ? h : -h;
  const count = Math.min(240, Math.ceil(Math.abs(x1 - x0) / h));
  for (let index = 0; index < count; index += 1) {
    const next = rk4Step(f, x, y, step);
    if (!Number.isFinite(next) || Math.abs(next) > 30) break;
    x += step;
    y = next;
    points.push({ x, y });
  }
  return points;
}

export function contourSegments(
  field: (x: number, y: number) => number,
  level: number,
  size = 24,
) {
  const min = -2.4;
  const max = 2.4;
  const at = (i: number) => min + ((max - min) * i) / size;
  const grid = Array.from({ length: size + 1 }, (_, i) =>
    Array.from({ length: size + 1 }, (_, j) => field(at(i), at(j))),
  );
  const segments: Array<[number, number, number, number]> = [];
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      const corners = [grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]];
      const edges: Array<[[number, number], [number, number], number, number]> = [
        [[at(i), at(j)], [at(i + 1), at(j)], corners[0], corners[1]],
        [[at(i + 1), at(j)], [at(i + 1), at(j + 1)], corners[1], corners[2]],
        [[at(i + 1), at(j + 1)], [at(i), at(j + 1)], corners[2], corners[3]],
        [[at(i), at(j + 1)], [at(i), at(j)], corners[3], corners[0]],
      ];
      const hits: Array<[number, number]> = [];
      edges.forEach(([a, b, left, right]) => {
        if ((left - level) * (right - level) >= 0 || left === right) return;
        const t = (level - left) / (right - left);
        hits.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      });
      if (hits.length >= 2) segments.push([hits[0][0], hits[0][1], hits[1][0], hits[1][1]]);
    }
  }
  return segments;
}
