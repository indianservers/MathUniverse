import { TRIG_LAB_META } from "./trigStudioSession";

export type StudioLabMeta = {
  outcome: string;
  minutes: number;
  level: string;
  prereq?: string;
};

export const LINEAR_LAB_META: Record<string, StudioLabMeta> = {
  vectors: { outcome: "Add, scale, and explore vector operations.", minutes: 10, level: "Start here" },
  matrices: { outcome: "Work with matrices and their properties.", minutes: 10, level: "Core" },
  "row-reduction": { outcome: "Solve Ax = b and explore solution sets.", minutes: 10, level: "Core" },
  "linear-transforms": { outcome: "Visualize linear maps in 2D and 3D.", minutes: 10, level: "Core" },
  determinants: { outcome: "Compute determinants and understand scaling.", minutes: 8, level: "Next" },
  "vector-spaces": { outcome: "Explore subspaces, bases, and dimension.", minutes: 10, level: "Next" },
  eigenvectors: { outcome: "Find eigenvalues and visualize eigenvectors.", minutes: 12, level: "Next" },
  orthogonality: { outcome: "Orthogonal bases, projections, and more.", minutes: 8, level: "Next" },
  "least-squares": { outcome: "Best-fit solutions to overdetermined systems.", minutes: 10, level: "Apply" },
  playground: { outcome: "Experiment freely in 2D and 3D space.", minutes: 8, level: "Extend" },
};

export const MODEL_LAB_META: Record<string, StudioLabMeta> = {
  motion: { outcome: "Compare projectile models with and without drag.", minutes: 10, level: "Start here" },
  population: { outcome: "Watch exponential growth level off at carrying capacity.", minutes: 10, level: "Core" },
  epidemics: { outcome: "Steer an SIR outbreak with vaccination and Rₑ.", minutes: 12, level: "Core" },
  finance: { outcome: "See compound interest grow nominal vs real value.", minutes: 8, level: "Core" },
  optimization: { outcome: "Slide the objective across a feasible region.", minutes: 10, level: "Next" },
  networks: { outcome: "Find a shortest path as traffic and closures change.", minutes: 10, level: "Next" },
  regression: { outcome: "Fit a curve, read residuals, and predict a new x.", minutes: 10, level: "Next" },
  periodic: { outcome: "Match tides and seasons with a sine model.", minutes: 8, level: "Apply" },
  numerical: { outcome: "Estimate π with Monte Carlo and watch error fall.", minutes: 8, level: "Extend" },
  comparison: { outcome: "Pick the model with lower error without overfitting.", minutes: 10, level: "Apply" },
};

export const COMPLEX_LAB_META: Record<string, StudioLabMeta> = {
  "argand-plane": { outcome: "Drag z and read modulus, argument, and conjugate.", minutes: 8, level: "Start here" },
  arithmetic: { outcome: "Add and multiply complex numbers as plane geometry.", minutes: 8, level: "Core" },
  "polar-forms": { outcome: "Keep rectangular, polar, and exponential forms in sync.", minutes: 8, level: "Core" },
  rotation: { outcome: "See multiplication by w as a rotation and scale.", minutes: 8, level: "Next" },
  roots: { outcome: "Place nth roots on a regular polygon.", minutes: 10, level: "Next" },
  euler: { outcome: "Trace e^{iθ} on the circle, helix, and Taylor sum.", minutes: 10, level: "Next" },
  loci: { outcome: "Map circles and lines under Möbius and inversion.", minutes: 10, level: "Extend" },
  fractals: { outcome: "Link a Mandelbrot point to its Julia set.", minutes: 10, level: "Extend" },
  "waves-circuits": { outcome: "Read impedance and phase as a phasor in the plane.", minutes: 8, level: "Apply" },
};

export const DISCRETE_LAB_META: Record<string, StudioLabMeta> = {
  "number-sense": { outcome: "Place integers, fractions, decimals, ratios, powers, and scales on a live line.", minutes: 8, level: "Start here" },
  primes: { outcome: "Run the sieve and grow a unique factorization tree.", minutes: 10, level: "Core" },
  "modular-arithmetic": { outcome: "Hop around a clock and solve a linear congruence.", minutes: 10, level: "Core" },
  "number-patterns": { outcome: "Grow figurate numbers and read first differences.", minutes: 8, level: "Core" },
  combinatorics: { outcome: "Count arrangements and selections on a generating tree.", minutes: 10, level: "Next" },
  logic: { outcome: "Flip gates and watch the truth table highlight.", minutes: 8, level: "Next" },
  sets: { outcome: "Drag elements through union, intersection, and functions.", minutes: 8, level: "Next" },
  graphs: { outcome: "Run Dijkstra and color a network without clashes.", minutes: 10, level: "Next" },
  algorithms: { outcome: "Step MergeSort and compare complexity curves.", minutes: 10, level: "Extend" },
  cryptography: { outcome: "See RSA as modular exponentiation, not magic.", minutes: 10, level: "Apply" },
};

export const STATS_LAB_META: Record<string, StudioLabMeta> = {
  "data-explorer": { outcome: "Brush a scatter and read the selected summary.", minutes: 8, level: "Start here" },
  descriptive: { outcome: "Drag an outlier and watch mean vs median move.", minutes: 8, level: "Core" },
  "interactive-distributions": { outcome: "Shade a normal curve and read live probability.", minutes: 10, level: "Core" },
  experiments: { outcome: "Run trials until relative frequency settles.", minutes: 8, level: "Core" },
  counting: { outcome: "Toggle order and watch nPr vs nCr.", minutes: 8, level: "Next" },
  clt: { outcome: "Draw sample means until the sampling distribution is normal.", minutes: 10, level: "Next" },
  "confidence-intervals": { outcome: "Count how many intervals capture μ.", minutes: 10, level: "Next" },
  hypothesis: { outcome: "Shift H0 and watch the p-value and power change.", minutes: 10, level: "Next" },
  correlation: { outcome: "Drag a point and watch r, R², and residuals.", minutes: 10, level: "Apply" },
  anova: { outcome: "Compare between-group and within-group variation.", minutes: 10, level: "Extend" },
};

const BY_STUDIO: Record<string, Record<string, StudioLabMeta>> = {
  trigonometry: TRIG_LAB_META,
  "linear-algebra": LINEAR_LAB_META,
  modelling: MODEL_LAB_META,
  "complex-numbers": COMPLEX_LAB_META,
  discrete: DISCRETE_LAB_META,
  statistics: STATS_LAB_META,
};

export function studioLabMeta(studioId: string, labId: string): StudioLabMeta | undefined {
  return BY_STUDIO[studioId]?.[labId];
}
