import {
  Activity,
  Atom,
  BarChart3,
  Binary,
  BookOpen,
  BrainCircuit,
  Calculator,
  ChartNoAxesCombined,
  Compass,
  GitBranch,
  Grid3X3,
  Landmark,
  LineChart,
  Network,
  Orbit,
  Pi,
  Route,
  Sigma,
  SlidersHorizontal,
  SquareFunction,
  TrendingUp,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigatorCategory = "Priority" | "B.Sc" | "B.Tech";
export type NavigatorStatus = "Not Started" | "In Progress" | "Available";

export type NavigatorCard = {
  title: string;
  description: string;
  topics: string[];
  route: string;
  status: NavigatorStatus;
  category: NavigatorCategory;
  icon: LucideIcon;
};

export const priorityVisualizations: NavigatorCard[] = [
  { title: "Functions and Graphs", description: "Explore function families, transformations, intercepts, domains, and graph behavior visually.", topics: ["Linear and quadratic functions", "Domain and range", "Transformations", "Intercepts", "Composition", "Inverse functions"], route: "/math/functions-graphs", status: "Available", category: "Priority", icon: SquareFunction },
  { title: "Limits and Continuity", description: "See one-sided limits, holes, jumps, and continuous behavior as points move on a graph.", topics: ["Left and right limits", "Removable discontinuity", "Jump discontinuity", "Infinite behavior", "Epsilon intuition", "Continuity tests"], route: "/math/limits-continuity", status: "Available", category: "Priority", icon: Route },
  { title: "Derivatives and Tangent Lines", description: "Connect instantaneous rate of change to tangent lines, slopes, and motion.", topics: ["Secant to tangent", "Derivative rules", "Critical points", "Increasing/decreasing", "Concavity", "Optimization"], route: "/math/derivatives", status: "Available", category: "Priority", icon: TrendingUp },
  { title: "Integration and Area", description: "Build area under curves using rectangles, accumulation, and signed area models.", topics: ["Riemann sums", "Definite integral", "Signed area", "Accumulation", "Average value", "Applications"], route: "/math/integration", status: "Available", category: "Priority", icon: ChartNoAxesCombined },
  { title: "Matrix Transformations", description: "Watch matrices rotate, shear, scale, reflect, and reshape the coordinate grid.", topics: ["2x2 matrices", "Basis vectors", "Determinant", "Shear", "Rotation", "Area scaling"], route: "/math/matrix-transformations", status: "Available", category: "Priority", icon: Grid3X3 },
  { title: "Eigenvalues and Eigenvectors", description: "Find directions that keep their line after a matrix transformation.", topics: ["Eigenvectors", "Eigenvalues", "Characteristic equation", "Diagonalization", "Stable directions", "Applications"], route: "/math/eigenvectors", status: "Available", category: "Priority", icon: Compass },
  { title: "Differential Equation Slope Fields", description: "Use local tangent marks to predict solution curves for first-order ODEs.", topics: ["Slope fields", "Initial value", "Solution curves", "Equilibrium", "Direction fields", "Euler approximation"], route: "/math/slope-fields", status: "Available", category: "Priority", icon: Activity },
  { title: "Fourier Series", description: "Decompose periodic signals into sine and cosine waves and rebuild shapes from harmonics.", topics: ["Sine waves", "Cosine waves", "Harmonics", "Square wave", "Signal synthesis", "Convergence"], route: "/math/fourier-series", status: "In Progress", category: "Priority", icon: Waves },
  { title: "Probability Distributions", description: "Compare discrete and continuous distributions with parameters, spread, and expectation.", topics: ["Binomial", "Normal", "Poisson", "Mean", "Variance", "Sampling"], route: "/math/probability-distributions", status: "In Progress", category: "Priority", icon: BarChart3 },
  { title: "Graph Theory Algorithms", description: "Visualize graph traversal, shortest paths, trees, and network structure for algorithms.", topics: ["BFS", "DFS", "Dijkstra", "Trees", "Connectivity", "Weighted graphs"], route: "/math/graph-algorithms", status: "In Progress", category: "Priority", icon: GitBranch },
  { title: "Gradient Descent", description: "Watch optimization step downhill on a loss surface by following gradients.", topics: ["Loss functions", "Gradient", "Learning rate", "Convergence", "Local minima", "ML training"], route: "/math/gradient-descent", status: "Available", category: "Priority", icon: BrainCircuit },
  { title: "Complex Number Explorer", description: "Use the complex plane to understand modulus, argument, rotation, and multiplication.", topics: ["Argand plane", "Modulus", "Argument", "Polar form", "Complex multiplication", "Euler form"], route: "/math/complex-plane", status: "Available", category: "Priority", icon: Atom },
];

export const bscModules: NavigatorCard[] = [
  { title: "Foundations of Mathematics", description: "Build proof language and mathematical structure before advanced courses.", topics: ["Sets", "Relations", "Functions", "Logic", "Proof methods", "Induction", "Cardinality"], route: "/syllabus-lab/venn-diagram-builder", status: "Available", category: "B.Sc", icon: BookOpen },
  { title: "Differential Calculus", description: "Understand rates of change, tangent lines, derivatives, and graph behavior.", topics: ["Limits", "Continuity", "Derivative definition", "Rules", "Mean value theorem", "Maxima and minima"], route: "/math/derivatives", status: "Available", category: "B.Sc", icon: TrendingUp },
  { title: "Integral Calculus", description: "Connect antiderivatives, definite integrals, area, and accumulation.", topics: ["Riemann sums", "Definite integrals", "Substitution", "Integration by parts", "Area", "Volumes"], route: "/math/integration", status: "Available", category: "B.Sc", icon: Sigma },
  { title: "Real Analysis", description: "Make limits, convergence, continuity, and integration rigorous.", topics: ["Sequences", "Cauchy criterion", "Series", "Continuity", "Uniform convergence", "Riemann integration"], route: "/syllabus-lab/sequence-convergence", status: "Available", category: "B.Sc", icon: LineChart },
  { title: "Complex Analysis", description: "Explore analytic functions, mappings, residues, and complex geometry.", topics: ["Complex plane", "Analytic functions", "Cauchy-Riemann", "Laurent series", "Residues", "Conformal maps"], route: "/math/complex-plane", status: "Available", category: "B.Sc", icon: Atom },
  { title: "Linear Algebra", description: "Use vectors and matrices to model transformations, systems, and spaces.", topics: ["Vectors", "Matrices", "Rank", "Eigenvalues", "Diagonalization", "Inner products", "Quadratic forms"], route: "/math/matrix-transformations", status: "Available", category: "B.Sc", icon: Grid3X3 },
  { title: "Abstract Algebra", description: "Study algebraic structures such as groups, rings, fields, and homomorphisms.", topics: ["Groups", "Cayley tables", "Permutations", "Cosets", "Homomorphisms", "Rings", "Fields"], route: "/syllabus-lab/cayley-table-generator", status: "Available", category: "B.Sc", icon: Orbit },
  { title: "Differential Equations", description: "Model changing systems with first-order, second-order, and partial differential equations.", topics: ["Slope fields", "Solution curves", "Linear ODEs", "Spring-mass", "Heat equation", "Wave equation"], route: "/math/slope-fields", status: "Available", category: "B.Sc", icon: Activity },
  { title: "Numerical Methods", description: "Approximate roots, integrals, differential equations, and linear systems computationally.", topics: ["Bisection", "Newton-Raphson", "Error analysis", "Interpolation", "Numerical integration", "Euler and RK4", "Linear systems"], route: "/math/numerical-methods", status: "In Progress", category: "B.Sc", icon: Calculator },
  { title: "Probability Theory", description: "Model uncertainty with random variables, distributions, and expectation.", topics: ["Sample spaces", "Conditional probability", "Random variables", "Expectation", "Variance", "Common distributions"], route: "/math/probability-distributions", status: "In Progress", category: "B.Sc", icon: Pi },
  { title: "Statistics", description: "Analyze data using summaries, distributions, correlation, regression, and inference.", topics: ["Mean and variance", "Sampling", "Correlation", "Regression", "Normal distribution", "Hypothesis testing"], route: "/statistics", status: "Available", category: "B.Sc", icon: BarChart3 },
  { title: "Mechanics", description: "Connect vectors, calculus, and differential equations to physical motion.", topics: ["Kinematics", "Forces", "Work", "Energy", "Momentum", "Central forces"], route: "/math/mechanics", status: "Not Started", category: "B.Sc", icon: SlidersHorizontal },
  { title: "Operations Research", description: "Optimize resources with linear programming, networks, and decision models.", topics: ["Linear programming", "Simplex method", "Transportation", "Assignment", "Queues", "Game theory"], route: "/math/operations-research", status: "Not Started", category: "B.Sc", icon: Landmark },
  { title: "Discrete Mathematics", description: "Study finite structures used in logic, algorithms, computing, and combinatorics.", topics: ["Logic", "Sets", "Counting", "Recurrence", "Graphs", "Trees", "Boolean algebra"], route: "/math/graph-algorithms", status: "In Progress", category: "B.Sc", icon: Binary },
];

export const btechModules: NavigatorCard[] = [
  { title: "Engineering Calculus", description: "Use calculus to model change, area, motion, optimization, and signals.", topics: ["Functions", "Limits", "Derivatives", "Integrals", "Series", "Multivariable calculus"], route: "/math/functions-graphs", status: "Available", category: "B.Tech", icon: Sigma },
  { title: "Differential Equations and Transforms", description: "Solve engineering models with ODEs, PDEs, Laplace ideas, and Fourier thinking.", topics: ["First-order ODEs", "Second-order ODEs", "Laplace transform", "Fourier series", "Heat equation", "Wave equation"], route: "/math/slope-fields", status: "Available", category: "B.Tech", icon: Waves },
  { title: "Discrete Mathematics", description: "Learn the structures behind programming, logic, algorithms, and databases.", topics: ["Logic", "Relations", "Functions", "Combinatorics", "Recurrence", "Graphs", "Trees"], route: "/math/graph-algorithms", status: "In Progress", category: "B.Tech", icon: Binary },
  { title: "Probability and Statistics", description: "Build intuition for uncertainty, data, ML evaluation, and random processes.", topics: ["Probability rules", "Bayes theorem", "Distributions", "Expectation", "Sampling", "Regression"], route: "/math/probability-distributions", status: "In Progress", category: "B.Tech", icon: BarChart3 },
  { title: "Linear Algebra for AI/ML", description: "Use vectors, matrices, eigenvectors, projections, and decompositions for machine learning.", topics: ["Vectors", "Matrix transforms", "Rank", "Eigenvectors", "Orthogonality", "PCA", "Least squares"], route: "/math/matrix-transformations", status: "Available", category: "B.Tech", icon: Grid3X3 },
  { title: "Numerical Methods", description: "Implement approximation algorithms for roots, systems, interpolation, and integration.", topics: ["Root finding", "Newton method", "Error", "Interpolation", "Quadrature", "ODE solvers"], route: "/math/numerical-methods", status: "In Progress", category: "B.Tech", icon: Calculator },
  { title: "Optimization Techniques", description: "Minimize objectives using gradients, constraints, convex ideas, and search methods.", topics: ["Objective functions", "Gradient descent", "Learning rate", "Constraints", "Convexity", "Lagrange multipliers"], route: "/math/gradient-descent", status: "Available", category: "B.Tech", icon: BrainCircuit },
  { title: "Graph Theory for Algorithms", description: "Understand networks, paths, trees, and graph algorithms used in CSE.", topics: ["Graph representation", "BFS", "DFS", "Shortest path", "Spanning trees", "Topological sort"], route: "/math/graph-algorithms", status: "In Progress", category: "B.Tech", icon: Network },
  { title: "Number Theory and Cryptography", description: "Use modular arithmetic, primes, and algebraic structure to understand cryptography.", topics: ["Modular arithmetic", "GCD", "Primes", "Euler theorem", "RSA", "Hashing ideas"], route: "/math/cryptography", status: "In Progress", category: "B.Tech", icon: Atom },
  { title: "Mathematics for Machine Learning", description: "Connect linear algebra, calculus, probability, and optimization into ML workflows.", topics: ["Vectors", "Loss surfaces", "Gradients", "Probability", "Bayes", "Regression", "Neural networks"], route: "/math/machine-learning", status: "Available", category: "B.Tech", icon: BrainCircuit },
];

export const allNavigatorCards = [...priorityVisualizations, ...bscModules, ...btechModules];

