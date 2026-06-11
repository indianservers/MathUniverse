import { allSyllabusTopics, type SyllabusTopic } from "./syllabus";
import { syllabusUnitConcepts } from "./syllabusUnitConcepts";
import { topics, type Topic } from "./topics";

export type UpgradePriority = "High" | "Medium" | "Low";

export type UnitUpgradeTarget = {
  id: string;
  title: string;
  unit: string;
  level: string;
  route: string;
  priority: UpgradePriority;
  modifications: string[];
  upgrades: string[];
  qualityTargets: string[];
};

export type UnitUpgradeSummary = {
  total: number;
  highPriority: number;
  nativeRoutes: number;
  unitCount: number;
};

type UpgradeRule = Omit<UnitUpgradeTarget, "id" | "title" | "level" | "route">;

const fallbackRule: UpgradeRule = {
  unit: "General Mathematics",
  priority: "Medium",
  modifications: ["Add direct workspace launch links", "Expose formula, example, and visual proof sections together"],
  upgrades: ["Add guided tasks with auto-checked answers", "Add persistent progress and revision prompts"],
  qualityTargets: ["Every unit opens a native route", "Each lab has at least one deterministic smoke test"],
};

const unitRules: Record<string, UpgradeRule> = {
  "Advanced Mathematics": {
    unit: "Advanced Mathematics",
    priority: "High",
    modifications: ["Unify logic, sets, modelling, optimization, and abstract algebra under launchable labs", "Add concept dependency links back to prerequisite algebra and functions"],
    upgrades: ["Interactive theorem/proof cards", "Symbolic plus visual examples for higher-level structures"],
    qualityTargets: ["No future-only unit without a concept card", "Advanced modules keep native navigation and keyboard-accessible controls"],
  },
  Algebra: {
    unit: "Algebra",
    priority: "High",
    modifications: ["Expand CAS coverage beyond selected factor/expand examples", "Add inequality, systems, sequence, and polynomial workflows"],
    upgrades: ["Step-by-step algebra engine with graph verification", "Expression tiles connected to symbolic transformations"],
    qualityTargets: ["Parser covers linear, quadratic, polynomial, radical, and rational expressions", "Every algebra task has graph or table validation"],
  },
  Arithmetic: {
    unit: "Arithmetic",
    priority: "Medium",
    modifications: ["Merge percentage, ratio, profit-loss, tax, discount, and interest controls into compact scenario panels", "Add reversible worked examples"],
    upgrades: ["Story-problem generator with unit-aware checks", "Comparison charts for simple and compound growth"],
    qualityTargets: ["Inputs stay visible on mobile", "All formulas show substitutions before final answers"],
  },
  Calculus: {
    unit: "Calculus",
    priority: "High",
    modifications: ["Connect limits, derivatives, integrals, and differential equations to a shared function parser", "Add discontinuity and piecewise sampling guards"],
    upgrades: ["Numeric-symbolic agreement checks", "Slope-field and area accumulation workspaces"],
    qualityTargets: ["Implicit, parametric, polar, and piecewise functions render without crashes", "Large samples stay responsive under interaction"],
  },
  Combinatorics: {
    unit: "Combinatorics",
    priority: "Medium",
    modifications: ["Add counting-tree presets for arrangements, selections, and inclusion-exclusion", "Show formula substitutions beside visual slots"],
    upgrades: ["Binomial theorem explorer with Pascal links", "Randomized counting practice with explanation feedback"],
    qualityTargets: ["nPr/nCr edge cases are tested", "Large counts use exact integer formatting"],
  },
  "Coordinate Geometry": {
    unit: "Coordinate Geometry",
    priority: "High",
    modifications: ["Add draggable labeled point, line, distance, midpoint, and section-formula workflows", "Connect coordinate objects to the shared dependency engine"],
    upgrades: ["Conic overlays with focus/directrix handles", "Trace and measurement protocol for coordinate constructions"],
    qualityTargets: ["Dragging updates dependent labels exactly", "No object is created before the required click sequence completes"],
  },
  "Complex Analysis": {
    unit: "Complex Analysis",
    priority: "High",
    modifications: ["Connect complex-plane, analytic-function, contour, Cauchy-formula, and residue labs into one engineering path", "Add branch-cut and singularity labels to complex object metadata"],
    upgrades: ["Residue theorem and contour-deformation workflow", "Domain-coloring export for analytic function comparisons"],
    qualityTargets: ["Complex routes open native labs", "Branch and contour parameters are preserved in imports and lesson links"],
  },
  "Discrete Mathematics": {
    unit: "Discrete Mathematics",
    priority: "High",
    modifications: ["Align logic, sets, relations, recurrence, Boolean algebra, and automata under the discrete workspace", "Add CSE-focused prerequisite links from counting to graph theory"],
    upgrades: ["Recurrence solver and finite-state-machine minimization", "Truth-table to Boolean simplification bridge"],
    qualityTargets: ["Every discrete module has a launchable native route", "Large truth tables and graph traces remain responsive"],
  },
  "Engineering Calculus": {
    unit: "Engineering Calculus",
    priority: "High",
    modifications: ["Add M1 coverage for curve tracing, convergence tests, partial derivatives, Jacobians, multiple integrals, and Beta/Gamma functions", "Group multivariable sliders into compact engineering panels"],
    upgrades: ["Engineering problem presets for maxima-minima, change of variables, and special integrals", "3D surface and contour views sharing one sampler"],
    qualityTargets: ["M1 topics map to native labs when available", "Future-only calculus concepts show clear build targets"],
  },
  "Engineering Differential Equations": {
    unit: "Engineering Differential Equations",
    priority: "High",
    modifications: ["Add first-order, higher-order, Cauchy-Euler, IVP, and physical-system ODE targets", "Connect ODE labs to slope fields, transforms, and numerical solvers"],
    upgrades: ["Method selector for separable, linear, exact, homogeneous, and higher-order ODEs", "Initial-condition protocol with solution replay"],
    qualityTargets: ["ODE routes remain native", "Solution curves, symbolic forms, and numerical approximations stay synchronized"],
  },
  "Engineering Linear Algebra": {
    unit: "Engineering Linear Algebra",
    priority: "High",
    modifications: ["Add Cayley-Hamilton, diagonalization, eigenbasis, rank, and system-solving targets", "Connect matrices, vectors, transforms, and numerical linear solvers"],
    upgrades: ["Engineering matrix protocol with row operations, characteristic equation, and decomposition steps", "PCA and least-squares bridge for AI/ML users"],
    qualityTargets: ["Matrix operations expose exact and decimal modes", "Dependent eigen/vector views update without stale state"],
  },
  "Engineering Probability and Statistics": {
    unit: "Engineering Probability and Statistics",
    priority: "High",
    modifications: ["Add random variables, distributions, expectation, variance, sampling, regression, and inference coverage", "Route all probability/statistics topics to native dashboards"],
    upgrades: ["Seeded simulations for engineering reliability and ML evaluation", "Spreadsheet-backed regression and hypothesis-test workflows"],
    qualityTargets: ["No engineering stats topic uses an external redirect", "Large datasets remain responsive in chart/table views"],
  },
  "Special Functions": {
    unit: "Special Functions",
    priority: "High",
    modifications: ["Add power-series solutions, Frobenius method, Bessel functions, Legendre polynomials, and orthogonality targets", "Bridge special functions to PDE boundary-value problems and Fourier modes"],
    upgrades: ["Series-solution lab with recurrence coefficients", "Boundary-condition presets for Bessel and Legendre engineering examples"],
    qualityTargets: ["Special-function routes stay native", "Series coefficients and approximation curves remain synchronized"],
  },
  "Stochastic Processes": {
    unit: "Stochastic Processes",
    priority: "High",
    modifications: ["Add Markov chains, Poisson processes, queueing models, reliability, and time-series coverage", "Connect stochastic models to probability distributions and engineering simulations"],
    upgrades: ["Transition-matrix and queue-state visual workflows", "Seeded process simulation with exportable sample paths"],
    qualityTargets: ["Stochastic simulations are reproducible", "Probability and process routes remain native"],
  },
  "Control Systems Mathematics": {
    unit: "Control Systems Mathematics",
    priority: "Medium",
    modifications: ["Add transfer functions, poles, zeros, stability, impulse/step response, and frequency-response coverage", "Connect control examples to Laplace, Fourier, and differential-equation labs"],
    upgrades: ["Pole-zero and response comparison panel", "Control presets for circuits, mechanical systems, and feedback loops"],
    qualityTargets: ["Control-system math opens native transform labs", "Pole movement updates response readouts deterministically"],
  },
  Geometry: {
    unit: "Geometry",
    priority: "High",
    modifications: ["Audit all construction tools for GeoGebra-style staged clicks", "Add labels, captions, style, conditional visibility, dynamic color, and layers to objects"],
    upgrades: ["Real constraint kernel for points, lines, circles, polygons, transforms, and measurements", "Construction protocol parity with replay and step inspection"],
    qualityTargets: ["Line, ray, segment, vector, circle, and polygon tools require the correct number of clicks", "Dependencies survive undo, import, export, and replay"],
  },
  "Graph Theory": {
    unit: "Graph Theory",
    priority: "High",
    modifications: ["Add graph representation, traversal, shortest path, spanning tree, topological sort, and coloring targets", "Connect graph algorithms to the discrete and engineering syllabus paths"],
    upgrades: ["Algorithm timeline with adjacency-list/matrix sync", "Weighted graph benchmarks for large constructions"],
    qualityTargets: ["Graph routes open native labs", "Traversal and shortest-path outputs are deterministic"],
  },
  "Linear Algebra": {
    unit: "Linear Algebra",
    priority: "High",
    modifications: ["Unify vector, matrix, transform, eigen, rank, inverse, and system solvers under one algebra object model", "Compact repeated component sliders into grouped controls"],
    upgrades: ["Rank/nullity, basis, span, Gram-Schmidt, and projection workspaces", "Matrix-to-geometry links for transformations and eigenvectors"],
    qualityTargets: ["2D and 3D vector controls share the same dependency model", "Large matrices show stable performance and validation states"],
  },
  "Machine Learning Mathematics": {
    unit: "Machine Learning Mathematics",
    priority: "Medium",
    modifications: ["Connect vectors, gradients, probability, regression, loss surfaces, and neural-network formulas", "Add ML-ready examples to calculus and linear algebra labs"],
    upgrades: ["End-to-end gradient descent and regression notebook", "Concept graph from prerequisites to ML applications"],
    qualityTargets: ["ML examples state their underlying math unit", "Interactive loss surfaces render on desktop and mobile"],
  },
  "Numerical Methods": {
    unit: "Numerical Methods",
    priority: "High",
    modifications: ["Add root finding, interpolation, curve fitting, numerical integration, linear solvers, and ODE solver coverage", "Standardize error and convergence displays across methods"],
    upgrades: ["Comparison mode for bisection, Newton, secant, fixed-point, Euler, and RK4", "Tabular export of iterations and error sequences"],
    qualityTargets: ["Iteration counts are deterministic", "Approximation errors are tested against known examples"],
  },
  "Number Theory": {
    unit: "Number Theory",
    priority: "Medium",
    modifications: ["Add modular arithmetic, Euclid algorithm, primes, Euler theorem, congruence, and RSA targets", "Bridge number systems to cryptography examples"],
    upgrades: ["Modular clock and RSA toy-key lab", "Proof cards for divisibility and congruence rules"],
    qualityTargets: ["GCD and modular inverse edge cases are tested", "Cryptography examples stay educational and browser-local"],
  },
  "Number System": {
    unit: "Number System",
    priority: "Medium",
    modifications: ["Add real-number hierarchy, decimal expansion, HCF/LCM, exponent-law, and surd simplification checks", "Link number-line objects to exact symbolic values"],
    upgrades: ["Prime factor tree and Euclid algorithm animations", "Density and interval proof mode"],
    qualityTargets: ["Rational/irrational classification handles edge cases", "Fraction, decimal, and surd displays stay synchronized"],
  },
  Probability: {
    unit: "Probability",
    priority: "High",
    modifications: ["Move probability topics to native simulators", "Add distributions, tree diagrams, conditional probability, and event operations"],
    upgrades: ["Spreadsheet-backed experiments", "Simulation history with exportable trials"],
    qualityTargets: ["Probability routes never depend on external redirects", "Random experiments are reproducible with seeds"],
  },
  "Partial Differential Equations": {
    unit: "Partial Differential Equations",
    priority: "High",
    modifications: ["Expose heat, wave, and Laplace equation labs as engineering PDE topics", "Add boundary-condition and separation-of-variables targets"],
    upgrades: ["PDE mode selector with initial/boundary condition presets", "Fourier-series bridge for heat and wave solutions"],
    qualityTargets: ["PDE animations stay responsive", "Boundary parameters are visible and exportable"],
  },
  "Operations Research": {
    unit: "Operations Research",
    priority: "Medium",
    modifications: ["Add linear programming, transportation, assignment, queueing, and game-theory targets", "Connect feasible regions to optimization and spreadsheet data"],
    upgrades: ["Simplex tableau and transportation stepping workflows", "Scenario presets for resource allocation"],
    qualityTargets: ["Corner-point results match table calculations", "Optimization routes open native labs or explicit future cards"],
  },
  Optimization: {
    unit: "Optimization",
    priority: "High",
    modifications: ["Unify gradient descent, constrained optimization, Lagrange multipliers, and linear programming", "Add engineering objective-function presets"],
    upgrades: ["Convexity visualizer and constraint-active-set workflow", "Exportable optimization protocol"],
    qualityTargets: ["Gradient controls are stable under rapid slider changes", "Feasible-region results are deterministic"],
  },
  Statistics: {
    unit: "Statistics",
    priority: "High",
    modifications: ["Move statistics topics to the native statistics dashboard", "Add grouped data, box plots, variance, regression, and chart panels"],
    upgrades: ["Spreadsheet/CAS integration for imported data", "Construction protocol for analysis steps and exportable reports"],
    qualityTargets: ["Statistics navigation stays inside the app", "Large datasets keep chart and table interactions responsive"],
  },
  Trigonometry: {
    unit: "Trigonometry",
    priority: "Medium",
    modifications: ["Unify unit circle, triangle ratios, waves, identities, inverse trig, and applications", "Add exact-value and quadrant reasoning panels"],
    upgrades: ["Trig equation solver with general-solution visualizations", "Fourier and wave bridges for advanced users"],
    qualityTargets: ["Radians/degrees stay synchronized", "Asymptotes and discontinuities are sampled safely"],
  },
  Transforms: {
    unit: "Transforms",
    priority: "High",
    modifications: ["Add Laplace, Fourier, convolution, unit-step, impulse, and Z-transform coverage", "Connect transform-domain algebra to time-domain signals"],
    upgrades: ["Transform table with searchable formula cards", "Signal-processing presets for circuits, control, and communications"],
    qualityTargets: ["Transform routes are native", "Time/frequency views share synchronized parameters"],
  },
  "Vector Calculus": {
    unit: "Vector Calculus",
    priority: "High",
    modifications: ["Add gradient, divergence, curl, line integral, surface integral, Green, Gauss, and Stokes targets", "Bridge vector calculus to 3D fields and engineering flux/circulation examples"],
    upgrades: ["3D vector-field workbench with theorem check mode", "Parametric curve and surface integral samplers"],
    qualityTargets: ["Future vector-calculus topics show build cards", "Vector fields render without blank canvas states"],
  },
};

