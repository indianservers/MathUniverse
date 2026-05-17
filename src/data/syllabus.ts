import { ANVESHAK_STATISTICS_URL } from "./externalLinks";

export type SyllabusStatus = "available" | "mapped" | "future";
export type SyllabusDifficulty = "Foundation" | "Intermediate" | "Advanced";

export type SyllabusTopic = {
  id: string;
  title: string;
  unit: string;
  description: string;
  keyFormulas: string[];
  concepts: string[];
  linkedVisualization: {
    available: boolean;
    label: string;
    route: string;
    isExternal?: boolean;
    section?: string;
  };
  status: SyllabusStatus;
  recommendedVisualization: string;
  classLevel: string;
};

export type SyllabusLevel = {
  id: string;
  title: string;
  subtitle: string;
  difficulty: SyllabusDifficulty;
  totalTopics: number;
  route: string;
  topics: SyllabusTopic[];
};

export const syllabusLevelOptions = [
  { value: "All", label: "All" },
  { value: "class-7", label: "Class 7" },
  { value: "class-8", label: "Class 8" },
  { value: "class-9", label: "Class 9" },
  { value: "class-10", label: "Class 10" },
  { value: "class-11", label: "Class 11" },
  { value: "class-12", label: "Class 12" },
  { value: "degree", label: "Degree" },
];
export const concreteSyllabusLevelOptions = syllabusLevelOptions.filter((option) => option.value !== "All");

export const syllabusStatusOptions = [
  { value: "All", label: "All" },
  { value: "available", label: "Available" },
  { value: "mapped", label: "Mapped" },
  { value: "future", label: "Future" },
];

const futureLink = { available: false, label: "View Concept Card", route: "/syllabus" };

export function syllabusLevelIdFromClassLevel(classLevel: string) {
  return classLevel.toLowerCase().replace(/\s+/g, "-");
}

export function isValidSyllabusLevel(value: string | undefined | null) {
  return !!value && syllabusLevelOptions.some((option) => option.value === value);
}

export function isConcreteSyllabusLevel(value: string | undefined | null) {
  return !!value && concreteSyllabusLevelOptions.some((option) => option.value === value);
}

