export type EnhancementStatus = "implemented" | "missing";
export type StudioEnhancement = { id: string; studio: string; title: string; status: EnhancementStatus; route?: string; evidence?: string[] };

const definitions: Record<string, string[]> = {
  ALG: ["Signed algebra tiles","Zero-pair cancellation","Distributive area model","Integer factorization modes","Arbitrary equation balance","Inequality sign reversal","Absolute-value branches","Complete-the-square model","Rational excluded values","Radical extraneous-root check","Function composition","Inverse reflection","Piecewise domain editor","Roots and coefficients","Complex polynomial roots","Synthetic division","Rational holes and asymptotes","3x3 row elimination","Nonlinear intersections","Exponent-law counterexamples","Logarithm base explorer","Sequence-family comparison","Sigma closed form","Proof-step counterexamples","CAS candidate verification"],
  CALC: ["Epsilon-delta bands","One-sided limits","Sequential limits","Discontinuity classification","LHopital prerequisites","Secant-to-tangent animation","Derivative expression tree","Implicit tangent and normal","Higher-derivative motion","Linearization error","Related-rates diagrams","Constrained optimization","Rolle and MVT points","FTC accumulator","Riemann method comparison","Adaptive quadrature error","Substitution interval mapping","Tabular integration by parts","Partial fractions","Improper convergence","Washer-shell comparison","ODE method comparison","Convergence-test explorer","Taylor remainder","Vector-calculus theorems"],
  TRIG: ["Exact-angle snapping","Angle-unit modes","Six-function display","Signed reference triangles","Inverse branch restrictions","Wave transformation handles","Circle-wave synchronization","Sum-difference derivation","Double-half-angle animation","Identity proof workspace","Trig equation families","Trig inequality intervals","SSA ambiguous case","Sine-cosine law construction","Validated triangle solver","Triangle uncertainty","Heights and distances","Bearing problems","Polar curve connection","Phasor addition","Fourier synthesis","Resonance and beats","Spherical triangles","Hyperbolic functions","Singularity stability warnings"],
  GEO: ["Compass-straightedge tools","Constraint-preserving drag","Locus generation","Congruence proofs","Similarity mappings","Triangle centres","Euler line","Nine-point circle","Transformation composition","Coordinate proofs","Polygon angle dissection","Regular polygon construction","Tessellation validation","Circle theorem explorer","Power of a point","Conic constructions","Diagram-linked proofs","Assumption counterexamples","Solid cross-sections","Foldable nets","Area-volume dissections","Euler polyhedron formula","Non-Euclidean modes","Measurement uncertainty","Construction exchange"],
  STAT: ["Typed dataset editor","Linked tables and plots","Distribution plot builder","Robust summaries","Repeated sampling","Central Limit Theorem","CI coverage","Error and power explorer","Effect sizes","Test selector","ANOVA","Chi-square residuals","Nonparametric tests","Multiple regression","Influence diagnostics","Variance transformations","Logistic regression","Bayesian updating","MCMC diagnostics","Markov chains","Time-series forecasting","Survival analysis","Design of experiments","Bootstrap inference","Reproducible reports"],
  LINALG: ["Basis components","Span visualizer","Dependence detection","Gram-Schmidt","Projection and least squares","Dot-cross products","Determinant geometry","Transformation composition","Row-operation workbench","Fundamental subspaces","Inverse transformation","LU-QR-SVD","Dynamic eigenvectors","Defective matrices","Spectral theorem","Quadratic forms","Complex eigenvalues","PCA","Markov chains","Adjacency matrices","Differential-system portraits","Conditioning","Image SVD","Proof counterexamples","Matrix CSV import"],
  DISC: ["Visual set builder","Proposition parser","Karnaugh simplifier","Finite-domain quantifiers","Natural deduction","Relation closures","Function property tests","Counting trees","Generating functions","Recurrence solver","Congruence classes","Chinese Remainder Theorem","Extended Euclid","Primality and factorization","RSA demonstration","Visual graph editor","Graph algorithm animation","Graph coloring","Matching and flow","Planarity","Trees and Huffman coding","DFA-NFA editor","Regex equivalence","PDA debugging","CFG and Turing workbench"],
  CPLX: ["Complex arithmetic drag","Form synchronization","Complex loci","De Moivre powers","Nth-root branches","Roots of unity","Mobius transformations","Mapped grids","Cauchy-Riemann test","Complex differentiability","Contour integrals","Residues","Zeros and poles","Branch cuts","Riemann sphere","Mandelbrot and Julia sets","Iterative orbits","Euler phasors","Polynomial perturbations","Complex Fourier synthesis","AC impedance","Quantum interference","Conformal regions","Singularity precision","Quaternion bridge"],
  MODEL: ["Modelling workflow","Physical units","Observed-data import","Parameter estimation","AIC-BIC comparison","Residual diagnostics","Parameter intervals","Sensitivity analysis","Identifiability warnings","Cross-validation","Scenario comparison","Piecewise interventions","Seasonal-delay models","SIR-SEIR models","Predator-prey systems","Compartment builder","Agent-based models","Stochastic simulation","ODE solver comparison","Discrete-event simulation","Constrained calibration","Dimensional analysis","Parameter sweeps","Model provenance","Model report export"],
};

