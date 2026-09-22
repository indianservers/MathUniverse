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
  "cayley-hamilton": { outcome: "Substitute a matrix into its characteristic polynomial.", minutes: 12, level: "Next" },
  diagonalization: { outcome: "Build P and D when an eigenbasis exists.", minutes: 12, level: "Next" },
  "quadratic-forms": { outcome: "Classify a symmetric form and read its level curves.", minutes: 10, level: "Apply" },
  "principal-axes": { outcome: "Rotate a conic onto orthonormal axes.", minutes: 10, level: "Apply" },
  "matrix-factorizations": { outcome: "Factor a matrix with LU, QR, or SVD.", minutes: 12, level: "Apply" },
  similarity: { outcome: "Change basis and keep the invariants.", minutes: 8, level: "Next" },
  "jordan-form": { outcome: "See a Jordan block when an eigenvector is missing.", minutes: 10, level: "Extend" },
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

export const DE_LAB_META: Record<string, StudioLabMeta> = {
  explorer: { outcome: "Classify order, linearity, and what a solution means.", minutes: 8, level: "Start here" },
  "slope-fields": { outcome: "Read a family of curves from local slopes.", minutes: 10, level: "Core" },
  "initial-value": { outcome: "Use one point to select a solution.", minutes: 8, level: "Core" },
  separable: { outcome: "Separate variables and integrate both sides.", minutes: 10, level: "Core" },
  "homogeneous-first-order": { outcome: "Reduce a scale-invariant equation with y = vx.", minutes: 12, level: "Next" },
  exact: { outcome: "Test exactness and draw potential contours.", minutes: 12, level: "Next" },
  "linear-first-order": { outcome: "Build an integrating factor and solve for y.", minutes: 12, level: "Next" },
  bernoulli: { outcome: "Transform y^n into a linear equation.", minutes: 10, level: "Next" },
  "method-selector": { outcome: "Match a first-order equation to a method.", minutes: 10, level: "Apply" },
  euler: { outcome: "Step along tangents and watch the error.", minutes: 8, level: "Core" },
  heun: { outcome: "Average a predicted slope with the starting slope.", minutes: 8, level: "Next" },
  rk4: { outcome: "Compare four-slope steps with Euler.", minutes: 8, level: "Next" },
  "growth-models": { outcome: "See exponential growth level off.", minutes: 8, level: "Apply" },
  "higher-order-linear": { outcome: "Classify roots and the matching solution family.", minutes: 12, level: "Next" },
  "undetermined-coefficients": { outcome: "Choose a trial and correct it for resonance.", minutes: 12, level: "Next" },
  "variation-of-parameters": { outcome: "Use the Wronskian to build a particular solution.", minutes: 12, level: "Next" },
  "cauchy-euler": { outcome: "Solve the indicial equation for x^m.", minutes: 12, level: "Next" },
  systems: { outcome: "Classify the origin from eigenvalues.", minutes: 12, level: "Apply" },
  "phase-plane": { outcome: "Click an initial condition on the vector field.", minutes: 10, level: "Apply" },
  "mechanical-oscillations": { outcome: "Compare damping ratios on a spring.", minutes: 10, level: "Apply" },
  "lcr-circuit": { outcome: "Match a series circuit to the spring equation.", minutes: 10, level: "Apply" },
  "newton-cooling": { outcome: "Watch a temperature gap decay.", minutes: 8, level: "Apply" },
};

const BY_STUDIO: Record<string, Record<string, StudioLabMeta>> = {
  trigonometry: TRIG_LAB_META,
  "linear-algebra": LINEAR_LAB_META,
  "differential-equations": DE_LAB_META,
  modelling: MODEL_LAB_META,
  "complex-numbers": COMPLEX_LAB_META,
  discrete: DISCRETE_LAB_META,
  statistics: STATS_LAB_META,
};

export function studioLabMeta(studioId: string, labId: string): StudioLabMeta | undefined {
  return BY_STUDIO[studioId]?.[labId];
}
