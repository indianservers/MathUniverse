export type RootKind = "distinct" | "repeated" | "complex" | "invalid";

export type Characteristic = {
  kind: RootKind;
  discriminant: number;
  r1?: number;
  r2?: number;
  alpha?: number;
  beta?: number;
};

export function characteristic(a: number, b: number, c: number): Characteristic {
  if (!Number.isFinite(a) || Math.abs(a) < 1e-9) {
    return { kind: "invalid", discriminant: Number.NaN };
  }
  const discriminant = b * b - 4 * a * c;
  if (discriminant > 1e-8) {
    const root = Math.sqrt(discriminant);
    return { kind: "distinct", discriminant, r1: (-b + root) / (2 * a), r2: (-b - root) / (2 * a) };
  }
  if (discriminant < -1e-8) {
    return {
      kind: "complex",
      discriminant,
      alpha: -b / (2 * a),
      beta: Math.sqrt(-discriminant) / (2 * Math.abs(a)),
    };
  }
  return { kind: "repeated", discriminant: 0, r1: -b / (2 * a) };
}

export function secondOrderConstants(a: number, b: number, c: number, y0: number, v0: number) {
  const roots = characteristic(a, b, c);
  if (roots.kind === "distinct" && roots.r1 != null && roots.r2 != null) {
    const c1 = (v0 - roots.r2 * y0) / (roots.r1 - roots.r2);
    return { c1, c2: y0 - c1 };
  }
  if (roots.kind === "repeated" && roots.r1 != null) {
    return { c1: y0, c2: v0 - roots.r1 * y0 };
  }
  if (roots.kind === "complex" && roots.alpha != null && roots.beta) {
    return { c1: y0, c2: (v0 - roots.alpha * y0) / roots.beta };
  }
  return { c1: y0, c2: 0 };
}

export function homogeneousValue(a: number, b: number, c: number, y0: number, v0: number, x: number) {
  const roots = characteristic(a, b, c);
  const { c1, c2 } = secondOrderConstants(a, b, c, y0, v0);
  if (roots.kind === "distinct" && roots.r1 != null && roots.r2 != null) {
    return c1 * Math.exp(roots.r1 * x) + c2 * Math.exp(roots.r2 * x);
  }
  if (roots.kind === "repeated" && roots.r1 != null) {
    return (c1 + c2 * x) * Math.exp(roots.r1 * x);
  }
  if (roots.kind === "complex" && roots.alpha != null && roots.beta != null) {
    return Math.exp(roots.alpha * x) * (c1 * Math.cos(roots.beta * x) + c2 * Math.sin(roots.beta * x));
  }
  return Number.NaN;
}

export type UndeterminedPreset = {
  id: string;
  equation: string;
  a: number;
  b: number;
  c: number;
  forcing: string;
  resonance: boolean;
  trial: string;
  steps: string[];
  particular: (x: number) => number;
  general: string;
};