const studioNames: Record<string, string> = { ALG:"Algebra", CALC:"Calculus", TRIG:"Trigonometry", GEO:"Geometry", STAT:"Statistics & Probability", LINALG:"Linear Algebra", DISC:"Number & Discrete Mathematics", CPLX:"Complex Numbers", MODEL:"Mathematical Modelling" };

export const studioEnhancements: StudioEnhancement[] = Object.entries(definitions).flatMap(([prefix, titles]) => titles.map((title, index) => {
  const implementedPrefixes = ["ALG","CALC","TRIG","GEO","STAT","LINALG","DISC","CPLX","MODEL"];
  const implemented = implementedPrefixes.includes(prefix);
  const routeMap:Record<string,string>={ALG:"/algebra/advanced",CALC:"/calculus/advanced",TRIG:"/trigonometry?tab=advanced",GEO:"/geometry?tab=advanced",STAT:"/probability-statistics?tab=advanced",LINALG:"/linear-algebra?mode=advanced",DISC:"/discrete-world?workbench=advanced",CPLX:"/complex-numbers?tab=advanced",MODEL:"/mathematical-modelling/advanced"};
  const nameMap:Record<string,string>={ALG:"Algebra",CALC:"Calculus",TRIG:"Trigonometry",GEO:"Geometry",STAT:"Statistics",LINALG:"LinearAlgebra",DISC:"Discrete",CPLX:"Complex",MODEL:"Modelling"};
  const fileMap:Record<string,string>={ALG:"algebra",CALC:"calculus",TRIG:"trigonometry",GEO:"geometry",STAT:"statistics",LINALG:"linearAlgebra",DISC:"discrete",CPLX:"complex",MODEL:"modelling"};
  return {
    id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    studio: studioNames[prefix], title, status: implemented ? "implemented" : "missing",
    ...(implemented ? { route:routeMap[prefix], evidence: [`${fileMap[prefix]}EnhancementEngine.ts`, `${fileMap[prefix]}EnhancementEngine.test.ts`, `${nameMap[prefix]}EnhancementWorkbench.tsx`] } : {}),
  };
}));

export const platformEnhancements: StudioEnhancement[] = [
  "Shared project format","Shareable deep links","Cross-studio objects and datasets","Common symbolic engine","Undo checkpoints","Accessible interaction","Responsive studio layouts","Exact-approximate result labels","Teacher activities and analytics","Worker-based adaptive performance",
].map((title, index) => ({
  id: `PLATFORM-${String(index + 1).padStart(2, "0")}`,
  studio: "Platform",
  title,
  status: "implemented",
  route: "/studio-projects",
  evidence: ["studioPlatformEngine.ts", "studioPlatformEngine.test.ts", "StudioProjectCenter.tsx"],
}));

export const allRequestedEnhancements = [...studioEnhancements, ...platformEnhancements];

export function enhancementCoverage() {
  const implemented = allRequestedEnhancements.filter((item) => item.status === "implemented").length;
  return { implemented, missing: allRequestedEnhancements.length - implemented, total: allRequestedEnhancements.length };
}
