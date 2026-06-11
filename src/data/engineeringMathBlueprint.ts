import { syllabusLevels, type SyllabusTopic } from "./syllabus";
import { unitUpgradeTargets, type UpgradePriority } from "./unitUpgradePlan";

export type EngineeringBuildStatus = "Live" | "Mapped" | "Build next";

export type EngineeringMathDomain = {
  id: string;
  title: string;
  semesterBand: string;
  purpose: string;
  prerequisiteUnits: string[];
  workspaceTargets: string[];
  formulaFamilies: string[];
  applicationAreas: string[];
  nativeRoutes: string[];
  priority: UpgradePriority;
  status: EngineeringBuildStatus;
  topics: SyllabusTopic[];
};

export type EngineeringMathMilestone = {
  id: string;
  title: string;
  targetDomains: string[];
  deliverables: string[];
  acceptanceTargets: string[];
};

const engineeringLevel = syllabusLevels.find((level) => level.id === "engineering");
export const engineeringSyllabusTopics = engineeringLevel?.topics ?? [];

const domainDefinitions: Omit<EngineeringMathDomain, "topics" | "nativeRoutes" | "priority" | "status">[] = [
  {
    id: "engineering-calculus",
    title: "Engineering Calculus",
    semesterBand: "M1",
    purpose: "Multivariable calculus, curve tracing, Jacobians, multiple integrals, special integrals, and engineering optimization foundations.",
    prerequisiteUnits: ["Functions", "Trigonometry", "Single-variable calculus", "Coordinate geometry"],
    workspaceTargets: ["Graph workspace", "3D workspace", "CAS notebook", "Formula Map"],
    formulaFamilies: ["Partial derivatives", "Taylor expansion", "Jacobian", "Double and triple integrals", "Beta and Gamma functions"],
    applicationAreas: ["Mechanics", "Thermal systems", "field models", "optimization"],
  },
  {
    id: "engineering-differential-equations",
    title: "Engineering Differential Equations",
    semesterBand: "M1-M2",
    purpose: "First-order, higher-order, Cauchy-Euler, IVP/BVP, and physical-system equation workflows.",
    prerequisiteUnits: ["Calculus", "Algebra", "Laplace transforms", "Graphs"],
    workspaceTargets: ["Slope-field lab", "CAS notebook", "Data workspace", "Construction protocol"],
    formulaFamilies: ["Separable ODE", "linear ODE", "exact equations", "auxiliary equation", "Cauchy-Euler form"],
    applicationAreas: ["circuits", "vibrations", "population models", "cooling"],
  },
  {
    id: "engineering-linear-algebra",
    title: "Engineering Linear Algebra",
    semesterBand: "M1-M2",
    purpose: "Rank, consistency, eigen systems, diagonalization, quadratic forms, and numerical matrix workflows.",
    prerequisiteUnits: ["Matrices", "Vectors", "Systems of equations", "Coordinate geometry"],
    workspaceTargets: ["Linear algebra lab", "Matrix sandbox", "3D vector pane", "CAS notebook"],
    formulaFamilies: ["RREF", "rank-nullity", "characteristic equation", "Cayley-Hamilton", "quadratic forms"],
    applicationAreas: ["computer graphics", "robotics", "data compression", "machine learning"],
  },
  {
    id: "transforms-signals",
    title: "Transforms and Signal Mathematics",
    semesterBand: "M2-M3",
    purpose: "Laplace, Fourier, Z-transform, convolution, impulse/unit-step models, and signal-domain reasoning.",
    prerequisiteUnits: ["Calculus", "Differential equations", "Trigonometry", "Complex numbers"],
    workspaceTargets: ["Fourier lab", "CAS notebook", "Graph workspace", "Formula Map"],
    formulaFamilies: ["Laplace transform", "inverse transform", "Fourier series", "convolution", "Z-transform"],
    applicationAreas: ["signals", "control systems", "communications", "circuits"],
  },
  {
    id: "partial-differential-equations",
    title: "Partial Differential Equations",
    semesterBand: "M3",
    purpose: "PDE classification, heat/wave/Laplace equations, separation of variables, and numerical boundary methods.",
    prerequisiteUnits: ["Multivariable calculus", "Fourier series", "ODEs", "Linear algebra"],
    workspaceTargets: ["3D workspace", "Fourier lab", "Surface plotter", "Data workspace"],
    formulaFamilies: ["Heat equation", "wave equation", "Laplace equation", "boundary conditions", "finite differences"],
    applicationAreas: ["heat transfer", "vibration", "fluid flow", "electromagnetics"],
  },
  {
    id: "numerical-methods",
    title: "Numerical Methods",
    semesterBand: "M3-M4",
    purpose: "Root finding, interpolation, numerical integration, ODE/PDE solvers, error analysis, and iterative linear algebra.",
    prerequisiteUnits: ["Algebra", "Calculus", "Linear algebra", "Programming logic"],
    workspaceTargets: ["Spreadsheet workspace", "CAS notebook", "Graph workspace", "Performance benchmarks"],
    formulaFamilies: ["Bisection", "Newton-Raphson", "Lagrange interpolation", "trapezoidal/Simpson rules", "Euler/RK methods"],
    applicationAreas: ["simulation", "computational engineering", "data fitting", "optimization"],
  },
  {
    id: "probability-statistics-stochastic",
    title: "Engineering Probability, Statistics, and Stochastic Processes",
    semesterBand: "M3-M4",
    purpose: "Random variables, distributions, inference, regression, reliability, Markov chains, queueing, and time series.",
    prerequisiteUnits: ["Set theory", "Counting", "Calculus", "Spreadsheet data"],
    workspaceTargets: ["Probability lab", "Data workspace", "Spreadsheet", "Formula Map"],
    formulaFamilies: ["Expectation/variance", "normal and Poisson models", "hypothesis tests", "Markov chains", "queueing formulas"],
    applicationAreas: ["reliability", "quality control", "ML evaluation", "operations"],
  },
  {
    id: "optimization-operations-research",
    title: "Optimization and Operations Research",
    semesterBand: "M4",
    purpose: "Linear programming, simplex, transportation, assignment, network planning, game theory, and variational methods.",
    prerequisiteUnits: ["Linear algebra", "Calculus", "Graph theory", "Probability"],
    workspaceTargets: ["Graph theory lab", "Data workspace", "AI applications", "Formula Map"],
    formulaFamilies: ["simplex tableau", "duality", "transportation cost", "PERT/CPM", "Euler-Lagrange equation"],
    applicationAreas: ["resource planning", "scheduling", "supply chains", "design optimization"],
  },
  {
    id: "vector-calculus-fields",
    title: "Vector Calculus and Field Theory",
    semesterBand: "M2-M3",
    purpose: "Gradient, divergence, curl, line/surface integrals, and Green/Gauss/Stokes theorem interpretation.",
    prerequisiteUnits: ["Vectors", "3D geometry", "Multivariable calculus", "Parametric curves"],
    workspaceTargets: ["3D workspace", "Surface plotter", "Vector lab", "Formula Map"],
    formulaFamilies: ["gradient", "divergence", "curl", "line integrals", "Gauss and Stokes theorems"],
    applicationAreas: ["electromagnetics", "fluid flow", "mechanics", "robotics"],
  },
  {
    id: "complex-special-control",
    title: "Complex Analysis, Special Functions, and Control Mathematics",
    semesterBand: "M3-M4",
    purpose: "Complex functions, residues, Bessel/Legendre models, Sturm-Liouville systems, poles/zeros, and response analysis.",
    prerequisiteUnits: ["Complex numbers", "ODEs", "Transforms", "Series"],
    workspaceTargets: ["Complex lab", "CAS notebook", "Fourier lab", "Formula Map"],
    formulaFamilies: ["Cauchy integral", "residue theorem", "Bessel equation", "Legendre equation", "transfer functions"],
    applicationAreas: ["control systems", "vibrations", "signal processing", "boundary-value physics"],
  },
];