export const undeterminedPresets: UndeterminedPreset[] = [
  {
    id: "exp",
    equation: "y'' − 3y' + 2y = e^x",
    a: 1,
    b: -3,
    c: 2,
    forcing: "e^x",
    resonance: true,
    trial: "A x e^x, because r = 1 is already a simple root",
    steps: [
      "Characteristic equation r² − 3r + 2 = 0 factors as (r − 1)(r − 2) = 0.",
      "Complementary function: C₁ e^x + C₂ e^{2x}.",
      "The naive trial A e^x is already in the complementary function.",
      "Multiply by x: try y_p = A x e^x.",
      "Substitution gives −A e^x = e^x, so A = −1.",
      "Particular integral: −x e^x. General solution: C₁ e^x + C₂ e^{2x} − x e^x.",
    ],
    particular: (x) => -x * Math.exp(x),
    general: "C₁ e^x + C₂ e^{2x} − x e^x",
  },
  {
    id: "cos",
    equation: "y'' + y = cos x",
    a: 1,
    b: 0,
    c: 1,
    forcing: "cos x",
    resonance: true,
    trial: "x (A cos x + B sin x), because ±i are roots",
    steps: [
      "Characteristic equation r² + 1 = 0, so r = ± i.",
      "Complementary function: C₁ cos x + C₂ sin x.",
      "cos x is part of that family, so a constant-coefficient trial is annihilated.",
      "The corrected trial is x (A cos x + B sin x).",
      "Substitution produces y_p = (x/2) sin x.",
      "General solution: C₁ cos x + C₂ sin x + (x/2) sin x.",
    ],
    particular: (x) => (x / 2) * Math.sin(x),
    general: "C₁ cos x + C₂ sin x + (x/2) sin x",
  },
  {
    id: "poly",
    equation: "y'' − y = x²",
    a: 1,
    b: 0,
    c: -1,
    forcing: "x²",
    resonance: false,
    trial: "A x² + B x + C, because r = 0 is not a root",
    steps: [
      "Characteristic equation r² − 1 = 0, so r = ±1.",
      "Complementary function: C₁ e^x + C₂ e^{−x}.",
      "A quadratic forcing needs a quadratic trial. No extra x is required.",
      "y_p = A x² + B x + C gives 2A − (A x² + B x + C) = x².",
      "A = −1, B = 0, C = −2.",
      "Particular integral: −x² − 2.",
    ],
    particular: (x) => -x * x - 2,
    general: "C₁ e^x + C₂ e^{−x} − x² − 2",
  },
  {
    id: "sin",
    equation: "y'' + 4y = sin 2x",
    a: 1,
    b: 0,
    c: 4,
    forcing: "sin 2x",
    resonance: true,
    trial: "x (A cos 2x + B sin 2x), because ±2i are roots",
    steps: [
      "Characteristic equation r² + 4 = 0, so r = ± 2i.",
      "Complementary function: C₁ cos 2x + C₂ sin 2x.",
      "sin 2x resonates with that family.",
      "Try x (A cos 2x + B sin 2x).",
      "Substitution produces y_p = −(x/4) cos 2x.",
      "General solution: C₁ cos 2x + C₂ sin 2x − (x/4) cos 2x.",
    ],
    particular: (x) => -(x / 4) * Math.cos(2 * x),
    general: "C₁ cos 2x + C₂ sin 2x − (x/4) cos 2x",
  },
];

export function linearResidual(a: number, b: number, c: number, y: (x: number) => number, g: (x: number) => number, x: number) {
  const h = 1e-4;
  const yp = (y(x + h) - y(x - h)) / (2 * h);
  const ypp = (y(x + h) - 2 * y(x) + y(x - h)) / (h * h);
  return a * ypp + b * yp + c * y(x) - g(x);
}

export type VariationPreset = {
  id: string;
  equation: string;
  y1: string;
  y2: string;
  wronskian: string;
  steps: string[];
  y1Value: (x: number) => number;
  y2Value: (x: number) => number;
  wronskianValue: (x: number) => number;
  particular: (x: number) => number;
};

export const variationPresets: VariationPreset[] = [
  {
    id: "sec",
    equation: "y'' + y = sec x",
    y1: "cos x",
    y2: "sin x",
    wronskian: "1",
    steps: [
      "Fundamental solutions of y'' + y = 0 are y₁ = cos x and y₂ = sin x.",
      "W = y₁ y₂' − y₁' y₂ = cos² x + sin² x = 1.",
      "u₁' = −y₂ sec x / W = −tan x.",
      "u₂' = y₁ sec x / W = 1.",
      "u₁ = ln|cos x| and u₂ = x, on an interval where cos x > 0.",
      "Particular solution: y_p = cos x ln|cos x| + x sin x.",
    ],
    y1Value: Math.cos,
    y2Value: Math.sin,
    wronskianValue: () => 1,
    particular: (x) => Math.cos(x) * Math.log(Math.abs(Math.cos(x))) + x * Math.sin(x),
  },
  {
    id: "exp",
    equation: "y'' − y = e^{2x}",
    y1: "e^x",
    y2: "e^{−x}",
    wronskian: "−2",
    steps: [
      "Fundamental solutions are y₁ = e^x and y₂ = e^{−x}.",
      "W = e^x (−e^{−x}) − e^x e^{−x} = −2.",
      "u₁' = −y₂ e^{2x} / W = e^x / 2.",
      "u₂' = y₁ e^{2x} / W = −e^{3x} / 2.",
      "u₁ = e^x / 2 and u₂ = −e^{3x} / 6.",
      "Particular solution: y_p = e^{2x} / 3.",
    ],
    y1Value: (x) => Math.exp(x),
    y2Value: (x) => Math.exp(-x),
    wronskianValue: () => -2,
    particular: (x) => Math.exp(2 * x) / 3,
  },
];

export function cauchyIndicial(a: number, b: number, c: number) {
  return characteristic(a, b - a, c);
}