const appTopicRules: Record<string, Partial<UpgradeRule>> = {
  "algebraic-structures": {
    unit: "Advanced Mathematics",
    priority: "High",
    modifications: ["Add subgroup, coset, ideal, and lattice validation states", "Show operation-table property failures inline"],
    upgrades: ["Proof assistant cards for closure, identity, inverse, and associativity", "Import/export Cayley tables"],
  },
  "discrete-world": {
    unit: "Advanced Mathematics",
    priority: "High",
    modifications: ["Link automata, graph theory, logic, sets, and combinatorics objects through shared state", "Add protocol replay for algorithm steps"],
    upgrades: ["Finite automata minimization and grammar conversion", "Performance tests for dense graphs and long traces"],
  },
  "graph-theory": {
    unit: "Advanced Mathematics",
    priority: "High",
    modifications: ["Add weighted graph editing, algorithm timelines, and adjacency-matrix sync", "Persist graph object styles and labels"],
    upgrades: ["Planarity, coloring, MST, shortest path, and traversal workbenches", "Large-graph rendering benchmarks"],
  },
  "mathematical-logic": {
    unit: "Advanced Mathematics",
    priority: "Medium",
    modifications: ["Add inference-rule validation and predicate examples", "Improve truth-table export into CAS/data workspace"],
    upgrades: ["Natural deduction proof builder", "CNF/DNF simplification traces"],
  },
  matrices: {
    unit: "Linear Algebra",
    priority: "High",
    modifications: ["Route matrix basics and advanced operations through one solver surface", "Add exact fraction mode and row-operation protocol"],
    upgrades: ["LU/QR/decomposition visual workflows", "Large-matrix performance checks"],
  },
  quiz: {
    unit: "Practice",
    priority: "Medium",
    modifications: ["Attach quizzes to syllabus units and failed concept dependencies", "Add compact review cards for mistakes"],
    upgrades: ["Spaced repetition scheduler", "Teacher export for class practice"],
    qualityTargets: ["Every quiz question maps to a unit", "Score history remains local and recoverable"],
  },
  statistics: unitRules.Statistics,
};