function routesForTopics(topics: SyllabusTopic[]) {
  return Array.from(new Set(topics.map((topic) => topic.linkedVisualization.route).filter((route) => route.startsWith("/"))));
}

function priorityForTitle(title: string): UpgradePriority {
  const matching = unitUpgradeTargets.find((target) => target.unit === title);
  return matching?.priority ?? "High";
}

function statusFor(topics: SyllabusTopic[], routes: string[]): EngineeringBuildStatus {
  if (topics.length === 0) return "Build next";
  if (routes.length >= topics.length && topics.every((topic) => topic.linkedVisualization.available)) return "Live";
  return "Mapped";
}

export const engineeringMathDomains: EngineeringMathDomain[] = domainDefinitions.map((domain) => {
  const topics = engineeringSyllabusTopics.filter((topic) => {
    if (topic.unit === domain.title) return true;
    if (domain.title === "Transforms and Signal Mathematics" && topic.unit === "Transforms") return true;
    if (domain.title === "Partial Differential Equations" && topic.unit === "Partial Differential Equations") return true;
    if (domain.title === "Numerical Methods" && topic.unit === "Numerical Methods") return true;
    if (domain.title === "Engineering Probability, Statistics, and Stochastic Processes") return ["Engineering Probability and Statistics", "Stochastic Processes"].includes(topic.unit);
    if (domain.title === "Optimization and Operations Research") return ["Optimization", "Operations Research"].includes(topic.unit);
    if (domain.title === "Vector Calculus and Field Theory") return topic.unit === "Vector Calculus";
    if (domain.title === "Complex Analysis, Special Functions, and Control Mathematics") return ["Complex Analysis", "Special Functions", "Control Systems Mathematics"].includes(topic.unit);
    return false;
  });
  const nativeRoutes = routesForTopics(topics);
  return {
    ...domain,
    topics,
    nativeRoutes,
    priority: priorityForTitle(domain.title),
    status: statusFor(topics, nativeRoutes),
  };
});

