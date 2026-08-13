import { Atom, Binary, BrainCircuit, Calculator, Cone, Cuboid, FunctionSquare, GitFork, Grid3X3, LineChart, Network, Ruler, Sigma, Sparkles, Triangle, Variable, Waves, Workflow, type LucideIcon } from "lucide-react";

export type MathLabEngineFamily = "Graph & Visual" | "Symbolic Solver" | "Geometry & Measure" | "Calculus & Analysis" | "Data & Probability" | "Discrete & Foundations";

type MathLabToolDefinition = {
  title: string;
  route: string;
  icon: LucideIcon;
  difficulty: string;
  description: string;
  useCases: string[];
};

export type MathLabTool = MathLabToolDefinition & {
  engineFamily: MathLabEngineFamily;
  options: string[];
  checks: string[];
  status: "validated";
};

const toolCatalog: MathLabToolDefinition[] = [
  {
    title: "Graphing",
    route: "/workspace/graph",
    icon: LineChart,
    difficulty: "Intermediate",
    description: "Interactive 2D graphing with multiple functions, zoom, pan, tables, roots, intercepts, trace mode, and numeric checks.",
    useCases: ["2D graphing", "roots", "tables", "trace"],
  },
  {
    title: "Geometry Constructor",
    route: "/workspace/geometry",
    icon: Triangle,
    difficulty: "Intermediate",
    description: "Dynamic construction workspace with points, lines, circles, polygons, transforms, constraints, and live measurements.",
    useCases: ["construction", "constraints", "measurements", "transforms"],
  },
  {
    title: "CAS / Algebra Solver",
    route: "/problem-solver",
    icon: Sparkles,
    difficulty: "Advanced",
    description: "Use the main step-by-step solver for solve, factor, expand, simplify, differentiate, integrate, statistics, matrices, and symbolic checks.",
    useCases: ["solve", "factor", "simplify", "steps"],
  },
  {
    title: "Equation Solver",
    route: "/problem-solver",
    icon: Calculator,
    difficulty: "Intermediate",
    description: "Solve linear, quadratic, symbolic equations, and systems using guided tools.",
    useCases: ["linear", "quadratic", "systems", "inequalities"],
  },
  {
    title: "Function Explorer and Transformations",
    route: "/math-lab/function-explorer",
    icon: FunctionSquare,
    difficulty: "Intermediate",
    description: "Explore domain, range, transformations, symmetry, and behavior of functions.",
    useCases: ["domain", "range", "transformations", "symmetry"],
  },
  {
    title: "Trigonometry Math Lab",
    route: "/trigonometry",
    icon: Waves,
    difficulty: "Intermediate",
    description: "Interact with unit circles, triangle ratios, waves, identities, inverse trig, heights, and 3D trig scenes.",
    useCases: ["unit circle", "trig ratios", "waves", "heights"],
  },
  {
    title: "Conic Solver and Visualizer",
    route: "/math-lab/conics",
    icon: Cone,
    difficulty: "Advanced",
    description: "Solve and visualize parabola tangents, ellipse focus-directrix equations, and hyperbola tangent relations.",
    useCases: ["parabola", "ellipse", "hyperbola", "tangents"],
  },
  {
    title: "Calculus",
    route: "/calculus",
    icon: Sigma,
    difficulty: "Advanced",
    description: "Limits, derivatives, tangent lines, integrals, area under curves, Riemann sums, motion, and series blocks.",
    useCases: ["limits", "derivatives", "integrals", "slope fields"],
  },
  {
    title: "Engineering Mathematics",
    route: "/engineering-math",
    icon: Sigma,
    difficulty: "Advanced",
    description: "B.Tech M1-M4 roadmap for calculus, differential equations, transforms, PDEs, numerical methods, probability, optimization, and field mathematics.",
    useCases: ["M1", "M2", "M3", "M4", "engineering"],
  },
  {
    title: "Matrices",
    route: "/matrices",
    icon: Grid3X3,
    difficulty: "Advanced",
    description: "Matrix editor with determinant, inverse, rank, row-reduction, eigenvalues, systems, and transformation visualizers.",
    useCases: ["determinant", "inverse", "rank", "eigenvalues"],
  },
  {
    title: "Vectors",
    route: "/math-lab/linear-algebra",
    icon: Grid3X3,
    difficulty: "Advanced",
    description: "2D and 3D vector operations, dot product, projections, components, span, basis, eigenvectors, and transformations.",
    useCases: ["vectors", "dot product", "projection", "basis"],
  },
  {
    title: "Complex Plane",
    route: "/complex-numbers",
    icon: Atom,
    difficulty: "Advanced",
    description: "Plot complex numbers, polar form, multiplication as rotation, roots of unity, transformations, and Euler form.",
    useCases: ["Argand plane", "polar form", "Euler", "roots"],
  },
  {
    title: "Sequences and Series",
    route: "/syllabus-lab/series-partial-sum",
    icon: Variable,
    difficulty: "Advanced",
    description: "Arithmetic and geometric sequences, convergence, partial sums, convergence tests, and Taylor-style approximations.",
    useCases: ["arithmetic progressions", "geometric progressions", "partial sums", "convergence"],
  },
  {
    title: "Continued Fractions Lab",
    route: "/math-lab/continued-fractions",
    icon: Sigma,
    difficulty: "Advanced",
    description: "Expand constants and roots into continued fractions, compare convergents, and measure rational approximation error.",
    useCases: ["continued fractions", "convergents", "approximations", "Euclidean algorithm"],
  },
  {
    title: "Famous Problems Atlas",
    route: "/math-lab/famous-problems",
    icon: Sparkles,
    difficulty: "Advanced",
    description: "Browse landmark conjectures, theorems, paradoxes, and open problems by status, theme, and core idea.",
    useCases: ["Riemann hypothesis", "Collatz", "Goldbach", "Fermat"],
  },
  {
    title: "Statistics Inference Studio",
    route: "/math-lab/stats-inference",
    icon: LineChart,
    difficulty: "Advanced",
    description: "Estimate proportions with confidence intervals and compare sample-size, confidence-level, and hypothesis-test signals.",
    useCases: ["confidence intervals", "hypothesis tests", "sample size", "proportions"],
  },
  {
    title: "Differential Equations Studio",
    route: "/math-lab/differential-equations",
    icon: FunctionSquare,
    difficulty: "Advanced",
    description: "Compare exact and numerical initial-value solutions for growth, decay, and first-order differential-equation models.",
    useCases: ["ODEs", "Euler method", "initial values", "growth and decay"],
  },
  {
    title: "Special Functions Gallery",
    route: "/math-lab/special-functions",
    icon: Binary,
    difficulty: "Advanced",
    description: "Explore Gamma, Beta, error-function, and zeta-style special function values through live parameter controls.",
    useCases: ["Gamma", "Beta", "erf", "zeta"],
  },
  {
    title: "Transformations",
    route: "/math/matrix-transformations",
    icon: FunctionSquare,
    difficulty: "Advanced",
    description: "Translate, rotate, reflect, dilate, shear, and compare before/after behavior for objects, grids, vectors, and functions.",
    useCases: ["rotate", "reflect", "dilate", "before/after"],
  },
  {
    title: "Measurement Lab",
    route: "/shapes",
    icon: Ruler,
    difficulty: "Intermediate",
    description: "Length, angle, area, perimeter, volume, surface area, live formulas, shape dimensions, and unit conversion support.",
    useCases: ["area", "perimeter", "volume", "surface area"],
  },
  {
    title: "Sierpinski Carpet Explorer",
    route: "/ncert/class-8-fractals-and-solid-views?tab=fractal",
    icon: Sparkles,
    difficulty: "Foundation",
    description: "Explore self-similarity, retained squares, removed squares, side scale, and retained area fractions for the Sierpinski carpet.",
    useCases: ["fractals", "self-similarity", "geometric sums", "area fractions"],
  },
  {
    title: "Orthographic Solid Views Lab",
    route: "/ncert/class-8-fractals-and-solid-views?tab=solid",
    icon: Cuboid,
    difficulty: "Foundation",
    description: "Build cube-stack solids and compare top, front, left, and right orthographic projections.",
    useCases: ["solid views", "cube stacks", "orthographic projections", "reconstruction"],
  },
  {
    title: "Equivalent Ratios and Cross Multiplication",
    route: "/ncert/class-8-proportional-reasoning-2?tab=equivalent-ratios",
    icon: GitFork,
    difficulty: "Foundation",
    description: "Compare ratios, simplify them, and prove equality with cross-products.",
    useCases: ["ratios", "cross multiplication", "missing value", "proportion"],
  },
  {
    title: "Map Scale and Representative Fraction",
    route: "/ncert/class-8-proportional-reasoning-2?tab=map-scale",
    icon: Ruler,
    difficulty: "Foundation",
    description: "Convert map distance, actual distance, and representative fraction with same-unit reasoning.",
    useCases: ["map scale", "representative fraction", "unit conversion"],
  },
  {
    title: "Ratio Splitter and Pie Sectors",
    route: "/ncert/class-8-proportional-reasoning-2?tab=ratio-splitter",
    icon: Network,
    difficulty: "Foundation",
    description: "Divide a whole into multi-term ratio shares and convert parts to percentages or pie angles.",
    useCases: ["ratio sharing", "pie chart", "percentage", "whole split"],
  },
  {
    title: "Direct and Inverse Proportion Lab",
    route: "/ncert/class-8-proportional-reasoning-2?tab=direct-inverse",
    icon: Workflow,
    difficulty: "Foundation",
    description: "Compare constant-ratio and constant-product tables and graphs.",
    useCases: ["direct proportion", "inverse proportion", "constant ratio", "constant product"],
  },
  {
    title: "3D Graphing Lab",
    route: "/workspace/3d",
    icon: Cuboid,
    difficulty: "Advanced",
    description: "Render surfaces z = f(x, y) and inspect them with interactive 3D controls.",
    useCases: ["surfaces", "z=f(x,y)", "mesh", "height maps"],
  },
  {
    title: "Mathematical Logic Lab",
    route: "/mathematical-logic",
    icon: Binary,
    difficulty: "Advanced",
    description: "Build statements, generate truth tables, convert CNF/DNF, and animate inference and predicates.",
    useCases: ["truth tables", "logic gates", "CNF", "predicate calculus"],
  },
  {
    title: "Set Theory Lab",
    route: "/set-theory",
    icon: Network,
    difficulty: "Advanced",
    description: "Explore sets, Venn diagrams, relation matrices, Hasse diagrams, functions, and discrete structures.",
    useCases: ["sets", "relations", "venn", "partial orders"],
  },
  {
    title: "Graph Theory Lab",
    route: "/graph-theory",
    icon: Network,
    difficulty: "Advanced",
    description: "Edit graphs and animate BFS, DFS, Dijkstra, MSTs, topological sort, planarity, circuits, and coloring.",
    useCases: ["graphs", "BFS", "Dijkstra", "coloring"],
  },
  {
    title: "Discrete Math and Automata World",
    route: "/discrete-world",
    icon: Workflow,
    difficulty: "Advanced",
    description: "Open the integrated browser-only lab for automata, grammars, Turing machines, and canonical discrete math modules.",
    useCases: ["DFA", "NFA", "grammars", "Turing machines"],
  },
  {
    title: "Algebraic Structures Lab",
    route: "/algebraic-structures",
    icon: GitFork,
    difficulty: "Advanced",
    description: "Validate binary operations, semigroups, monoids, posets, lattices, Boolean laws, and logic gates.",
    useCases: ["cayley tables", "monoids", "boolean algebra", "logic gates"],
  },
  {
    title: "Combinatorics Lab",
    route: "/combinatorics",
    icon: Grid3X3,
    difficulty: "Advanced",
    description: "Visualize counting trees, permutations, combinations, Pascal rows, multinomial terms, and inclusion-exclusion.",
    useCases: ["permutations", "combinations", "binomial theorem", "inclusion-exclusion"],
  },
  {
    title: "Step-by-Step Problem Solver",
    route: "/problem-solver",
    icon: BrainCircuit,
    difficulty: "Intermediate",
    description: "Walk through structured algebraic solution steps with rendered math.",
    useCases: ["equations", "steps", "verification", "explanations"],
  },
  {
    title: "Smart Math Query",
    route: "/math-lab/query",
    icon: BrainCircuit,
    difficulty: "Advanced",
    description: "Type a math question and route it to the best Math Lab tool.",
    useCases: ["natural query", "routing", "tool suggestions", "workspace"],
  },
];