export function cauchyValue(a: number, b: number, c: number, c1: number, c2: number, x: number) {
  if (x <= 0) return Number.NaN;
  const roots = cauchyIndicial(a, b, c);
  const ln = Math.log(x);
  if (roots.kind === "distinct" && roots.r1 != null && roots.r2 != null) {
    return c1 * x ** roots.r1 + c2 * x ** roots.r2;
  }
  if (roots.kind === "repeated" && roots.r1 != null) {
    return (c1 + c2 * ln) * x ** roots.r1;
  }
  if (roots.kind === "complex" && roots.alpha != null && roots.beta != null) {
    return x ** roots.alpha * (c1 * Math.cos(roots.beta * ln) + c2 * Math.sin(roots.beta * ln));
  }
  return Number.NaN;
}

export type SystemClass =
  | "stable node"
  | "unstable node"
  | "saddle"
  | "stable spiral"
  | "unstable spiral"
  | "center"
  | "degenerate"
  | "repeated eigenvalue";

export type LinearSystem = {
  label: SystemClass;
  trace: number;
  determinant: number;
  discriminant: number;
  lambda1: number;
  lambda2: number;
  alpha: number;
  beta: number;
  vectors: Array<[number, number]>;
};

function unit(x: number, y: number): [number, number] {
  const length = Math.hypot(x, y);
  if (length < 1e-9) return [1, 0];
  return [x / length, y / length];
}

function eigenvector(a: number, b: number, c: number, d: number, lambda: number): [number, number] {
  const p = a - lambda;
  const q = d - lambda;
  if (Math.hypot(b, p) > 1e-7) return unit(-b, p);
  if (Math.hypot(c, q) > 1e-7) return unit(-q, c);
  return [1, 0];
}

export function classifySystem(a: number, b: number, c: number, d: number): LinearSystem {
  const trace = a + d;
  const determinant = a * d - b * c;
  const discriminant = trace * trace - 4 * determinant;
  const alpha = trace / 2;
  const root = Math.sqrt(Math.abs(discriminant));
  const lambda1 = discriminant >= 0 ? alpha + root / 2 : alpha;
  const lambda2 = discriminant >= 0 ? alpha - root / 2 : alpha;
  const beta = discriminant < 0 ? root / 2 : 0;
  const vectors = discriminant >= -1e-8
    ? [eigenvector(a, b, c, d, lambda1), eigenvector(a, b, c, d, lambda2)]
    : [];
  let label: SystemClass = "degenerate";
  if (Math.abs(determinant) < 1e-8) label = "degenerate";
  else if (discriminant > 1e-8) {
    label = lambda1 * lambda2 < 0 ? "saddle" : lambda1 < 0 && lambda2 < 0 ? "stable node" : "unstable node";
  } else if (discriminant < -1e-8) {
    label = Math.abs(alpha) < 1e-7 ? "center" : alpha < 0 ? "stable spiral" : "unstable spiral";
  } else label = "repeated eigenvalue";
  return { label, trace, determinant, discriminant, lambda1, lambda2, alpha, beta, vectors };
}

export function systemStep(a: number, b: number, c: number, d: number, x: number, y: number, h: number) {
  const field = (px: number, py: number) => [a * px + b * py, c * px + d * py] as const;
  const k1 = field(x, y);
  const k2 = field(x + (h * k1[0]) / 2, y + (h * k1[1]) / 2);
  const k3 = field(x + (h * k2[0]) / 2, y + (h * k2[1]) / 2);
  const k4 = field(x + h * k3[0], y + h * k3[1]);
  return [x + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), y + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])] as const;
}

export function trajectory(a: number, b: number, c: number, d: number, x0: number, y0: number, steps = 80, h = 0.08) {
  const forward = [{ x: x0, y: y0 }];
  const backward = [{ x: x0, y: y0 }];
  let fx = x0;
  let fy = y0;
  let bx = x0;
  let by = y0;
  for (let index = 0; index < steps; index += 1) {
    [fx, fy] = systemStep(a, b, c, d, fx, fy, h);
    [bx, by] = systemStep(a, b, c, d, bx, by, -h);
    if (![fx, fy, bx, by].every(Number.isFinite) || Math.hypot(fx, fy) > 12 || Math.hypot(bx, by) > 12) break;
    forward.push({ x: fx, y: fy });
    backward.push({ x: bx, y: by });
  }
  return [...backward.reverse(), ...forward.slice(1)];
}

export type OscillatorSample = {
  kind: "undamped" | "underdamped" | "critical" | "overdamped";
  zeta: number;
  omega: number;
  x: number;
  v: number;
};