export const engineeringMathMilestones: EngineeringMathMilestone[] = [
  {
    id: "coverage-spine",
    title: "Coverage Spine",
    targetDomains: engineeringMathDomains.map((domain) => domain.id),
    deliverables: ["Domain map", "topic-to-route inventory", "formula families", "workspace targets"],
    acceptanceTargets: ["Every domain has native route targets", "No existing 2D/3D workspace layout is rewritten"],
  },
  {
    id: "native-lab-launchers",
    title: "Native Lab Launchers",
    targetDomains: ["engineering-calculus", "engineering-differential-equations", "engineering-linear-algebra", "transforms-signals"],
    deliverables: ["Compact Engineering Math hub", "Math Lab entry", "left navigation entry"],
    acceptanceTargets: ["Learners can open engineering domains without external redirects", "All lab buttons resolve to app routes"],
  },
  {
    id: "simulation-depth",
    title: "Simulation Depth",
    targetDomains: ["partial-differential-equations", "numerical-methods", "probability-statistics-stochastic", "vector-calculus-fields"],
    deliverables: ["PDE presets", "numerical method iteration tables", "seeded stochastic simulations", "3D field presets"],
    acceptanceTargets: ["Deterministic tests cover formula outputs", "Large simulations use performance budgets"],
  },
];

export const engineeringMathSummary = {
  domainCount: engineeringMathDomains.length,
  topicCount: engineeringSyllabusTopics.length,
  liveDomainCount: engineeringMathDomains.filter((domain) => domain.status === "Live").length,
  nativeRouteCount: new Set(engineeringMathDomains.flatMap((domain) => domain.nativeRoutes)).size,
  formulaFamilyCount: new Set(engineeringMathDomains.flatMap((domain) => domain.formulaFamilies)).size,
};

export function engineeringDomainById(id: string) {
  return engineeringMathDomains.find((domain) => domain.id === id);
}

export function engineeringCoverageGaps() {
  return engineeringMathDomains.flatMap((domain) => {
    const gaps: string[] = [];
    if (domain.topics.length === 0) gaps.push("Add syllabus topics");
    if (domain.nativeRoutes.length === 0) gaps.push("Add native route");
    if (domain.workspaceTargets.length < 3) gaps.push("Add workspace targets");
    if (domain.formulaFamilies.length < 4) gaps.push("Add formula families");
    return gaps.map((gap) => ({ domainId: domain.id, domain: domain.title, gap }));
  });
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