function ruleFor(unit: string): UpgradeRule {
  return unitRules[unit] ?? fallbackRule;
}

function routeForSyllabusTopic(topic: SyllabusTopic) {
  return topic.linkedVisualization.available ? topic.linkedVisualization.route : `/syllabus-visual/${topic.id}`;
}

function inferAppUnit(topic: Topic) {
  if (topic.title.includes("Statistics")) return "Statistics";
  if (topic.title.includes("Linear") || topic.title.includes("Matrices")) return "Linear Algebra";
  if (topic.title.includes("Geometry")) return "Geometry";
  if (topic.title.includes("Trigonometry")) return "Trigonometry";
  if (topic.title.includes("Calculus")) return "Calculus";
  if (topic.title.includes("Number")) return "Number System";
  if (topic.title.includes("Combinatorics")) return "Combinatorics";
  return "Advanced Mathematics";
}

function inferConceptUnit(concept: (typeof syllabusUnitConcepts)[number]) {
  const value = `${concept.kind} ${concept.strand} ${concept.title}`.toLowerCase();
  if (value.includes("statistic") || value.includes("data")) return "Statistics";
  if (value.includes("probability")) return "Probability";
  if (value.includes("coordinate")) return "Coordinate Geometry";
  if (value.includes("matrix") || value.includes("vector")) return "Linear Algebra";
  if (value.includes("calculus") || value.includes("derivative") || value.includes("integral")) return "Calculus";
  if (value.includes("triangle") || value.includes("quadrilateral") || value.includes("circle") || value.includes("euclid") || value.includes("measurement")) return "Geometry";
  if (value.includes("polynomial") || value.includes("equation") || value.includes("pattern")) return "Algebra";
  if (value.includes("number")) return "Number System";
  return "Advanced Mathematics";
}

