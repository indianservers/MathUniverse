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
  { value: "engineering", label: "Engineering Maths" },
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
    linkedVisualization: route ? { available: true, label: route.startsWith("http") ? "Open External Lab" : status === "available" ? "Open Visual Lab" : "Open Related Lab", route, isExternal: route.startsWith("http") } : futureLink,
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
    topic("Class 7", "Data Handling", "Statistics", "available", "Native charts and probability practice", "/probability-statistics", ["mean = sum/n"], ["Mean", "Median", "Mode", "Bar graph"]),
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
    topic("Class 8", "Data Handling", "Statistics", "available", "Native charts and probability simulation", "/probability-statistics", ["mean = sum/n"], ["Bar charts", "Probability"]),
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
    topic("Class 9", "Statistics", "Statistics", "available", "Mean, median, mode visualizer", "/probability-statistics", ["mean", "median", "mode"]),
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
    topic("Class 10", "Statistics", "Statistics", "available", "Statistics visualizer", "/probability-statistics"),
    topic("Class 10", "Probability", "Probability", "available", "Probability simulator", "/math-lab/probability"),
  ]),
  level("class-11", "Class 11 Mathematics", "Advanced school mathematics connecting functions, trigonometry, analytic geometry, calculus, statistics, and probability.", "Advanced", [
    topic("Class 11", "Sets", "Advanced Mathematics", "future", "Venn diagram builder"),
    topic("Class 11", "Relations and Functions", "Advanced Mathematics", "future", "Mapping diagram and function graph test"),
    topic("Class 11", "Trigonometric Functions", "Trigonometry", "available", "Unit circle and waves", "/trigonometry"),
    topic("Class 11", "Complex Numbers and Quadratic Equations", "Advanced Mathematics", "available", "Complex plane and Euler lab", "/complex-numbers"),
    topic("Class 11", "Linear Inequalities", "Algebra", "mapped", "Shaded half-plane visualizer", "/algebra"),
    topic("Class 11", "Permutations and Combinations", "Combinatorics", "available", "Arrangement tree and nCr/nPr comparison", "/math/permutations-combinations", ["nPr = n!/(n-r)!", "nCr = n!/(r!(n-r)!)"], ["Permutations", "Combinations", "Factorial", "Counting principle"], "Compare ordered arrangements with unordered selections using live slots, trees, groups, and formula substitution."),
    topic("Class 11", "Binomial Theorem", "Algebra", "future", "Pascal triangle and expansion builder"),
    topic("Class 11", "Sequences and Series", "Algebra", "mapped", "Sequence and sum visualizer", "/algebra"),
    topic("Class 11", "Straight Lines", "Algebra", "available", "Line graph and slope lab", "/algebra"),
    topic("Class 11", "Conic Sections", "Geometry", "future", "Ellipse, parabola, hyperbola focus-directrix model"),
    topic("Class 11", "Introduction to Three Dimensional Geometry", "Geometry", "mapped", "3D shape and coordinate explorer", "/geometry"),
    topic("Class 11", "Limits and Derivatives", "Calculus", "available", "Limits and derivative visualizer", "/calculus"),
    topic("Class 11", "Statistics", "Statistics", "available", "Statistics visualizer", "/probability-statistics"),
    topic("Class 11", "Probability", "Probability", "available", "Probability simulators", "/math-lab/probability"),
  ]),
  level("class-12", "Class 12 Mathematics", "Senior secondary mathematics focused on calculus, matrices, vectors, probability, and optimization.", "Advanced", [
    topic("Class 12", "Relations and Functions", "Advanced Mathematics", "future", "Function composition and inverse function visualizer"),
    topic("Class 12", "Inverse Trigonometric Functions", "Trigonometry", "mapped", "Inverse trig graph visualizer", "/trigonometry"),
    topic("Class 12", "Matrices", "Linear Algebra", "available", "Matrix transformation lab", "/linear-algebra"),
    topic("Class 12", "Determinants", "Linear Algebra", "available", "Determinant visualizer", "/linear-algebra"),
    topic("Class 12", "Continuity and Differentiability", "Calculus", "available", "Limit and derivative lab", "/calculus"),
    topic("Class 12", "Applications of Derivatives", "Calculus", "available", "Tangent and optimization visualizer", "/calculus"),
    topic("Class 12", "Integrals", "Calculus", "available", "Integration area visualizer", "/calculus"),
    topic("Class 12", "Applications of Integrals", "Calculus", "available", "Area accumulation lab", "/calculus"),
    topic("Class 12", "Differential Equations", "Calculus", "future", "Slope field and solution curve"),
    topic("Class 12", "Vector Algebra", "Linear Algebra", "available", "Vector visualizer", "/linear-algebra"),
    topic("Class 12", "Three Dimensional Geometry", "Geometry", "mapped", "3D geometry explorer", "/geometry"),
    topic("Class 12", "Linear Programming", "Advanced Mathematics", "future", "Feasible region and corner point optimization"),
    topic("Class 12", "Probability", "Probability", "available", "Probability and distribution lab", "/math-lab/probability"),
  ]),
  level("degree", "Degree Mathematics", "Undergraduate mathematics mapped to available labs and future advanced modules.", "Advanced", [
    topic("Degree", "Foundations and Logic", "Advanced Mathematics", "future", "Truth table generator"),
    topic("Degree", "Set Theory and Relations", "Advanced Mathematics", "future", "Venn diagrams and Hasse diagram"),
    topic("Degree", "Abstract Algebra", "Advanced Mathematics", "future", "Group table and modular clock"),
    topic("Degree", "Linear Algebra", "Linear Algebra", "available", "Vector, matrix, and eigenvector lab", "/linear-algebra"),
    topic("Degree", "Differential Calculus", "Calculus", "available", "Derivative visualizer", "/calculus"),
    topic("Degree", "Integral Calculus", "Calculus", "available", "Integration visualizer", "/calculus"),
    topic("Degree", "Multivariable Calculus", "Calculus", "future", "3D surface, gradient, tangent plane"),
    topic("Degree", "Real Analysis", "Advanced Mathematics", "future", "Sequence convergence and epsilon neighbourhood"),
    topic("Degree", "Differential Equations", "Calculus", "future", "Slope field and Euler method"),
    topic("Degree", "Numerical Methods", "Advanced Mathematics", "future", "Bisection and Newton-Raphson method"),
    topic("Degree", "Probability Theory", "Probability", "available", "Probability lab", "/math-lab/probability"),
    topic("Degree", "Mathematical Statistics", "Statistics", "available", "Statistics lab", "/probability-statistics"),
    topic("Degree", "Discrete Mathematics", "Advanced Mathematics", "future", "Recurrence and finite automata"),
    topic("Degree", "Graph Theory", "Advanced Mathematics", "future", "Graph builder, BFS, DFS, shortest path"),
    topic("Degree", "Vector Calculus", "Linear Algebra", "mapped", "Vector field and direction lab", "/linear-algebra"),
    topic("Degree", "Complex Analysis", "Advanced Mathematics", "available", "Complex plane and Euler lab", "/complex-numbers"),
    topic("Degree", "Fourier Series and Transforms", "Trigonometry", "mapped", "Wave and signal visualizer", "/trigonometry"),
    topic("Degree", "Linear Programming and Optimization", "Advanced Mathematics", "mapped", "Gradient descent and optimization lab", "/ai-applications"),
    topic("Degree", "Operations Research", "Advanced Mathematics", "future", "Transportation and assignment problem"),
    topic("Degree", "Mathematical Modelling", "Advanced Mathematics", "mapped", "AI and real-life modelling demos", "/ai-applications"),
  ]),
  level("engineering", "Engineering Mathematics", "B.Tech mathematics sequence covering M1, M2, M3, M4, discrete mathematics, probability, numerical methods, transforms, and optimization.", "Advanced", [
    topic("Engineering", "Matrices and Cayley-Hamilton", "Engineering Linear Algebra", "available", "Cayley-Hamilton theorem, inverse construction, and matrix powers", "/syllabus-lab/cayley-hamilton-theorem-visualizer", ["A^2 - tr(A)A + det(A)I = 0"], ["Characteristic equation", "Matrix inverse", "Cayley-Hamilton"]),
    topic("Engineering", "Rank, Consistency and Row Reduction", "Engineering Linear Algebra", "available", "Rank, echelon form, consistency tests, homogeneous systems, and solution classification", "/syllabus-lab/rank-consistency-row-reduction", ["rank(A)=rank([A|b])", "Ax=b"], ["Rank", "Echelon form", "Consistency", "Free variables"]),
    topic("Engineering", "Eigenvalues, Eigenvectors and Diagonalization", "Engineering Linear Algebra", "available", "Eigenvector and diagonalization visual workflows", "/math/eigenvectors", ["Av = lambda v", "A = PDP^-1"], ["Eigenvalues", "Eigenvectors", "Diagonalization"]),
    topic("Engineering", "Quadratic Forms and Canonical Reduction", "Engineering Linear Algebra", "available", "Classify quadratic forms by eigenvalues, principal axes, and canonical form", "/syllabus-lab/canonical-quadratic-form-lab", ["q=x^T A x", "P^TAP=D"], ["Quadratic forms", "Canonical form", "Definiteness"]),
    topic("Engineering", "Orthogonality, Least Squares and Gram-Schmidt", "Engineering Linear Algebra", "available", "Orthogonal projection, least-squares fitting, Gram-Schmidt process, and QR idea", "/syllabus-lab/gram-schmidt-orthogonalization", ["proj_u v", "A^TAx=A^Tb"], ["Orthogonality", "Projection", "Least squares", "Gram-Schmidt"]),
    topic("Engineering", "Infinite Series and Convergence Tests", "Engineering Calculus", "available", "Comparison, ratio, root, Raabe, logarithmic and alternating convergence tests", "/syllabus-lab/comparison-test-lab", ["sum a_n", "lim |a_(n+1)/a_n|"], ["Comparison test", "Ratio test", "Root test"]),
    topic("Engineering", "Differential Calculus and Curve Tracing", "Engineering Calculus", "available", "Asymptotes, critical points, curvature, and curve tracing", "/syllabus-lab/asymptote-curve-tracing-lab", ["f'(x)=0", "asymptotes"], ["Curve tracing", "Maxima", "Minima"]),
    topic("Engineering", "Partial Derivatives and Maxima-Minima", "Engineering Calculus", "available", "Surface slices, partial derivatives, and constrained extrema", "/syllabus-lab/partial-derivative-slicer", ["partial f/partial x", "grad f = lambda grad g"], ["Partial derivatives", "Lagrange multipliers"]),
    topic("Engineering", "Jacobians and Coordinate Transformations", "Engineering Calculus", "available", "Jacobian area scaling and coordinate transformations", "/syllabus-lab/jacobian-area-scaling-lab", ["dA = |J| du dv"], ["Jacobian", "Coordinate transform", "Area scaling"]),
    topic("Engineering", "Multiple Integrals", "Engineering Calculus", "available", "Double and triple integral regions with volume interpretation", "/syllabus-lab/double-integral-region", ["double integral_R f(x,y)dA", "triple integral_E f(x,y,z)dV"], ["Double integrals", "Triple integrals", "Volume"]),
    topic("Engineering", "Beta and Gamma Functions", "Engineering Calculus", "available", "Special functions used in engineering probability, transforms, and integral evaluation", "/syllabus-lab/beta-gamma-curves", ["Gamma(n)=(n-1)!", "B(a,b)=Gamma(a)Gamma(b)/Gamma(a+b)"], ["Gamma function", "Beta function"]),
    topic("Engineering", "First-Order Differential Equations", "Engineering Differential Equations", "available", "Slope fields, separable equations, linear equations, and engineering IVPs", "/math/slope-fields", ["dy/dx=f(x,y)"], ["Slope fields", "Separable ODE", "Initial value problem"]),
    topic("Engineering", "Higher-Order Linear Differential Equations", "Engineering Differential Equations", "available", "Complementary functions and characteristic roots", "/syllabus-lab/higher-order-ode-characteristic-lab", ["ay''+by'+cy=0"], ["Auxiliary equation", "Repeated roots", "Complex roots"]),
    topic("Engineering", "Cauchy-Euler Differential Equations", "Engineering Differential Equations", "available", "Power-law ODEs and auxiliary equations", "/syllabus-lab/cauchy-euler-ode-lab", ["x^2y'' + axy' + by = 0"], ["Cauchy-Euler", "Power solutions"]),
    topic("Engineering", "Series Solutions, Bessel and Legendre Functions", "Special Functions", "available", "Power-series and Frobenius solutions with Bessel, Legendre, and orthogonal-function links", "/syllabus-lab/series-solution-special-functions-lab", ["sum a_n x^n", "J_n(x)", "P_n(x)"], ["Power series", "Frobenius method", "Bessel functions", "Legendre polynomials"]),
    topic("Engineering", "Boundary Value Problems and Sturm-Liouville Theory", "Special Functions", "available", "Eigenvalue boundary problems, orthogonality, Fourier modes, and engineering vibration models", "/syllabus-lab/sturm-liouville-boundary-lab", ["-(py')'+qy=lambda wy"], ["Boundary conditions", "Eigenfunctions", "Orthogonality"]),
    topic("Engineering", "Laplace Transforms", "Transforms", "available", "Time-domain signals, transform-domain algebra, initial-value problems, unit steps, impulses, and convolution", "/syllabus-lab/laplace-transform-workflow", ["L{f(t)}=F(s)", "L{y'}=sY-y(0)"], ["Laplace transform", "Inverse transform", "Initial conditions"]),
    topic("Engineering", "Fourier Series and Fourier Transform", "Transforms", "available", "Periodic signal synthesis and spectrum interpretation", "/syllabus-lab/fourier-transform-spectrum-lab", ["F(omega)=integral f(t)e^(-i omega t)dt"], ["Fourier series", "Fourier transform", "Spectrum"]),
    topic("Engineering", "Z-Transform and Difference Equations", "Transforms", "available", "Z-transform, inverse Z-transform, shifting, and discrete-time recurrence solving", "/syllabus-lab/z-transform-difference-equations", ["Z{x_n}=X(z)", "x_(n+1)=ax_n+b"], ["Z-transform", "Difference equations", "Discrete systems"]),
    topic("Engineering", "Partial Differential Equations", "Partial Differential Equations", "available", "Heat, wave, and Laplace equation visual labs", "/syllabus-lab/heat-equation-color-map", ["u_t = alpha u_xx", "u_tt=c^2u_xx", "nabla^2u=0"], ["Heat equation", "Wave equation", "Laplace equation"]),
    topic("Engineering", "PDE Classification and Characteristics", "Partial Differential Equations", "available", "Classify elliptic, parabolic, and hyperbolic equations and trace characteristic curves", "/syllabus-lab/pde-classification-characteristics-lab", ["B^2-4AC", "dx/a=dy/b"], ["PDE classification", "Characteristics", "Canonical form"]),
    topic("Engineering", "Finite Difference Methods for PDEs", "Numerical Methods", "available", "Discretize heat, wave, and Laplace equations on grids with stability and convergence readouts", "/syllabus-lab/finite-difference-method-lab", ["u_xx approx (u_(i+1)-2u_i+u_(i-1))/h^2"], ["Finite differences", "Stability", "Grid methods"]),
    topic("Engineering", "Complex Variables and Analytic Functions", "Complex Analysis", "available", "Analytic functions, branch cuts, Mobius maps, and Cauchy-Riemann checks", "/syllabus-lab/mobius-transformation-lab", ["u_x=v_y", "u_y=-v_x", "w=(az+b)/(cz+d)"], ["Analytic functions", "Mobius transforms", "Cauchy-Riemann"]),
    topic("Engineering", "Complex Integration and Residues", "Complex Analysis", "available", "Contour integrals, Cauchy integral formula, singularities, and residues", "/syllabus-lab/complex-line-integral-lab", ["integral_C f(z) dz", "f(a)=1/(2pi i) integral_C f(z)/(z-a) dz"], ["Contour integration", "Cauchy formula", "Residues"]),
    topic("Engineering", "Vector Calculus", "Vector Calculus", "available", "Gradient, divergence, curl, line integrals, surface integrals, Green, Gauss, and Stokes theorems", "/syllabus-lab/vector-calculus-field-theorems", ["grad f", "div F", "curl F"], ["Gradient", "Divergence", "Curl", "Stokes theorem"]),
    topic("Engineering", "Numerical Root-Finding", "Numerical Methods", "available", "Bisection, fixed-point, Newton-Raphson, and secant methods", "/syllabus-lab/newton-raphson-tangent-iteration", ["x_(n+1)=x_n-f(x_n)/f'(x_n)"], ["Bisection", "Newton-Raphson", "Secant method"]),
    topic("Engineering", "Numerical Linear Algebra", "Numerical Methods", "available", "Gauss elimination, LU idea, Jacobi, Gauss-Seidel, relaxation, and matrix iteration", "/syllabus-lab/numerical-linear-algebra-iteration-lab", ["Ax=b", "x^(k+1)=Bx^(k)+c"], ["Gauss elimination", "Jacobi", "Gauss-Seidel", "Relaxation"]),
    topic("Engineering", "Power Method and Eigenvalue Iteration", "Numerical Methods", "available", "Approximate dominant eigenvalues and eigenvectors using repeated matrix action", "/syllabus-lab/power-method-eigenvalue-lab", ["x_(k+1)=Ax_k/||Ax_k||"], ["Power method", "Dominant eigenvalue", "Iteration"]),
    topic("Engineering", "Interpolation and Curve Fitting", "Numerical Methods", "available", "Newton divided differences, forward/backward interpolation, and curve fitting", "/syllabus-lab/newton-divided-differences-lab", ["P_n(x)=a_0+a_1(x-x_0)+..."], ["Interpolation", "Divided differences", "Finite differences"]),
    topic("Engineering", "Numerical Integration and ODE Solvers", "Numerical Methods", "available", "Trapezoidal, Simpson, Gaussian quadrature, Euler, and RK4 methods", "/syllabus-lab/gaussian-quadrature-lab", ["integral f(x)dx approx sum w_i f(x_i)", "y_(n+1)=y_n+h f(x_n,y_n)"], ["Quadrature", "Euler method", "RK4"]),
    topic("Engineering", "Probability Distributions", "Engineering Probability and Statistics", "available", "Discrete and continuous distributions, expectation, variance, and random variables", "/probability-statistics", ["E(X)", "Var(X)", "P(A|B)"], ["Random variables", "Distributions", "Expectation"]),
    topic("Engineering", "Statistical Inference and Regression", "Engineering Probability and Statistics", "available", "Sampling, correlation, regression, confidence intervals, and hypothesis testing", "/probability-statistics", ["r", "y=a+bx"], ["Regression", "Sampling", "Hypothesis testing"]),
    topic("Engineering", "Reliability, Markov Chains and Queueing", "Stochastic Processes", "available", "Reliability functions, transition matrices, Poisson arrivals, birth-death queues, and steady state", "/syllabus-lab/reliability-markov-queueing-lab", ["P^(n)", "rho=lambda/mu", "R(t)=e^(-lambda t)"], ["Reliability", "Markov chains", "Queueing", "Steady state"]),
    topic("Engineering", "Time Series and Stochastic Processes", "Stochastic Processes", "available", "Sample paths, autocorrelation, stationarity, random walks, and engineering signal noise", "/syllabus-lab/stochastic-process-time-series-lab", ["X_t", "Cov(X_t,X_(t+k))"], ["Time series", "Stationarity", "Random walk", "Autocorrelation"]),
    topic("Engineering", "Control Systems Mathematics", "Control Systems Mathematics", "available", "Transfer functions, poles, zeros, stability, impulse response, step response, and frequency response", "/syllabus-lab/control-system-response-lab", ["G(s)=Y(s)/U(s)", "poles of G(s)"], ["Transfer function", "Poles", "Zeros", "Stability"]),
    topic("Engineering", "Discrete Mathematics for CSE", "Discrete Mathematics", "available", "Logic, sets, relations, functions, counting, recurrence, and Boolean algebra", "/discrete-world", ["p -> q", "nCr", "recurrence"], ["Logic", "Relations", "Recurrence"]),
    topic("Engineering", "Graph Theory and Network Algorithms", "Graph Theory", "available", "Graph representation, traversals, shortest paths, trees, spanning trees, and coloring", "/graph-theory", ["sum deg(v)=2|E|"], ["BFS", "DFS", "Shortest path", "Trees"]),
    topic("Engineering", "Operations Research and Linear Programming", "Operations Research", "available", "Feasible regions, objective functions, corner-point optimization, transportation, and assignment models", "/syllabus-lab/operations-research-lp", ["max Z=c1x+c2y"], ["Linear programming", "Transportation", "Assignment"]),
    topic("Engineering", "Network Models, Game Theory and PERT/CPM", "Operations Research", "available", "Project networks, critical paths, two-person games, sequencing, replacement, and inventory models", "/syllabus-lab/network-pert-game-theory-lab", ["E = (a+4m+b)/6", "minimax"], ["PERT", "CPM", "Game theory", "Inventory"]),
    topic("Engineering", "Optimization Techniques", "Optimization", "available", "Gradient descent, constrained optimization, convexity, and engineering objective functions", "/ai-applications", ["x_new=x-alpha grad f"], ["Gradient descent", "Convexity", "Constraints"]),
    topic("Engineering", "Calculus of Variations", "Optimization", "available", "Functionals, Euler-Lagrange equation, extremals, and engineering path optimization", "/syllabus-lab/variational-calculus-lab", ["d/dx(partial F/partial y') - partial F/partial y = 0"], ["Functionals", "Euler-Lagrange", "Extremals"]),
    topic("Engineering", "Number Theory and Cryptography", "Number Theory", "mapped", "Modular arithmetic, Euclid algorithm, Euler theorem, RSA, and hashing ideas", "/number-systems", ["a congruent b (mod n)", "gcd(a,b)"], ["Modular arithmetic", "Primes", "RSA"]),
    topic("Engineering", "Mathematics for Machine Learning", "Machine Learning Mathematics", "available", "Linear algebra, gradients, probability, regression, and neural-network math", "/ai-applications", ["activation(Wx+b)", "loss(theta)"], ["Vectors", "Gradients", "Regression"]),
  ]),
];

export const allSyllabusTopics = syllabusLevels.flatMap((item) => item.topics);
export const syllabusUnits = Array.from(new Set(allSyllabusTopics.map((item) => item.unit))).sort();