function topic(
  classLevel: string,
  title: string,
  unit: string,
  status: SyllabusStatus,
  recommendedVisualization: string,
  route = "",
  formulas: string[] = [],
  concepts: string[] = [],
  description?: string,
): SyllabusTopic {
  const id = `${classLevel}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    id,
    title,
    unit,
    description: description ?? `Study ${title.toLowerCase()} through formulas, concepts, and visual connections.`,
    keyFormulas: formulas.length ? formulas : ["Concept definitions", "Worked examples", "Visual model"],
    concepts: concepts.length ? concepts : [title, unit, "Applications"],
    linkedVisualization: route ? { available: true, label: route.startsWith("http") ? "Open Anveshak" : status === "available" ? "Open Visual Lab" : "Open Related Lab", route, isExternal: route.startsWith("http") } : futureLink,
    status,
    recommendedVisualization,
    classLevel,
  };
}

function level(id: string, title: string, subtitle: string, difficulty: SyllabusDifficulty, topics: SyllabusTopic[]): SyllabusLevel {
  return { id, title, subtitle, difficulty, totalTopics: topics.length, route: `/syllabus/${id}`, topics };
}

export const syllabusLevels: SyllabusLevel[] = [
  level("class-7", "Class 7 Mathematics", "NCERT bridge into integers, rational numbers, equations, geometry, symmetry, mensuration, and solid shapes.", "Foundation", [
    topic("Class 7", "Integers", "Number System", "available", "Integer number line and sign-rule operations", "/ncert/class-7-integers", ["a + (-b)", "a x (-b)"], ["Positive numbers", "Negative numbers", "Operations"]),
    topic("Class 7", "Fractions and Decimals", "Number System", "available", "Fraction bars and decimal place-value model", "/ncert/class-7-fractions-decimals", ["a/b", "decimal expansion"], ["Fractions", "Decimals", "Operations"]),
    topic("Class 7", "Data Handling", "Statistics", "available", "Charts and probability practice in Anveshak", ANVESHAK_STATISTICS_URL, ["mean = sum/n"], ["Mean", "Median", "Mode", "Bar graph"]),
    topic("Class 7", "Simple Equations", "Algebra", "mapped", "Balance scale solving model", "/algebra", ["ax+b=c"], ["Equation", "Solution", "Inverse operation"]),
    topic("Class 7", "Lines and Angles", "Geometry", "available", "Angles and parallel-line explorer", "/geometry/angles", ["linear pair", "vertically opposite angles"], ["Angles", "Transversal"]),
    topic("Class 7", "Triangle and its Properties", "Geometry", "available", "Triangle and Pythagoras visual labs", "/geometry/triangles", ["A+B+C=180 deg"], ["Median", "Altitude", "Exterior angle"]),
    topic("Class 7", "Comparing Quantities", "Arithmetic", "available", "Percentage, profit-loss, discount and simple interest story lab", "/ncert/class-7-comparing-quantities", ["percent = part/whole x 100", "SI = PRT/100"], ["Percent", "Profit", "Loss", "Interest"]),
    topic("Class 7", "Rational Numbers", "Number System", "available", "Rational number line and operations", "/ncert/class-7-rational-numbers", ["p/q, q != 0"], ["Number line", "Ordering", "Operations"]),
    topic("Class 7", "Perimeter and Area", "Geometry", "available", "Area and perimeter lab", "/geometry/area-perimeter", ["A=lb", "P=2(l+b)"], ["Area", "Perimeter"]),
    topic("Class 7", "Algebraic Expressions", "Algebra", "mapped", "Expression tiles and substitution", "/algebra", ["terms", "like terms"], ["Variables", "Terms", "Substitution"]),
    topic("Class 7", "Exponents and Powers", "Number System", "available", "Exponent law and standard form visualizer", "/ncert/class-7-exponents", ["a^m a^n = a^(m+n)"], ["Powers", "Laws"]),
    topic("Class 7", "Symmetry", "Geometry", "available", "Mirror and rotational symmetry explorer", "/geometry/symmetry", ["reflection"], ["Line symmetry", "Rotational symmetry"]),
    topic("Class 7", "Visualising Solid Shapes", "Geometry", "available", "2D/3D shapes, nets and solids explorer", "/shapes", ["faces", "edges", "vertices"], ["Nets", "Views", "3D shapes"]),
  ]),
  level("class-8", "Class 8 Mathematics", "Foundation in numbers, algebra, geometry, mensuration, and data handling.", "Foundation", [
    topic("Class 8", "Rational Numbers", "Number System", "available", "Number line and rational comparison", "/ncert/class-8-rational-numbers", ["a/b, b != 0"], ["Number line", "Comparison", "Operations"]),
    topic("Class 8", "Linear Equations in One Variable", "Algebra", "mapped", "Balance scale solving ax + b = c", "/algebra", ["ax + b = c"], ["Solving", "Inverse operations"]),
    topic("Class 8", "Understanding Quadrilaterals", "Geometry", "mapped", "Polygon angle and property explorer", "/geometry", ["sum of interior angles"], ["Parallelogram", "Rhombus", "Rectangle"]),
    topic("Class 8", "Data Handling", "Statistics", "available", "Charts and probability simulation", ANVESHAK_STATISTICS_URL, ["mean = sum/n"], ["Bar charts", "Probability"]),
    topic("Class 8", "Squares and Square Roots", "Number System", "available", "Square grid and square-root number line", "/ncert/class-8-square-cube-roots", ["n^2", "sqrt(n)"], ["Perfect squares", "Roots"]),
    topic("Class 8", "Cubes and Cube Roots", "Number System", "available", "3D cube blocks", "/ncert/class-8-square-cube-roots", ["n^3", "cbrt(n)"], ["Volume", "Cube roots"]),
    topic("Class 8", "Comparing Quantities", "Arithmetic", "available", "Percentage, profit/loss, discount, simple interest", "/ncert/class-8-comparing-quantities", ["SI = PRT/100"], ["Percent", "Discount"]),
    topic("Class 8", "Algebraic Expressions and Identities", "Algebra", "mapped", "Identity tiles and expression expansion", "/algebra", ["(a+b)^2"], ["Terms", "Identities"]),
    topic("Class 8", "Mensuration", "Geometry", "available", "2D and 3D measurement explorer", "/geometry", ["area", "volume"], ["Area", "Volume"]),
    topic("Class 8", "Exponents and Powers", "Number System", "available", "Exponential growth chart", "/ncert/class-8-exponents", ["a^m a^n = a^(m+n)"], ["Powers", "Laws"]),
    topic("Class 8", "Direct and Inverse Proportions", "Algebra", "mapped", "Proportion graph visualizer", "/algebra", ["y = kx", "xy = k"], ["Graphs", "Ratios"]),
    topic("Class 8", "Factorisation", "Algebra", "mapped", "Factor tree and algebra tiles", "/algebra", ["ab+ac=a(b+c)"], ["Factors", "Common terms"]),
    topic("Class 8", "Introduction to Graphs", "Coordinate Geometry", "available", "Coordinate and line graph lab", "/algebra", ["(x,y)", "y=mx+c"], ["Coordinates", "Line graph"]),
  ]),
  level("class-9", "Class 9 Mathematics", "Board foundation for polynomials, coordinate geometry, proofs, triangles, circles, and statistics.", "Foundation", [
    topic("Class 9", "Number Systems", "Number System", "available", "Real-number hierarchy and number line", "/ncert/class-9-number-systems"),
    topic("Class 9", "Polynomials", "Algebra", "mapped", "Polynomial graph and roots", "/algebra", ["p(x)", "remainder theorem"]),
    topic("Class 9", "Coordinate Geometry", "Coordinate Geometry", "available", "Coordinate plane and graph visualizer", "/algebra", ["(x,y)"]),
    topic("Class 9", "Linear Equations in Two Variables", "Algebra", "available", "Two-line graph and solution lab", "/algebra", ["ax+by+c=0"]),
    topic("Class 9", "Introduction to Euclid's Geometry", "Geometry", "available", "Axiom/postulate proof cards", "/ncert/class-9-euclid-geometry"),
    topic("Class 9", "Lines and Angles", "Geometry", "mapped", "Angle relationship explorer", "/geometry", ["linear pair", "parallel lines"]),
    topic("Class 9", "Triangles", "Geometry", "available", "Triangle explorer with area and angles", "/geometry", ["A+B+C=180 deg"]),
    topic("Class 9", "Quadrilaterals", "Geometry", "mapped", "Quadrilateral property explorer", "/geometry"),
    topic("Class 9", "Circles", "Geometry", "available", "Circle explorer with sector and tangent", "/geometry", ["C=2*pi*r", "A=pi*r^2"]),
    topic("Class 9", "Heron's Formula", "Geometry", "available", "Triangle side-validity and full Heron workflow", "/ncert/class-9-heron", ["sqrt(s(s-a)(s-b)(s-c))"]),
    topic("Class 9", "Surface Areas and Volumes", "Geometry", "available", "3D shape explorer", "/geometry", ["SA", "V"]),
    topic("Class 9", "Statistics", "Statistics", "available", "Mean, median, mode visualizer", ANVESHAK_STATISTICS_URL, ["mean", "median", "mode"]),
  ]),
  level("class-10", "Class 10 Mathematics", "Board-level foundation for algebra, geometry, trigonometry, mensuration, statistics, and probability.", "Intermediate", [
    topic("Class 10", "Real Numbers", "Number System", "available", "HCF, Euclid algorithm, prime factorisation tree", "/ncert/class-10-real-numbers"),
    topic("Class 10", "Polynomials", "Algebra", "available", "Polynomial and graph lab", "/algebra"),
    topic("Class 10", "Pair of Linear Equations in Two Variables", "Algebra", "available", "Simultaneous equation lab", "/algebra", ["m1x+c1=m2x+c2"]),
    topic("Class 10", "Quadratic Equations", "Algebra", "available", "Parabola graph with sliders for a, b, c", "/algebra", ["ax^2+bx+c=0", "D=b^2-4ac"], ["Roots", "Discriminant", "Vertex"]),
    topic("Class 10", "Arithmetic Progressions", "Algebra", "available", "AP sequence blocks and sum formula animation", "/ncert/class-10-arithmetic-progressions", ["a_n=a+(n-1)d", "S_n=n/2[2a+(n-1)d]"]),
    topic("Class 10", "Triangles", "Geometry", "available", "Triangle explorer", "/geometry"),
    topic("Class 10", "Coordinate Geometry", "Coordinate Geometry", "available", "Coordinate graph lab with section formula visualizer", "/ncert/class-10-section-formula", ["distance formula", "section formula"]),
    topic("Class 10", "Introduction to Trigonometry", "Trigonometry", "available", "Unit circle and wave visualizer", "/trigonometry"),
    topic("Class 10", "Applications of Trigonometry", "Trigonometry", "available", "Heights and distances simulator", "/ncert/class-10-heights-distances"),
    topic("Class 10", "Circles", "Geometry", "available", "Circle tangent and sector explorer", "/geometry"),
    topic("Class 10", "Areas Related to Circles", "Geometry", "available", "Sector and arc length visualizer", "/geometry"),
    topic("Class 10", "Surface Areas and Volumes", "Geometry", "available", "3D shape lab", "/geometry"),
    topic("Class 10", "Statistics", "Statistics", "available", "Statistics visualizer", ANVESHAK_STATISTICS_URL),
    topic("Class 10", "Probability", "Probability", "available", "Anveshak probability simulator", ANVESHAK_STATISTICS_URL),
  ]),
  level("class-11", "Class 11 Mathematics", "Advanced school mathematics connecting functions, trigonometry, analytic geometry, calculus, statistics, and probability.", "Advanced", [
    topic("Class 11", "Sets", "Advanced Mathematics", "future", "Venn diagram builder"),
    topic("Class 11", "Relations and Functions", "Advanced Mathematics", "future", "Mapping diagram and function graph test"),
    topic("Class 11", "Trigonometric Functions", "Trigonometry", "available", "Unit circle and waves", "/trigonometry"),
    topic("Class 11", "Complex Numbers and Quadratic Equations", "Advanced Mathematics", "available", "Complex plane and Euler lab", "/complex-numbers"),
    topic("Class 11", "Linear Inequalities", "Algebra", "mapped", "Shaded half-plane visualizer", "/algebra"),
    topic("Class 11", "Permutations and Combinations", "Probability", "future", "Arrangement tree and nCr/nPr comparison"),
    topic("Class 11", "Binomial Theorem", "Algebra", "future", "Pascal triangle and expansion builder"),
    topic("Class 11", "Sequences and Series", "Algebra", "mapped", "Sequence and sum visualizer", "/algebra"),
    topic("Class 11", "Straight Lines", "Algebra", "available", "Line graph and slope lab", "/algebra"),
    topic("Class 11", "Conic Sections", "Geometry", "future", "Ellipse, parabola, hyperbola focus-directrix model"),
    topic("Class 11", "Introduction to Three Dimensional Geometry", "Geometry", "mapped", "3D shape and coordinate explorer", "/geometry"),
    topic("Class 11", "Limits and Derivatives", "Calculus", "available", "Limits and derivative visualizer", "/calculus"),
    topic("Class 11", "Statistics", "Statistics", "available", "Statistics visualizer", ANVESHAK_STATISTICS_URL),
    topic("Class 11", "Probability", "Probability", "available", "Probability simulators", ANVESHAK_STATISTICS_URL),
  ]),
  level("class-12", "Class 12 Mathematics", "Senior secondary mathematics focused on calculus, matrices, vectors, probability, and optimization.", "Advanced", [
    topic("Class 12", "Relations and Functions", "Advanced Mathematics", "future", "Function composition and inverse function visualizer"),
    topic("Class 12", "Inverse Trigonometric Functions", "Trigonometry", "mapped", "Inverse trig graph visualizer", "/trigonometry"),
    topic("Class 12", "Matrices", "Linear Algebra", "available", "Matrix operations visualizer with basics, arithmetic, inverse, rank, systems and transformations", "/matrices"),
    topic("Class 12", "Determinants", "Linear Algebra", "available", "Determinant visualizer with diagonal highlighting and singularity notes", "/matrices/determinant"),
    topic("Class 12", "Continuity and Differentiability", "Calculus", "available", "Limit and derivative lab", "/calculus"),
    topic("Class 12", "Applications of Derivatives", "Calculus", "available", "Tangent and optimization visualizer", "/calculus"),
    topic("Class 12", "Integrals", "Calculus", "available", "Integration area visualizer", "/calculus"),
    topic("Class 12", "Applications of Integrals", "Calculus", "available", "Area accumulation lab", "/calculus"),
    topic("Class 12", "Differential Equations", "Calculus", "future", "Slope field and solution curve"),
    topic("Class 12", "Vector Algebra", "Linear Algebra", "available", "Vector visualizer", "/linear-algebra"),
    topic("Class 12", "Three Dimensional Geometry", "Geometry", "mapped", "3D geometry explorer", "/geometry"),
    topic("Class 12", "Linear Programming", "Advanced Mathematics", "future", "Feasible region and corner point optimization"),
    topic("Class 12", "Probability", "Probability", "available", "Probability and distribution lab", ANVESHAK_STATISTICS_URL),
  ]),
  level("degree", "Degree Mathematics", "Undergraduate mathematics mapped to available labs and future advanced modules.", "Advanced", [
    topic("Degree", "Foundations and Logic", "Advanced Mathematics", "future", "Truth table generator"),
    topic("Degree", "Set Theory and Relations", "Advanced Mathematics", "future", "Venn diagrams and Hasse diagram"),
    topic("Degree", "Abstract Algebra", "Advanced Mathematics", "future", "Group table and modular clock"),
    topic("Degree", "Linear Algebra", "Linear Algebra", "available", "Matrix operations, row reduction, rank, eigenvectors, and transformations", "/matrices"),
    topic("Degree", "Differential Calculus", "Calculus", "available", "Derivative visualizer", "/calculus"),
    topic("Degree", "Integral Calculus", "Calculus", "available", "Integration visualizer", "/calculus"),
    topic("Degree", "Multivariable Calculus", "Calculus", "future", "3D surface, gradient, tangent plane"),
    topic("Degree", "Real Analysis", "Advanced Mathematics", "future", "Sequence convergence and epsilon neighbourhood"),
    topic("Degree", "Differential Equations", "Calculus", "future", "Slope field and Euler method"),
    topic("Degree", "Numerical Methods", "Advanced Mathematics", "future", "Bisection and Newton-Raphson method"),
    topic("Degree", "Probability Theory", "Probability", "available", "Probability lab", ANVESHAK_STATISTICS_URL),
    topic("Degree", "Mathematical Statistics", "Statistics", "available", "Statistics lab", ANVESHAK_STATISTICS_URL),
    topic("Degree", "Discrete Mathematics", "Advanced Mathematics", "future", "Recurrence and finite automata"),
    topic("Degree", "Graph Theory", "Advanced Mathematics", "future", "Graph builder, BFS, DFS, shortest path"),
    topic("Degree", "Vector Calculus", "Linear Algebra", "mapped", "Vector field and direction lab", "/linear-algebra"),
    topic("Degree", "Complex Analysis", "Advanced Mathematics", "available", "Complex plane and Euler lab", "/complex-numbers"),
    topic("Degree", "Fourier Series and Transforms", "Trigonometry", "mapped", "Wave and signal visualizer", "/trigonometry"),
    topic("Degree", "Linear Programming and Optimization", "Advanced Mathematics", "mapped", "Gradient descent and optimization lab", "/ai-applications"),
    topic("Degree", "Operations Research", "Advanced Mathematics", "future", "Transportation and assignment problem"),
    topic("Degree", "Mathematical Modelling", "Advanced Mathematics", "mapped", "AI and real-life modelling demos", "/ai-applications"),
  ]),
];

export const allSyllabusTopics = syllabusLevels.flatMap((item) => item.topics);
export const syllabusUnits = Array.from(new Set(allSyllabusTopics.map((item) => item.unit))).sort();