function makeTarget(seed: {
  id: string;
  title: string;
  unit: string;
  level: string;
  route: string;
  rule: UpgradeRule;
}): UnitUpgradeTarget {
  return {
    id: seed.id,
    title: seed.title,
    unit: seed.rule.unit || seed.unit,
    level: seed.level,
    route: seed.route,
    priority: seed.rule.priority,
    modifications: seed.rule.modifications,
    upgrades: seed.rule.upgrades,
    qualityTargets: seed.rule.qualityTargets,
  };
}

export function buildAppTopicUpgradeTargets(appTopics: Topic[] = topics): UnitUpgradeTarget[] {
  return appTopics.map((topic) => {
    const override = appTopicRules[topic.id];
    const base = ruleFor(override?.unit ?? inferAppUnit(topic));
    const rule = { ...base, ...override, qualityTargets: override?.qualityTargets ?? base.qualityTargets } as UpgradeRule;
    return makeTarget({
      id: `app-${topic.id}`,
      title: topic.title,
      unit: rule.unit,
      level: "App",
      route: topic.route,
      rule,
    });
  });
}

export function buildSyllabusTopicUpgradeTargets(items: SyllabusTopic[] = allSyllabusTopics): UnitUpgradeTarget[] {
  return items.map((topic) =>
    makeTarget({
      id: `syllabus-${topic.id}`,
      title: topic.title,
      unit: topic.unit,
      level: topic.classLevel,
      route: routeForSyllabusTopic(topic),
      rule: ruleFor(topic.unit),
    }),
  );
}

export function buildSyllabusUnitUpgradeTargets(items = syllabusUnitConcepts): UnitUpgradeTarget[] {
  return items.map((concept) => {
    const unit = inferConceptUnit(concept);
    return makeTarget({
      id: `unit-${concept.id}`,
      title: concept.title,
      unit,
      level: concept.strand,
      route: concept.route,
      rule: ruleFor(unit),
    });
  });
}

export const unitUpgradeTargets = [
  ...buildAppTopicUpgradeTargets(),
  ...buildSyllabusUnitUpgradeTargets(),
  ...buildSyllabusTopicUpgradeTargets(),
];

export function unitUpgradeSummary(targets: UnitUpgradeTarget[] = unitUpgradeTargets): UnitUpgradeSummary {
  return {
    total: targets.length,
    highPriority: targets.filter((target) => target.priority === "High").length,
    nativeRoutes: targets.filter((target) => target.route.startsWith("/")).length,
    unitCount: new Set(targets.map((target) => target.unit)).size,
  };
}