const checksByFamily: Record<MathLabEngineFamily, string[]> = {
  "Graph & Visual": ["input validation", "finite sampling", "viewport safety"],
  "Symbolic Solver": ["parse validation", "result verification", "unsupported-case handling"],
  "Geometry & Measure": ["dimension validation", "unit consistency", "degenerate-case handling"],
  "Calculus & Analysis": ["domain checks", "numeric cross-check", "boundary handling"],
  "Data & Probability": ["range validation", "deterministic replay", "summary cross-check"],
  "Discrete & Foundations": ["structure validation", "invariant checks", "step verification"],
};

function engineFamilyFor(tool: MathLabToolDefinition): MathLabEngineFamily {
  const text = `${tool.title} ${tool.route} ${tool.useCases.join(" ")}`.toLowerCase();
  if (/probability|statistics|inference|random|data/.test(text)) return "Data & Probability";
  if (/geometry|conic|measure|shape|solid|fractal|map scale|transform/.test(text)) return "Geometry & Measure";
  if (/calculus|derivative|integral|differential|series|special function|continued fraction|engineering/.test(text)) return "Calculus & Analysis";
  if (/logic|set theory|graph theory|discrete|automata|algebraic structures|combinatorics|ratio|proportion|famous problems/.test(text)) return "Discrete & Foundations";
  if (/solver|cas|equation|matrices|vectors/.test(text)) return "Symbolic Solver";
  return "Graph & Visual";
}

export const mathLabTools: MathLabTool[] = toolCatalog.map((tool) => {
  const engineFamily = engineFamilyFor(tool);
  return {
    ...tool,
    engineFamily,
    options: [...tool.useCases],
    checks: [...checksByFamily[engineFamily]],
    status: "validated",
  };
});

export const mathLabEngineFamilies = (Object.keys(checksByFamily) as MathLabEngineFamily[]).map((name) => ({
  name,
  tools: mathLabTools.filter((tool) => tool.engineFamily === name).length,
  options: new Set(mathLabTools.filter((tool) => tool.engineFamily === name).flatMap((tool) => tool.options)).size,
  checks: checksByFamily[name],
}));

export const mathLabEngineReport = {
  tools: mathLabTools.length,
  options: new Set(mathLabTools.flatMap((tool) => tool.options)).size,
  families: mathLabEngineFamilies.length,
  validated: mathLabTools.filter((tool) => tool.status === "validated").length,
};