export function oscillatorSample(m: number, c: number, k: number, x0: number, v0: number, t: number, force = 0, omegaDrive = 0): OscillatorSample {
  const mass = Math.max(m, 1e-4);
  const stiffness = Math.max(k, 1e-6);
  const omega = Math.sqrt(stiffness / mass);
  const zeta = c / (2 * Math.sqrt(mass * stiffness));
  const resonant = force !== 0 && Math.abs(zeta) < 0.02 && Math.abs(omegaDrive - omega) < 0.03 * omega;
  if (resonant) {
    const wn = omega;
    const x = x0 * Math.cos(wn * t) + (v0 / wn) * Math.sin(wn * t) + (force / (2 * mass * wn)) * t * Math.sin(wn * t);
    const v = -x0 * wn * Math.sin(wn * t) + v0 * Math.cos(wn * t) + (force / (2 * mass * wn)) * (Math.sin(wn * t) + t * wn * Math.cos(wn * t));
    return { kind: "undamped", zeta, omega, x, v };
  }
  let xp0 = 0;
  let vp0 = 0;
  let particular = (_time: number) => ({ x: 0, v: 0 });
  if (force !== 0) {
    const drive = omegaDrive;
    const delta = (omega * omega - drive * drive) ** 2 + (2 * zeta * omega * drive) ** 2;
    const amp = (force / mass) / Math.sqrt(Math.max(delta, 1e-12));
    const cosPhi = (omega * omega - drive * drive) / Math.sqrt(Math.max(delta, 1e-12));
    const sinPhi = (2 * zeta * omega * drive) / Math.sqrt(Math.max(delta, 1e-12));
    xp0 = amp * cosPhi;
    vp0 = amp * drive * sinPhi;
    particular = (time) => ({
      x: amp * Math.cos(drive * time - Math.atan2(sinPhi, cosPhi)),
      v: -amp * drive * Math.sin(drive * time - Math.atan2(sinPhi, cosPhi)),
    });
  }
  const transient = freeOscillator(mass, c, stiffness, x0 - xp0, v0 - vp0, t);
  const extra = particular(t);
  return { ...transient, x: transient.x + extra.x, v: transient.v + extra.v, zeta, omega };
}

function freeOscillator(m: number, c: number, k: number, x0: number, v0: number, t: number): OscillatorSample {
  const omega = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(m * k));
  if (zeta < 0.995) {
    const wd = omega * Math.sqrt(Math.max(0, 1 - zeta * zeta));
    const safeWd = Math.max(wd, 1e-6);
    const a0 = x0;
    const b0 = (v0 + zeta * omega * x0) / safeWd;
    const decay = Math.exp(-zeta * omega * t);
    const x = decay * (a0 * Math.cos(safeWd * t) + b0 * Math.sin(safeWd * t));
    const v = -zeta * omega * x + decay * (-a0 * safeWd * Math.sin(safeWd * t) + b0 * safeWd * Math.cos(safeWd * t));
    return { kind: Math.abs(zeta) < 0.02 ? "undamped" : "underdamped", zeta, omega, x, v };
  }
  if (zeta <= 1.005) {
    const a0 = x0;
    const b0 = v0 + omega * x0;
    const decay = Math.exp(-omega * t);
    const x = (a0 + b0 * t) * decay;
    const v = (b0 - omega * (a0 + b0 * t)) * decay;
    return { kind: "critical", zeta: 1, omega, x, v };
  }
  const spread = omega * Math.sqrt(zeta * zeta - 1);
  const r1 = -omega * zeta + spread;
  const r2 = -omega * zeta - spread;
  const c1 = (v0 - r2 * x0) / (r1 - r2);
  const c2 = x0 - c1;
  const x = c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
  const v = r1 * c1 * Math.exp(r1 * t) + r2 * c2 * Math.exp(r2 * t);
  return { kind: "overdamped", zeta, omega, x, v };
}

export function newtonTemperature(t0: number, ambient: number, k: number, t: number) {
  return ambient + (t0 - ambient) * Math.exp(-Math.max(k, 0) * t);
}

export function newtonHalfLife(k: number) {
  return k > 0 ? Math.log(2) / k : Number.POSITIVE_INFINITY;
}

export function newtonTimeTo(t0: number, ambient: number, k: number, target: number) {
  const startGap = t0 - ambient;
  const targetGap = target - ambient;
  if (k <= 0 || startGap === 0 || targetGap === 0 || startGap * targetGap < 0 || Math.abs(targetGap) >= Math.abs(startGap)) return Number.NaN;
  return Math.log(startGap / targetGap) / k;
}
