export type FormulaVisualizerDifficulty = "Foundation" | "Practice" | "Exam" | "Advanced";

export type FormulaVisualizerType =
  | "graph"
  | "area"
  | "geometry"
  | "coordinate"
  | "calculus"
  | "matrix"
  | "vector"
  | "probability"
  | "statistics"
  | "mensuration"
  | "number-system"
  | "complex"
  | "sequence"
  | "combinatorics"
  | "set-logic"
  | "function"
  | "linear-programming"
  | "polynomial"
  | "inequality"
  | "distribution"
  | "limits-continuity"
  | "differential-equations"
  | "determinant"
  | "three-d-geometry"
  | "early-number-sense"
  | "fraction-percent"
  | "commercial-math"
  | "speed-work"
  | "mental-math"
  | "pre-algebra"
  | "number-theory"
  | "euclidean-geometry"
  | "analytic-geometry"
  | "precalculus"
  | "calculus-applications"
  | "multivariable-calculus"
  | "advanced-linear-algebra"
  | "abstract-algebra"
  | "real-analysis"
  | "complex-analysis"
  | "topology"
  | "differential-geometry"
  | "discrete-math"
  | "optimization"
  | "numerical-methods"
  | "dynamical-systems"
  | "pde"
  | "transforms"
  | "mathematical-physics"
  | "information-theory"
  | "machine-learning"
  | "cryptography";

export type FormulaVisualizerEntry = {
  id: string;
  title: string;
  latex: string;
  plainText: string;
  description: string;
  group: string;
  difficulty: FormulaVisualizerDifficulty;
  variables: string[];
  visualizerType: FormulaVisualizerType;
  commonMistake?: string;
  notes?: string;
  tags: string[];
};

export type FormulaVisualizerExample = {
  title: string;
  description: string;
  values: Partial<Record<"a" | "b" | "c" | "n" | "p", number>>;
};

export type FormulaVisualizerRouteConfig = {
  id: string;
  title: string;
  shortTitle: string;
  route: string;
  category: string;
  subtitle: string;
  description: string;
  defaultFormulaId: string;
  formulaLibraryRoute: string;
  relatedRoutes: Array<{ label: string; href: string }>;
  examples: FormulaVisualizerExample[];
  formulas: FormulaVisualizerEntry[];
  searchTerms: string[];
  teacherNotes?: {
    quickBoardExplanation: string;
    discussionPrompt: string;
    misconceptionPrompt: string;
    fiveMinuteActivity: string;
    practiceChallenge: string;
    prerequisites: string[];
    nextConcepts: string[];
  };
};

import { phase3FormulaVisualizerConfigs, phase3FormulaVisualizerCategoryRouteMap } from "./formulaVisualizerPhase3";

const sharedExamples: FormulaVisualizerExample[] = [
  { title: "Balanced classroom values", description: "Moderate values that keep the visual easy to read.", values: { a: 2, b: 3, c: 1, n: 6, p: 50 } },
  { title: "Edge case check", description: "Push one value near a boundary and watch the formula stay consistent.", values: { a: -2, b: 4, c: -1, n: 10, p: 75 } },
  { title: "Exam substitution", description: "Use integer-friendly values for quick mental verification.", values: { a: 3, b: 2, c: 4, n: 8, p: 25 } },
];

export const formulaVisualizerConfigs: FormulaVisualizerRouteConfig[] = [
  {
    id: "sierpinski-carpet",
    title: "Sierpinski Carpet Formula Visualizer",
    shortTitle: "Sierpinski Carpet",
    route: "/visual-formulas/sierpinski-carpet",
    category: "Fractals and Solid Views",
    subtitle: "Count retained squares, removed holes, scale factors, and area fractions while connecting the carpet to finite geometric sums.",
    description: "A compact Class 8 visual formula lab for self-similarity, Sierpinski carpet iterations, and solid-view projection formulas.",
    defaultFormulaId: "sierpinski-retained-area",
    formulaLibraryRoute: "/formulas/fractals-solid-views",
    relatedRoutes: [
      { label: "Class 8 NCERT lab", href: "/ncert/class-8-fractals-and-solid-views" },
      { label: "Solid views tab", href: "/ncert/class-8-fractals-and-solid-views?tab=solid" },
      { label: "Sierpinski proof", href: "/visual-proofs/sequences-and-series/sierpinski-retained-area" },
    ],
    examples: [
      { title: "Iteration 2", description: "Easy first check for 64 retained squares.", values: { a: 3, b: 8, c: 1, n: 2, p: 50 } },
      { title: "Iteration 4", description: "NCERT-style table row with 4096 retained squares.", values: { a: 3, b: 8, c: 1, n: 4, p: 50 } },
      { title: "Projection check", description: "Use the Class 8 lab to compare formula and cube-stack views.", values: { a: 2, b: 4, c: 1, n: 3, p: 50 } },
    ],
    searchTerms: ["sierpinski carpet visualizer", "fractals", "retained squares", "removed squares", "orthographic projection", "solid views", "class 8 geometric themes"],
    teacherNotes: classroomNotes(
      "Start with one square split into 9 parts. Every round keeps 8 parts, so counts multiply by 8 while area multiplies by 8/9.",
      "Why is the count multiplier 8 but the area multiplier 8/9?",
      "Students often count only the new hole, not all holes removed so far. Separate new removed and cumulative removed.",
      "Ask students to fill n=0 to n=4 before opening the visual proof.",
      "Find n when the smallest side is 1/81, then compute retained area.",
      ["Powers", "Fractions", "Area of a square"],
      ["Geometric sequences", "Finite geometric sums", "Fractal dimension"]
    ),
    formulas: [
      formula("sierpinski-retained-count", "Retained squares", "R_n=8^n", "retained squares = 8^n", "Each retained square makes eight smaller retained copies.", "Counts", "Foundation", ["n"], "sequence", ["fractal", "count", "powers"]),
      formula("sierpinski-new-removed", "Newly removed squares", "N_n=8^{n-1}", "newly removed = 8^(n-1)", "The new holes at step n equal the retained squares from step n - 1.", "Counts", "Practice", ["n"], "sequence", ["removed", "holes"]),
      formula("sierpinski-total-removed", "Cumulative removed squares", "C_n=\\frac{8^n-1}{7}", "total removed = (8^n - 1) / 7", "All removed holes form a finite geometric sum.", "Finite Sums", "Exam", ["n"], "sequence", ["geometric sum", "removed"]),
      formula("sierpinski-side-scale", "Smallest side scale", "s_n=\\frac{1}{3^n}", "side scale = 1 / 3^n", "The side length is divided by 3 in every iteration.", "Scale", "Foundation", ["n"], "sequence", ["scale", "self similarity"]),
      formula("sierpinski-small-area", "Smallest square area", "a_n=\\frac{1}{9^n}", "smallest area = 1 / 9^n", "Area scale squares the side scale.", "Scale", "Practice", ["n"], "sequence", ["area", "scale"]),
      formula("sierpinski-retained-area", "Retained area", "A_n=\\left(\\frac{8}{9}\\right)^n", "retained area = (8/9)^n", "Every iteration keeps eight ninths of the current area.", "Area", "Exam", ["n"], "sequence", ["area fraction"]),
      formula("sierpinski-removed-area", "Removed area", "M_n=1-\\left(\\frac{8}{9}\\right)^n", "removed area = 1 - (8/9)^n", "Removed area is the complement of retained area.", "Area", "Exam", ["n"], "sequence", ["area fraction", "complement"]),
      formula("solid-top-projection", "Top projection", "T_{r,c}=1\\text{ if }h_{r,c}>0", "top view marks non-empty stacks", "The top view sees the footprint of every non-empty stack.", "Solid Views", "Foundation", ["h"], "three-d-geometry", ["projection", "top view"]),
      formula("solid-front-projection", "Front projection", "F_c=\\max_r h_{r,c}", "front view = max height by column", "The front view records the maximum stack height in each column.", "Solid Views", "Practice", ["h"], "three-d-geometry", ["projection", "front view"]),
      formula("solid-side-projection", "Side projection", "L_r=\\max_c h_{r,c}", "side view = max height by row", "The side view records the maximum stack height in each row.", "Solid Views", "Practice", ["h"], "three-d-geometry", ["projection", "side view"]),
    ],
  },
  {
    id: "trigonometry",
    title: "Trigonometry Formula Visualizer",
    shortTitle: "Trigonometry",
    route: "/trigonometry/formula-visualizer",
    category: "Trigonometry",
    subtitle: "Unit-circle, triangle, identity, and equation models for sine, cosine, tangent, and core trigonometric formulas.",
    description: "A specialized trigonometry visualizer with compact tabs, KaTeX formulas, live diagrams, and guided practice.",
    defaultFormulaId: "pythagorean-identity",
    formulaLibraryRoute: "/formulas/trigonometry",
    relatedRoutes: [
      { label: "Trigonometry hub", href: "/trigonometry" },
      { label: "Trig visual proofs", href: "/visual-proofs/trigonometry" },
      { label: "Formula library", href: "/formulas/trigonometry" },
    ],
    examples: sharedExamples,
    searchTerms: ["trigonometry formula visualizer", "unit circle", "sin cos tan", "trig identities", "trigonometric formulas"],
    teacherNotes: classroomNotes("Use the unit circle and right-triangle ratio together so students see that trig formulas are coordinates, ratios, and graph behavior at once.", "Which representation makes sine easiest to explain: triangle, circle, or wave?", "Students often treat identities as memorized rules; ask them to point to the same relationship in the diagram.", "Move one angle and record sine, cosine, and tangent in a three-column table.", "Explain why tan theta is undefined when cos theta is zero.", ["Ratios", "Coordinate plane", "Pythagoras"], ["Trigonometric equations", "Calculus"]),
    formulas: [
      formula("sin-ratio", "Sine ratio", "\\sin\\theta=\\frac{opposite}{hypotenuse}", "sin theta = opposite / hypotenuse", "Sine compares opposite side to hypotenuse.", "Ratios", "Foundation", ["theta"], "geometry", ["sine"]),
      formula("cos-ratio", "Cosine ratio", "\\cos\\theta=\\frac{adjacent}{hypotenuse}", "cos theta = adjacent / hypotenuse", "Cosine compares adjacent side to hypotenuse.", "Ratios", "Foundation", ["theta"], "geometry", ["cosine"]),
      formula("tan-ratio", "Tangent ratio", "\\tan\\theta=\\frac{opposite}{adjacent}", "tan theta = opposite / adjacent", "Tangent compares opposite side to adjacent side.", "Ratios", "Foundation", ["theta"], "geometry", ["tangent"]),
      formula("pythagorean-identity", "Pythagorean identity", "\\sin^2\\theta+\\cos^2\\theta=1", "sin^2 theta + cos^2 theta = 1", "Unit-circle coordinates always satisfy Pythagoras.", "Identities", "Practice", ["theta"], "geometry", ["identity"]),
      formula("tan-identity", "Tangent identity", "\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}", "tan theta = sin theta / cos theta", "Tangent is slope on the unit circle.", "Identities", "Practice", ["theta"], "geometry", ["identity"]),
      formula("sine-rule", "Sine rule", "\\frac a{\\sin A}=\\frac b{\\sin B}=\\frac c{\\sin C}", "sine rule", "Side lengths scale with opposite angle sines.", "Triangles", "Exam", ["a", "b", "c"], "geometry", ["sine rule"]),
      formula("cosine-rule", "Cosine rule", "c^2=a^2+b^2-2ab\\cos C", "cosine rule", "Cosine rule extends Pythagoras to any triangle.", "Triangles", "Exam", ["a", "b", "c"], "geometry", ["cosine rule"]),
      formula("angle-sum-sine", "Sine angle sum", "\\sin(A+B)=\\sin A\\cos B+\\cos A\\sin B", "sine angle sum", "Rotations combine into a new sine value.", "Compound Angles", "Advanced", ["A", "B"], "geometry", ["angle sum"]),
    ],
  },
  {
    id: "algebra",
    title: "Algebra Formula Visualizer",
    shortTitle: "Algebra",
    route: "/algebra/formula-visualizer",
    category: "Algebra",
    subtitle: "Graphs, identities, sequences, and substitutions in one compact lab.",
    description: "Use sliders to connect algebraic formulas to graphs, area models, roots, sequence tables, and live substitutions.",
    defaultFormulaId: "quadratic-standard",
    formulaLibraryRoute: "/formulas/algebra",
    relatedRoutes: [
      { label: "Algebra hub", href: "/algebra" },
      { label: "Graph workspace", href: "/workspace/graph" },
      { label: "Algebraic identity proofs", href: "/visual-proofs/algebraic-identities" },
    ],
    examples: sharedExamples,
    searchTerms: ["algebra formula visualizer", "quadratic visualizer", "identity area model", "sequence formulas"],
    teacherNotes: classroomNotes("Connect symbols to three models: graph, area tile, and substitution table.", "Which formula changes shape and which only changes value?", "Students often expand powers incorrectly; make them identify each area tile before simplifying.", "Use sliders to compare (a+b)^2 with a^2+b^2.", "Create one expression that can be explained by a graph and by an area model.", ["Arithmetic", "Variables"], ["Functions", "Quadratics"]),
    formulas: [
      formula("linear-equation", "Linear equation", "y=mx+c", "y = mx + c", "Slope and intercept move a line.", "Equations", "Foundation", ["m", "c"], "graph", ["linear", "slope"]),
      formula("quadratic-standard", "Quadratic equation", "y=ax^2+bx+c", "y = ax^2 + bx + c", "Coefficients control opening, vertex, intercepts, and roots.", "Quadratics", "Practice", ["a", "b", "c"], "graph", ["quadratic", "parabola"], "Forgetting that negative a opens the parabola downward."),
      formula("square-sum", "Square of a sum", "(a+b)^2=a^2+2ab+b^2", "(a+b)^2 = a^2 + 2ab + b^2", "Area tiles explain the middle term.", "Identities", "Foundation", ["a", "b"], "area", ["identity", "area model"]),
      formula("square-difference", "Square of a difference", "(a-b)^2=a^2-2ab+b^2", "(a-b)^2 = a^2 - 2ab + b^2", "Shows why the middle term is negative.", "Identities", "Practice", ["a", "b"], "area", ["identity"]),
      formula("difference-squares", "Difference of squares", "a^2-b^2=(a-b)(a+b)", "a^2 - b^2 = (a-b)(a+b)", "Removing a smaller square leaves a factorable rectangle.", "Identities", "Practice", ["a", "b"], "area", ["factorization"]),
      formula("completing-square", "Completing the square", "x^2+bx=(x+b/2)^2-(b/2)^2", "x^2 + bx = (x + b/2)^2 - (b/2)^2", "Half the coefficient completes a square.", "Quadratics", "Exam", ["b"], "area", ["quadratic"]),
      formula("ap-nth", "Arithmetic progression", "a_n=a+(n-1)d", "a_n = a + (n-1)d", "Equal jumps create a linear pattern.", "Sequences", "Foundation", ["a", "d", "n"], "graph", ["sequence"]),
      formula("gp-nth", "Geometric progression", "a_n=ar^{n-1}", "a_n = ar^(n-1)", "Equal ratios create exponential growth or decay.", "Sequences", "Practice", ["a", "r", "n"], "graph", ["sequence"]),
      formula("exponent-law", "Exponent product law", "x^a x^b=x^{a+b}", "x^a * x^b = x^(a+b)", "Multiplying same bases adds powers.", "Laws", "Foundation", ["a", "b"], "graph", ["exponents"]),
      formula("log-law", "Logarithm product law", "\\log(xy)=\\log x+\\log y", "log(xy) = log x + log y", "Products become sums on a logarithmic scale.", "Laws", "Practice", ["x", "y"], "graph", ["logarithms"]),
    ],
  },
  {
    id: "geometry",
    title: "Geometry Formula Visualizer",
    shortTitle: "Geometry",
    route: "/geometry/formula-visualizer",
    category: "Geometry",
    subtitle: "Areas, angles, circles, sectors, and similarity with live shape controls.",
    description: "Change lengths and angles to see geometry formulas update directly on the diagram.",
    defaultFormulaId: "triangle-area",
    formulaLibraryRoute: "/formulas/geometry",
    relatedRoutes: [
      { label: "Geometry hub", href: "/geometry" },
      { label: "Shapes explorer", href: "/shapes" },
      { label: "Geometry visual proofs", href: "/visual-proofs/geometry" },
    ],
    examples: sharedExamples,
    searchTerms: ["geometry formula visualizer", "triangle area visualizer", "circle area", "sector arc"],
    teacherNotes: classroomNotes("Keep length labels visible and ask students to name the dimension used by each formula.", "What changes when the shape scales but the angle stays fixed?", "Students may use slanted side as height; highlight perpendicular height.", "Compare triangle area and rectangle area with the same base and height.", "Find two shapes with equal area but different perimeters.", ["Measurement", "Angles"], ["Coordinate geometry", "Mensuration"]),
    formulas: [
      formula("triangle-area", "Triangle area", "A=\\frac{1}{2}bh", "A = 1/2 base height", "Base and height determine area.", "Area", "Foundation", ["b", "h"], "geometry", ["triangle"]),
      formula("pythagoras", "Pythagoras theorem", "a^2+b^2=c^2", "a^2 + b^2 = c^2", "Right-triangle side squares balance.", "Triangles", "Foundation", ["a", "b"], "geometry", ["pythagoras"]),
      formula("circle-circumference", "Circle circumference", "C=2\\pi r", "C = 2 pi r", "Radius controls distance around a circle.", "Circles", "Foundation", ["r"], "geometry", ["circle"]),
      formula("circle-area", "Circle area", "A=\\pi r^2", "A = pi r^2", "Area grows with the square of radius.", "Circles", "Foundation", ["r"], "geometry", ["circle", "area"]),
      formula("sector-area", "Sector area", "A=\\frac{\\theta}{360}\\pi r^2", "A = theta/360 * pi r^2", "A sector is a fraction of the full circle.", "Circles", "Practice", ["theta", "r"], "geometry", ["sector"]),
      formula("arc-length", "Arc length", "s=r\\theta", "s = r theta", "Radians convert angle directly into arc length.", "Circles", "Practice", ["r", "theta"], "geometry", ["arc"]),
      formula("similar-triangles", "Similar triangles", "\\frac{a}{b}=\\frac{ka}{kb}", "a/b = ka/kb", "Scaling keeps side ratios fixed.", "Similarity", "Practice", ["scale"], "geometry", ["similarity"]),
      formula("angle-sum", "Triangle angle sum", "A+B+C=180^\\circ", "A + B + C = 180 degrees", "Triangle angles always sum to a straight angle.", "Angles", "Foundation", ["A", "B"], "geometry", ["angles"]),
      formula("polygon-sum", "Polygon interior angle sum", "S=(n-2)180^\\circ", "S = (n - 2) * 180 degrees", "Triangulating a polygon gives n minus 2 triangles.", "Polygons", "Practice", ["n"], "geometry", ["polygon"]),
    ],
  },
  {
    id: "coordinate-geometry",
    title: "Coordinate Geometry Formula Visualizer",
    shortTitle: "Coordinate Geometry",
    route: "/coordinate-geometry/formula-visualizer",
    category: "Coordinate Geometry",
    subtitle: "Point formulas with draggable-style coordinate controls.",
    description: "Move points numerically and watch distances, slopes, midpoints, line equations, and areas update live.",
    defaultFormulaId: "distance",
    formulaLibraryRoute: "/formulas/coordinate-geometry",
    relatedRoutes: [
      { label: "Coordinate geometry", href: "/geometry/coordinate-geometry" },
      { label: "Graph workspace", href: "/workspace/graph" },
      { label: "Coordinate visual proofs", href: "/visual-proofs/coordinate-geometry" },
    ],
    examples: sharedExamples,
    searchTerms: ["coordinate geometry visualizer", "distance formula", "midpoint formula", "slope formula"],
    formulas: [
      formula("distance", "Distance formula", "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}", "d = sqrt((x2-x1)^2 + (y2-y1)^2)", "The segment length is a Pythagorean hypotenuse.", "Points", "Foundation", ["x1", "y1", "x2", "y2"], "coordinate", ["distance"]),
      formula("midpoint", "Midpoint formula", "M=(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2})", "M = ((x1+x2)/2, (y1+y2)/2)", "A midpoint averages both coordinates.", "Points", "Foundation", ["x1", "y1", "x2", "y2"], "coordinate", ["midpoint"]),
      formula("section", "Section formula", "P=(\\frac{mx_2+nx_1}{m+n},\\frac{my_2+ny_1}{m+n})", "Section formula", "Weighted averages split a segment in a ratio.", "Points", "Exam", ["m", "n"], "coordinate", ["section"]),
      formula("slope", "Slope formula", "m=\\frac{y_2-y_1}{x_2-x_1}", "m = (y2-y1)/(x2-x1)", "Slope compares rise to run.", "Lines", "Foundation", ["x1", "y1", "x2", "y2"], "coordinate", ["slope"]),
      formula("line", "Equation of a line", "y=mx+c", "y = mx + c", "Slope tilts the line and c shifts it.", "Lines", "Foundation", ["m", "c"], "coordinate", ["line"]),
      formula("parallel", "Parallel slope relation", "m_1=m_2", "m1 = m2", "Parallel lines share slope.", "Lines", "Practice", ["m1", "m2"], "coordinate", ["parallel"]),
      formula("perpendicular", "Perpendicular slope relation", "m_1m_2=-1", "m1*m2 = -1", "Perpendicular slopes are negative reciprocals.", "Lines", "Practice", ["m1", "m2"], "coordinate", ["perpendicular"]),
      formula("circle-equation", "Circle equation", "(x-h)^2+(y-k)^2=r^2", "(x-h)^2 + (y-k)^2 = r^2", "All points stay a fixed distance from center.", "Circles", "Practice", ["h", "k", "r"], "coordinate", ["circle"]),
      formula("triangle-area-coordinates", "Triangle area by coordinates", "A=\\frac{1}{2}|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)|", "Coordinate triangle area", "The determinant measures signed area.", "Area", "Exam", ["x", "y"], "coordinate", ["area"]),
    ],
  },
  calculusConfig("derivatives", "Derivatives Formula Visualizer", "Derivatives", "/math/derivatives/formula-visualizer", "/formulas/derivatives", "Derivative rules, tangent slopes, and increasing/decreasing behavior.", "derivative-definition", [
    formula("derivative-definition", "Derivative as tangent slope", "f'(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}", "f'(a) = lim h->0 [f(a+h)-f(a)]/h", "Secants settle into the tangent slope.", "Definition", "Foundation", ["a", "h"], "calculus", ["derivative", "tangent"]),
    formula("power-rule", "Power rule", "\\frac{d}{dx}x^n=nx^{n-1}", "d/dx x^n = n x^(n-1)", "Powers become slope functions.", "Rules", "Foundation", ["n"], "calculus", ["power rule"]),
    formula("product-rule", "Product rule", "(uv)'=u'v+uv'", "(uv)' = u'v + uv'", "Both changing factors contribute.", "Rules", "Practice", ["u", "v"], "calculus", ["product rule"]),
    formula("quotient-rule", "Quotient rule", "(\\frac{u}{v})'=\\frac{u'v-uv'}{v^2}", "(u/v)' = (u'v - uv') / v^2", "Division needs denominator-squared adjustment.", "Rules", "Exam", ["u", "v"], "calculus", ["quotient rule"]),
    formula("chain-rule", "Chain rule", "\\frac{d}{dx}f(g(x))=f'(g(x))g'(x)", "d/dx f(g(x)) = f'(g(x))g'(x)", "Outer rate times inner rate.", "Rules", "Exam", ["a"], "calculus", ["chain rule"]),
    formula("sin-derivative", "Derivative of sine", "\\frac{d}{dx}\\sin x=\\cos x", "d/dx sin x = cos x", "Cosine is the slope wave of sine.", "Trig derivatives", "Practice", ["x"], "calculus", ["sine"]),
    formula("cos-derivative", "Derivative of cosine", "\\frac{d}{dx}\\cos x=-\\sin x", "d/dx cos x = -sin x", "Negative sine is the slope wave of cosine.", "Trig derivatives", "Practice", ["x"], "calculus", ["cosine"]),
    formula("critical-points", "Critical points", "f'(x)=0", "f'(x) = 0", "Flat tangent points can mark maxima or minima.", "Applications", "Practice", ["x"], "calculus", ["critical points"]),
  ]),
  calculusConfig("integration", "Integration Formula Visualizer", "Integration", "/math/integration/formula-visualizer", "/formulas/integrals", "Area, accumulation, Riemann sums, and antiderivatives.", "riemann-sum", [
    formula("area-under-curve", "Integral as area", "\\int_a^b f(x)dx", "int_a^b f(x) dx", "Signed area accumulates under the curve.", "Area", "Foundation", ["a", "b"], "calculus", ["integral", "area"]),
    formula("riemann-sum", "Riemann sums", "\\sum f(x_i)\\Delta x", "sum f(x_i) Delta x", "Rectangles approximate curved area.", "Area", "Foundation", ["n"], "calculus", ["riemann"]),
    formula("antiderivative", "Antiderivative", "F'(x)=f(x)", "F'(x) = f(x)", "An antiderivative reverses differentiation.", "Antiderivatives", "Practice", ["x"], "calculus", ["antiderivative"]),
    formula("power-integration", "Power rule for integration", "\\int x^n dx=\\frac{x^{n+1}}{n+1}+C", "int x^n dx = x^(n+1)/(n+1) + C", "Increase the power and divide by the new power.", "Rules", "Practice", ["n"], "calculus", ["power rule"]),
    formula("definite-integral", "Definite integral", "\\int_a^b f(x)dx=F(b)-F(a)", "int_a^b f(x) dx = F(b) - F(a)", "Area equals change in accumulation.", "Area", "Exam", ["a", "b"], "calculus", ["definite"]),
    formula("area-between-curves", "Area between curves", "A=\\int_a^b(top-bottom)dx", "A = int_a^b (top - bottom) dx", "Subtract lower curve from upper curve.", "Applications", "Exam", ["a", "b"], "calculus", ["area between"]),
    formula("ftc", "Fundamental theorem", "\\frac{d}{dx}\\int_a^x f(t)dt=f(x)", "d/dx int_a^x f(t)dt = f(x)", "Differentiation and accumulation undo each other.", "Theorems", "Exam", ["x"], "calculus", ["FTC"]),
    formula("substitution", "Substitution intuition", "\\int f(g(x))g'(x)dx=\\int f(u)du", "int f(g(x))g'(x) dx = int f(u) du", "Change variable when inner derivative is present.", "Rules", "Advanced", ["u"], "calculus", ["substitution"]),
  ]),
  {
    id: "matrices",
    title: "Matrices Formula Visualizer",
    shortTitle: "Matrices",
    route: "/matrices/formula-visualizer",
    category: "Matrices",
    subtitle: "Matrix operations, determinants, inverse, and grid transformations.",
    description: "Edit matrix-style values and see result cells, determinant area, and transformation behavior update.",
    defaultFormulaId: "matrix-multiplication",
    formulaLibraryRoute: "/formulas/matrices",
    relatedRoutes: [
      { label: "Matrix operations", href: "/matrices" },
      { label: "Matrix transformations", href: "/math/matrix-transformations" },
      { label: "Linear algebra lab", href: "/math-lab/linear-algebra" },
    ],
    examples: sharedExamples,
    searchTerms: ["matrix formula visualizer", "determinant", "inverse matrix", "matrix multiplication"],
    formulas: [
      formula("matrix-addition", "Matrix addition", "A+B=[a_{ij}+b_{ij}]", "A + B = cell by cell sum", "Matching cells add directly.", "Operations", "Foundation", ["a", "b"], "matrix", ["addition"]),
      formula("scalar-multiplication", "Scalar multiplication", "kA=[ka_{ij}]", "kA = each cell multiplied by k", "A scalar stretches every entry.", "Operations", "Foundation", ["k"], "matrix", ["scalar"]),
      formula("matrix-multiplication", "Matrix multiplication", "(AB)_{ij}=\\sum a_{ik}b_{kj}", "(AB)ij = sum aik bkj", "Rows combine with columns.", "Operations", "Practice", ["a", "b"], "matrix", ["multiplication"]),
      formula("identity-matrix", "Identity matrix", "AI=IA=A", "AI = IA = A", "Identity leaves a matrix unchanged.", "Operations", "Foundation", ["A"], "matrix", ["identity"]),
      formula("transpose", "Transpose", "(A^T)_{ij}=A_{ji}", "transpose swaps rows and columns", "Rows become columns.", "Operations", "Foundation", ["A"], "matrix", ["transpose"]),
      formula("determinant-2x2", "2x2 determinant", "\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc", "det [[a,b],[c,d]] = ad - bc", "Determinant is signed area scale.", "Determinants", "Practice", ["a", "b", "c", "d"], "matrix", ["determinant"]),
      formula("inverse-2x2", "2x2 inverse", "A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}", "2x2 inverse formula", "Inverse exists when determinant is not zero.", "Inverse", "Exam", ["a", "b", "c", "d"], "matrix", ["inverse"], "Trying to invert when determinant is zero."),
      formula("linear-transform", "Linear transformation", "\\vec y=A\\vec x", "y = A x", "A matrix moves every vector in a predictable way.", "Transformations", "Practice", ["a", "b", "c", "d"], "matrix", ["transformation"]),
    ],
  },
  {
    id: "vectors",
    title: "Vectors Formula Visualizer",
    shortTitle: "Vectors",
    route: "/vectors/formula-visualizer",
    category: "Vectors",
    subtitle: "Vector components, dot product, cross product, projection, and angle.",
    description: "Move vector endpoints through controls and read magnitude, resultant, projection, and angle values live.",
    defaultFormulaId: "vector-addition",
    formulaLibraryRoute: "/formulas/vectors",
    relatedRoutes: [
      { label: "Vector visualizer", href: "/linear-algebra" },
      { label: "Vector proofs", href: "/visual-proofs/vectors" },
      { label: "Linear algebra lab", href: "/math-lab/linear-algebra" },
    ],
    examples: sharedExamples,
    searchTerms: ["vector formula visualizer", "dot product", "projection", "angle between vectors"],
    formulas: [
      formula("vector-addition", "Vector addition", "\\vec a+\\vec b=\\langle a_x+b_x,a_y+b_y\\rangle", "a+b = component sums", "Tip-to-tail addition gives a resultant.", "Operations", "Foundation", ["ax", "ay", "bx", "by"], "vector", ["addition"]),
      formula("scalar-vector", "Scalar multiplication", "k\\vec a=\\langle ka_x,ka_y\\rangle", "k a = scaled components", "Scalar changes length and direction if negative.", "Operations", "Foundation", ["k"], "vector", ["scalar"]),
      formula("magnitude", "Magnitude", "|\\vec a|=\\sqrt{a_x^2+a_y^2}", "|a| = sqrt(ax^2 + ay^2)", "Length comes from Pythagoras.", "Length", "Foundation", ["ax", "ay"], "vector", ["magnitude"]),
      formula("unit-vector", "Unit vector", "\\hat a=\\frac{\\vec a}{|\\vec a|}", "a-hat = a / |a|", "Normalize to length one.", "Length", "Practice", ["ax", "ay"], "vector", ["unit vector"]),
      formula("dot-product", "Dot product", "\\vec a\\cdot\\vec b=|a||b|\\cos\\theta", "a dot b = |a||b| cos theta", "Dot product measures alignment.", "Products", "Practice", ["theta"], "vector", ["dot product"]),
      formula("cross-product", "Cross product", "|\\vec a\\times\\vec b|=|a||b|\\sin\\theta", "|a x b| = |a||b| sin theta", "Cross product measures perpendicular area.", "Products", "Exam", ["theta"], "vector", ["cross product"]),
      formula("projection", "Projection", "\\mathrm{proj}_b a=\\frac{a\\cdot b}{|b|^2}b", "projection of a on b", "Projection is the shadow of one vector on another.", "Products", "Exam", ["ax", "ay", "bx", "by"], "vector", ["projection"]),
      formula("angle-between", "Angle between vectors", "\\cos\\theta=\\frac{a\\cdot b}{|a||b|}", "cos theta = dot/(magnitudes)", "Angle is recovered from normalized dot product.", "Angles", "Practice", ["theta"], "vector", ["angle"]),
      formula("direction-cosines", "Direction cosines", "l^2+m^2+n^2=1", "l^2 + m^2 + n^2 = 1", "A unit direction has squared components summing to one.", "3D", "Advanced", ["l", "m", "n"], "vector", ["3d"]),
    ],
  },
  {
    id: "probability",
    title: "Probability Formula Visualizer",
    shortTitle: "Probability",
    route: "/probability/formula-visualizer",
    category: "Probability",
    subtitle: "Venn, tree, conditional probability, Bayes, and simulations.",
    description: "Adjust event sizes and overlap to compare theoretical probability with simulated frequency.",
    defaultFormulaId: "basic-probability",
    formulaLibraryRoute: "/formulas/probability",
    relatedRoutes: [
      { label: "Statistics and probability", href: "/probability-statistics" },
      { label: "Probability lab", href: "/math-lab/probability" },
      { label: "Probability proofs", href: "/visual-proofs/probability" },
    ],
    examples: sharedExamples,
    searchTerms: ["probability formula visualizer", "conditional probability", "bayes theorem", "venn diagram probability"],
    teacherNotes: classroomNotes("Start from sample spaces and events, then introduce formulas as efficient counting of regions.", "Which part of the diagram is the condition, and which part is the event?", "Students often confuse P(A and B) with P(A or B); require a region explanation.", "Build a two-event Venn diagram and ask for union, intersection, and conditional probability.", "Create a real situation where Bayes changes the original probability.", ["Fractions", "Percent", "Sets"], ["Statistics", "Distributions"]),
    formulas: [
      formula("basic-probability", "Basic probability", "P(E)=\\frac{favorable}{total}", "P(E)=favorable/total", "Probability compares favorable outcomes to total outcomes.", "Basics", "Foundation", ["favorable", "total"], "probability", ["probability"]),
      formula("complement", "Complement rule", "P(E')=1-P(E)", "P(not E)=1-P(E)", "Everything outside E is its complement.", "Rules", "Foundation", ["P(E)"], "probability", ["complement"]),
      formula("addition-rule", "Addition rule", "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)", "P(A or B)=P(A)+P(B)-P(A and B)", "Subtract overlap counted twice.", "Rules", "Practice", ["A", "B"], "probability", ["addition"]),
      formula("multiplication-rule", "Multiplication rule", "P(A\\cap B)=P(A)P(B|A)", "P(A and B)=P(A)P(B given A)", "Branch probabilities multiply along a path.", "Rules", "Practice", ["A", "B"], "probability", ["multiplication"]),
      formula("conditional", "Conditional probability", "P(A|B)=\\frac{P(A\\cap B)}{P(B)}", "P(A|B)=P(A and B)/P(B)", "Restrict the sample space to B.", "Conditional", "Exam", ["A", "B"], "probability", ["conditional"]),
      formula("bayes", "Bayes theorem", "P(A|B)=\\frac{P(B|A)P(A)}{P(B)}", "Bayes theorem", "Reverse a conditional probability using evidence.", "Conditional", "Exam", ["A", "B"], "probability", ["bayes"]),
      formula("independent", "Independent events", "P(A\\cap B)=P(A)P(B)", "P(A and B)=P(A)P(B)", "Independent events do not change each other.", "Independence", "Practice", ["A", "B"], "probability", ["independence"]),
      formula("expected-value", "Expected value", "E(X)=\\sum xP(x)", "E(X)=sum xP(x)", "Average outcome over many repetitions.", "Random Variables", "Practice", ["x", "P"], "probability", ["expected value"]),
    ],
  },
  {
    id: "statistics",
    title: "Statistics Formula Visualizer",
    shortTitle: "Statistics",
    route: "/statistics/formula-visualizer",
    category: "Statistics",
    subtitle: "Mean, median, variance, standard deviation, quartiles, z-score, and regression.",
    description: "Edit a compact dataset with sliders and watch center, spread, box plot, and z-score visuals update.",
    defaultFormulaId: "mean",
    formulaLibraryRoute: "/formulas/statistics",
    relatedRoutes: [
      { label: "Statistics and probability", href: "/probability-statistics" },
      { label: "Data workspace", href: "/workspace/data" },
      { label: "Statistics proofs", href: "/visual-proofs/statistics" },
    ],
    examples: sharedExamples,
    searchTerms: ["statistics formula visualizer", "mean median mode", "variance standard deviation", "box plot"],
    teacherNotes: classroomNotes("Use one small data set throughout so students see how center and spread tell different stories.", "What changes when one outlier moves?", "Students often think mean is always typical; compare it with median on skewed data.", "Move one value and ask which measures change first.", "Design two data sets with the same mean but different standard deviation.", ["Data tables", "Averages"], ["Probability distributions", "Regression"]),
    formulas: [
      formula("mean", "Mean", "\\bar x=\\frac{\\sum x_i}{n}", "mean = sum values / n", "Mean balances the dataset.", "Center", "Foundation", ["data"], "statistics", ["mean"]),
      formula("median", "Median", "middle\\ value", "median = middle value", "Median splits ordered data in half.", "Center", "Foundation", ["data"], "statistics", ["median"]),
      formula("mode", "Mode", "most\\ frequent\\ value", "mode = most frequent value", "Mode is the most common value.", "Center", "Foundation", ["data"], "statistics", ["mode"]),
      formula("range", "Range", "R=max-min", "range = max - min", "Range measures full spread.", "Spread", "Foundation", ["data"], "statistics", ["range"]),
      formula("variance", "Variance", "\\sigma^2=\\frac{\\sum(x_i-\\mu)^2}{n}", "variance = average squared deviation", "Variance squares distances from mean.", "Spread", "Practice", ["data"], "statistics", ["variance"]),
      formula("standard-deviation", "Standard deviation", "\\sigma=\\sqrt{\\sigma^2}", "standard deviation = sqrt variance", "Standard deviation returns spread to original units.", "Spread", "Practice", ["data"], "statistics", ["standard deviation"]),
      formula("quartiles", "Quartiles", "Q_1,Q_2,Q_3", "quartiles split data into quarters", "Quartiles divide sorted data into four parts.", "Spread", "Practice", ["data"], "statistics", ["quartiles"]),
      formula("iqr", "Interquartile range", "IQR=Q_3-Q_1", "IQR = Q3 - Q1", "IQR measures middle-half spread.", "Spread", "Practice", ["data"], "statistics", ["IQR"]),
      formula("z-score", "Z-score", "z=\\frac{x-\\mu}{\\sigma}", "z = (x - mean) / standard deviation", "Z-score measures distance in standard deviations.", "Standardization", "Exam", ["x"], "statistics", ["z-score"]),
      formula("correlation", "Correlation", "r=\\frac{cov(x,y)}{\\sigma_x\\sigma_y}", "correlation = covariance / standard deviations", "Correlation measures linear association.", "Relationships", "Advanced", ["x", "y"], "statistics", ["correlation"]),
      formula("regression", "Regression line", "\\hat y=mx+c", "y-hat = mx + c", "Regression predicts with a best-fit line.", "Relationships", "Advanced", ["m", "c"], "statistics", ["regression"]),
    ],
  },
  {
    id: "mensuration",
    title: "Mensuration Formula Visualizer",
    shortTitle: "Mensuration",
    route: "/mensuration/formula-visualizer",
    category: "Mensuration",
    subtitle: "2D area, perimeter, 3D volume, surface area, and unit conversions.",
    description: "Use dimensions and unit controls to compare area, volume, surface area, and real-world scale.",
    defaultFormulaId: "rectangle-area",
    formulaLibraryRoute: "/formulas/mensuration-units",
    relatedRoutes: [
      { label: "Shapes explorer", href: "/shapes" },
      { label: "3D workspace", href: "/workspace/3d" },
      { label: "Mensuration proofs", href: "/visual-proofs/mensuration" },
    ],
    examples: sharedExamples,
    searchTerms: ["mensuration formula visualizer", "area volume surface area", "cylinder cone sphere", "unit conversion"],
    formulas: [
      formula("rectangle-area", "Rectangle area", "A=lw", "A = length * width", "Area counts square units inside the rectangle.", "2D", "Foundation", ["l", "w"], "mensuration", ["rectangle"]),
      formula("rectangle-perimeter", "Rectangle perimeter", "P=2(l+w)", "P = 2(l+w)", "Perimeter is distance around the rectangle.", "2D", "Foundation", ["l", "w"], "mensuration", ["perimeter"]),
      formula("triangle-area", "Triangle area", "A=\\frac{1}{2}bh", "A = 1/2 base height", "A triangle is half a matching rectangle.", "2D", "Foundation", ["b", "h"], "mensuration", ["triangle"]),
      formula("circle-area", "Circle area", "A=\\pi r^2", "A = pi r^2", "Circle area grows by radius squared.", "2D", "Foundation", ["r"], "mensuration", ["circle"]),
      formula("cuboid-volume", "Cuboid volume", "V=lwh", "V = l*w*h", "Volume counts unit cubes.", "3D", "Practice", ["l", "w", "h"], "mensuration", ["cuboid"]),
      formula("cube-surface-area", "Cube surface area", "S=6a^2", "S = 6a^2", "A cube has six equal square faces.", "3D", "Practice", ["a"], "mensuration", ["cube"]),
      formula("cylinder-volume", "Cylinder volume", "V=\\pi r^2h", "V = pi r^2 h", "Stack circular layers to make volume.", "3D", "Practice", ["r", "h"], "mensuration", ["cylinder"]),
      formula("cone-volume", "Cone volume", "V=\\frac{1}{3}\\pi r^2h", "V = 1/3 pi r^2 h", "A cone is one third of its matching cylinder.", "3D", "Exam", ["r", "h"], "mensuration", ["cone"]),
      formula("sphere-volume", "Sphere volume", "V=\\frac{4}{3}\\pi r^3", "V = 4/3 pi r^3", "Sphere volume scales with radius cubed.", "3D", "Exam", ["r"], "mensuration", ["sphere"]),
      formula("unit-conversion", "Unit conversion", "1m=100cm=1000mm", "1 m = 100 cm = 1000 mm", "Units must match before measuring.", "Units", "Foundation", ["unit"], "mensuration", ["units"]),
    ],
  },
  phase2Config("number-systems", "Number Systems Formula Visualizer", "Number Systems", "/number-systems/formula-visualizer", "/formulas/number-systems", "Classify, factor, divide, and locate numbers on a live number-line model.", "prime-factorization", "number-system", [
    formula("prime-factorization", "Prime factorization", "n=p_1^{a_1}p_2^{a_2}\\cdots", "n = product of prime powers", "Break a number into prime building blocks.", "Factors", "Foundation", ["n"], "number-system", ["prime", "factor tree"], "Stopping at a composite factor instead of primes."),
    formula("hcf-gcd", "HCF / GCD", "\\gcd(a,b)", "greatest common divisor", "The largest factor shared by two numbers.", "Factors", "Foundation", ["a", "b"], "number-system", ["gcd", "hcf"]),
    formula("lcm", "LCM", "\\operatorname{lcm}(a,b)=\\frac{|ab|}{\\gcd(a,b)}", "lcm = |ab| / gcd", "The first common multiple appears after dividing out overlap.", "Multiples", "Practice", ["a", "b"], "number-system", ["lcm"]),
    formula("euclid-division", "Euclid division lemma", "a=bq+r,\\ 0\\le r<b", "a = bq + r", "Division separates quotient and remainder.", "Division", "Foundation", ["a", "b"], "number-system", ["division lemma"]),
    formula("decimal-terminating", "Terminating decimal test", "q=2^m5^n", "denominator has only 2 and 5 factors", "Fractions terminate when the denominator only uses 2s and 5s.", "Decimals", "Practice", ["q"], "number-system", ["decimal expansion"]),
    formula("rational-form", "Rational number", "x=\\frac{p}{q},\\ q\\ne0", "x = p/q, q not zero", "Rational numbers can be written as a fraction.", "Classification", "Foundation", ["p", "q"], "number-system", ["rational"]),
    formula("irrational-root", "Irrational square root", "\\sqrt p\\notin\\mathbb Q\\ (p\\ prime)", "sqrt prime is irrational", "Prime square roots cannot simplify to fractions.", "Classification", "Practice", ["p"], "number-system", ["irrational"]),
    formula("divisibility-9", "Divisibility by 9", "9\\mid n\\iff9\\mid\\sum digits", "9 divides n iff 9 divides digit sum", "Place-value remainders make the digit-sum test work.", "Divisibility", "Foundation", ["n"], "number-system", ["divisibility"]),
  ]),
  phase2Config("complex-numbers", "Complex Numbers Formula Visualizer", "Complex Numbers", "/complex-numbers/formula-visualizer", "/formulas/complex-numbers", "Plot complex numbers, modulus, argument, conjugates, polar form, powers, and roots.", "complex-modulus", "complex", [
    formula("complex-form", "Standard form", "z=a+bi", "z = a + bi", "Real and imaginary parts locate a point on the complex plane.", "Basics", "Foundation", ["a", "b"], "complex", ["complex plane"]),
    formula("complex-modulus", "Modulus", "|z|=\\sqrt{a^2+b^2}", "|z| = sqrt(a^2+b^2)", "Modulus is distance from the origin.", "Geometry", "Foundation", ["a", "b"], "complex", ["modulus"]),
    formula("argument", "Argument", "\\theta=\\tan^{-1}\\frac{b}{a}", "theta = atan(b/a)", "Argument is the direction angle.", "Geometry", "Practice", ["a", "b"], "complex", ["argument"], "Ignoring the quadrant when finding the angle."),
    formula("conjugate", "Conjugate", "\\overline z=a-bi", "conjugate z = a - bi", "Conjugation reflects across the real axis.", "Operations", "Foundation", ["a", "b"], "complex", ["conjugate"]),
    formula("multiply-complex", "Multiplication", "z_1z_2=r_1r_2\\operatorname{cis}(\\theta_1+\\theta_2)", "multiply moduli and add angles", "Multiplication scales and rotates.", "Operations", "Practice", ["r", "theta"], "complex", ["multiplication rotation"]),
    formula("polar-form", "Polar form", "z=r(\\cos\\theta+i\\sin\\theta)", "z = r(cos theta + i sin theta)", "Polar form stores length and direction.", "Polar", "Practice", ["r", "theta"], "complex", ["polar"]),
    formula("euler", "Euler form", "e^{i\\theta}=\\cos\\theta+i\\sin\\theta", "e^(i theta) = cos theta + i sin theta", "Euler form links rotation to exponential notation.", "Polar", "Advanced", ["theta"], "complex", ["euler"]),
    formula("de-moivre", "De Moivre", "(r\\operatorname{cis}\\theta)^n=r^n\\operatorname{cis}(n\\theta)", "(r cis theta)^n = r^n cis n theta", "Powers multiply the angle.", "Powers", "Exam", ["r", "n"], "complex", ["de moivre"]),
    formula("roots-complex", "nth roots", "z_k=r^{1/n}\\operatorname{cis}\\frac{\\theta+2k\\pi}{n}", "complex nth roots", "Roots spread evenly around a circle.", "Roots", "Exam", ["r", "n"], "complex", ["roots"]),
  ]),
  phase2Config("sequences-series", "Sequences and Series Formula Visualizer", "Sequences & Series", "/sequences-series/formula-visualizer", "/formulas/sequences-series", "Compare terms, partial sums, recursive rules, and growth patterns.", "ap-nth-term", "sequence", [
    formula("ap-nth-term", "AP nth term", "a_n=a+(n-1)d", "a_n = a + (n-1)d", "Equal differences create a straight-line sequence.", "AP", "Foundation", ["a", "d", "n"], "sequence", ["ap"]),
    formula("ap-sum", "AP sum", "S_n=\\frac n2[2a+(n-1)d]", "AP sum", "Pairing first and last terms builds the sum.", "AP", "Practice", ["a", "d", "n"], "sequence", ["ap sum"]),
    formula("gp-nth-term", "GP nth term", "a_n=ar^{n-1}", "a_n = a r^(n-1)", "Equal ratios make exponential growth.", "GP", "Foundation", ["a", "r", "n"], "sequence", ["gp"]),
    formula("gp-sum", "GP sum", "S_n=a\\frac{r^n-1}{r-1}", "finite GP sum", "Each term is a scaled copy of the last.", "GP", "Practice", ["a", "r", "n"], "sequence", ["gp sum"]),
    formula("infinite-gp", "Infinite GP", "S_\\infty=\\frac a{1-r},\\ |r|<1", "infinite GP sum", "A shrinking GP approaches a limit.", "GP", "Exam", ["a", "r"], "sequence", ["infinite gp"], "Using the formula when |r| is not less than 1."),
    formula("hp", "Harmonic progression", "\\frac1{a_n}\\text{ is AP}", "reciprocals form AP", "HP becomes clearer by taking reciprocals.", "HP", "Practice", ["a", "d", "n"], "sequence", ["hp"]),
    formula("fibonacci", "Fibonacci recurrence", "F_n=F_{n-1}+F_{n-2}", "next term is sum of previous two", "A recursive sequence depends on earlier terms.", "Recursive", "Foundation", ["n"], "sequence", ["fibonacci"]),
    formula("sum-n", "Sum of first n numbers", "\\sum_{k=1}^n k=\\frac{n(n+1)}2", "sum 1 to n", "Pairing opposite terms gives equal totals.", "Sigma", "Foundation", ["n"], "sequence", ["sigma"]),
    formula("sum-squares", "Sum of squares", "\\sum_{k=1}^n k^2=\\frac{n(n+1)(2n+1)}6", "sum of squares", "Square sums grow cubically.", "Sigma", "Exam", ["n"], "sequence", ["squares"]),
    formula("sum-cubes", "Sum of cubes", "\\sum_{k=1}^n k^3=\\left(\\frac{n(n+1)}2\\right)^2", "sum of cubes", "Cube sums are the square of triangular numbers.", "Sigma", "Exam", ["n"], "sequence", ["cubes"]),
  ]),
  phase2Config("combinatorics", "Combinatorics Formula Visualizer", "Combinatorics", "/combinatorics/formula-visualizer", "/formulas/combinatorics", "Count arrangements, selections, repetitions, Pascal patterns, and inclusion-exclusion.", "combination", "combinatorics", [
    formula("factorial", "Factorial", "n!=n(n-1)\\cdots1", "n factorial", "Factorial counts ordered arrangements of n distinct objects.", "Basics", "Foundation", ["n"], "combinatorics", ["factorial"]),
    formula("permutation", "Permutation", "{}^nP_r=\\frac{n!}{(n-r)!}", "nPr", "Permutations count selections where order matters.", "Permutations", "Practice", ["n", "r"], "combinatorics", ["permutation"]),
    formula("combination", "Combination", "{}^nC_r=\\frac{n!}{r!(n-r)!}", "nCr", "Combinations count selections where order does not matter.", "Combinations", "Practice", ["n", "r"], "combinatorics", ["combination"], "Using permutation when order does not matter."),
    formula("repetition", "Combinations with repetition", "{}^{n+r-1}C_r", "n+r-1 choose r", "Stars and bars distributes repeated choices.", "Combinations", "Exam", ["n", "r"], "combinatorics", ["repetition"]),
    formula("circular", "Circular permutations", "(n-1)!", "circular arrangements", "Rotations of a circle are counted once.", "Permutations", "Exam", ["n"], "combinatorics", ["circular"]),
    formula("multinomial", "Multinomial", "\\frac{n!}{n_1!n_2!\\cdots n_k!}", "multinomial coefficient", "Repeated groups divide out duplicate arrangements.", "Permutations", "Advanced", ["n"], "combinatorics", ["multinomial"]),
    formula("binomial", "Binomial theorem", "(a+b)^n=\\sum{}^nC_ra^{n-r}b^r", "binomial expansion", "Pascal coefficients weight each term.", "Binomial", "Exam", ["a", "b", "n"], "combinatorics", ["binomial"]),
    formula("pascal", "Pascal identity", "{}^nC_r={} ^{n-1}C_{r-1}+{}^{n-1}C_r", "Pascal identity", "Each entry adds the two above it.", "Binomial", "Practice", ["n", "r"], "combinatorics", ["pascal"]),
    formula("inclusion-exclusion", "Inclusion-exclusion", "|A\\cup B|=|A|+|B|-|A\\cap B|", "union count", "Subtract overlap counted twice.", "Counting", "Foundation", ["A", "B"], "combinatorics", ["inclusion exclusion"]),
  ]),
  phase2Config("set-theory", "Set Theory and Logic Formula Visualizer", "Set Theory & Logic", "/set-theory/formula-visualizer", "/formulas/set-theory", "Use Venn regions and truth tables to connect set laws with logic statements.", "set-union", "set-logic", [
    formula("set-union", "Union", "A\\cup B", "A union B", "Union includes anything in A or B.", "Sets", "Foundation", ["A", "B"], "set-logic", ["union"]),
    formula("set-intersection", "Intersection", "A\\cap B", "A intersection B", "Intersection includes only overlap.", "Sets", "Foundation", ["A", "B"], "set-logic", ["intersection"]),
    formula("set-difference", "Difference", "A-B", "A minus B", "Difference removes B from A.", "Sets", "Foundation", ["A", "B"], "set-logic", ["difference"]),
    formula("de-morgan-union", "De Morgan union", "(A\\cup B)'=A'\\cap B'", "not A or B = not A and not B", "Negating a union turns it into intersection of complements.", "Laws", "Practice", ["A", "B"], "set-logic", ["de morgan"]),
    formula("cardinality-union", "Cardinality", "n(A\\cup B)=n(A)+n(B)-n(A\\cap B)", "count union", "Overlap is counted twice unless subtracted.", "Counting", "Practice", ["A", "B"], "set-logic", ["cardinality"]),
    formula("cartesian-product", "Cartesian product", "|A\\times B|=|A||B|", "ordered pair count", "Each element of A pairs with each element of B.", "Relations", "Foundation", ["A", "B"], "set-logic", ["cartesian"]),
    formula("implication", "Implication", "p\\Rightarrow q\\equiv \\neg p\\vee q", "p implies q", "An implication is false only when p is true and q is false.", "Logic", "Practice", ["p", "q"], "set-logic", ["truth table"], "Treating false implies true as false."),
    formula("biconditional", "Biconditional", "p\\Leftrightarrow q", "p iff q", "Both statements must have the same truth value.", "Logic", "Practice", ["p", "q"], "set-logic", ["biconditional"]),
    formula("contrapositive", "Contrapositive", "p\\Rightarrow q\\equiv \\neg q\\Rightarrow\\neg p", "contrapositive", "A statement and its contrapositive always match.", "Logic", "Exam", ["p", "q"], "set-logic", ["contrapositive"]),
  ]),
  phase2Config("relations-functions", "Relations and Functions Formula Visualizer", "Relations & Functions", "/relations-functions/formula-visualizer", "/formulas/relations-functions", "Test mapping diagrams, composition, inverse functions, transformations, and graph behavior.", "function-notation", "function", [
    formula("function-notation", "Function notation", "y=f(x)", "y = f(x)", "A function assigns each input exactly one output.", "Basics", "Foundation", ["x"], "function", ["function notation"]),
    formula("domain-range", "Domain and range", "x\\in D,\\ f(x)\\in R", "inputs and outputs", "Domain feeds the function; range is what comes out.", "Basics", "Foundation", ["x"], "function", ["domain range"]),
    formula("composition", "Composition", "(f\\circ g)(x)=f(g(x))", "f of g of x", "The output of g becomes the input of f.", "Operations", "Practice", ["x"], "function", ["composition"], "Applying the functions in the wrong order."),
    formula("inverse", "Inverse function", "f^{-1}(f(x))=x", "inverse undoes function", "Inverse functions reverse inputs and outputs.", "Operations", "Exam", ["x"], "function", ["inverse"]),
    formula("one-one", "One-one test", "f(x_1)=f(x_2)\\Rightarrow x_1=x_2", "same output means same input", "One-one functions do not reuse outputs.", "Types", "Practice", ["x"], "function", ["one-one"]),
    formula("onto", "Onto", "\\operatorname{Range}(f)=\\operatorname{Codomain}", "range equals codomain", "Onto functions hit every allowed output.", "Types", "Practice", ["x"], "function", ["onto"]),
    formula("linear-function", "Linear function", "f(x)=mx+c", "f(x)=mx+c", "A constant rate of change makes a line.", "Families", "Foundation", ["m", "c"], "function", ["linear"]),
    formula("quadratic-function", "Quadratic function", "f(x)=ax^2+bx+c", "quadratic function", "A squared term bends the graph into a parabola.", "Families", "Practice", ["a", "b", "c"], "function", ["quadratic"]),
    formula("transformation", "Transformation", "g(x)=af(b(x-h))+k", "transform function", "Parameters stretch, reflect, and shift a graph.", "Transformations", "Exam", ["a", "b", "h", "k"], "function", ["transformations"]),
    formula("vertical-line", "Vertical line test", "\\text{one }y\\text{ for each }x", "vertical line test", "A graph is a function if vertical lines hit once.", "Graphs", "Foundation", ["x"], "function", ["vertical line test"]),
  ]),
  phase2Config("linear-programming", "Linear Programming Formula Visualizer", "Linear Programming", "/linear-programming/formula-visualizer", "/formulas/linear-programming", "Build feasible regions, inspect corners, and optimize objective functions.", "objective-function", "linear-programming", [
    formula("objective-function", "Objective function", "Z=ax+by", "Z = ax + by", "Optimization chooses values of x and y to maximize or minimize Z.", "Objective", "Foundation", ["a", "b"], "linear-programming", ["objective"]),
    formula("constraint", "Linear constraint", "px+qy\\le r", "linear inequality constraint", "A constraint keeps the solution on one side of a line.", "Constraints", "Foundation", ["p", "q", "r"], "linear-programming", ["constraint"]),
    formula("nonnegative", "Non-negative restrictions", "x\\ge0,\\ y\\ge0", "x and y nonnegative", "Real production quantities cannot be negative.", "Constraints", "Foundation", ["x", "y"], "linear-programming", ["nonnegative"]),
    formula("feasible-region", "Feasible region", "\\bigcap\\text{ half-planes}", "intersection of half-planes", "All constraints overlap to form possible solutions.", "Graphical", "Practice", ["x", "y"], "linear-programming", ["feasible region"]),
    formula("corner-method", "Corner point method", "Z_{max/min}\\text{ occurs at a vertex}", "test corner points", "For linear objectives, the best value occurs at a corner when bounded.", "Optimization", "Exam", ["x", "y"], "linear-programming", ["corner method"]),
    formula("slack", "Slack variable", "px+qy+s=r", "slack variable", "Slack measures unused resource.", "Standard Form", "Practice", ["s"], "linear-programming", ["slack"]),
    formula("infeasible", "Infeasible case", "F=\\varnothing", "empty feasible set", "Contradicting constraints leave no solution.", "Special Cases", "Practice", ["F"], "linear-programming", ["infeasible"]),
    formula("unbounded", "Unbounded case", "Z\\to\\infty", "objective grows without bound", "An open feasible region may not have a maximum.", "Special Cases", "Exam", ["Z"], "linear-programming", ["unbounded"], "Assuming every LPP has both a max and min."),
  ]),
  phase2Config("polynomials", "Polynomials Formula Visualizer", "Polynomials", "/polynomials/formula-visualizer", "/formulas/polynomials", "Inspect degree, roots, factors, division, multiplicity, and graph shape.", "polynomial-standard", "polynomial", [
    formula("polynomial-standard", "Standard form", "p(x)=a_nx^n+\\cdots+a_0", "polynomial standard form", "Terms are ordered by descending powers.", "Basics", "Foundation", ["a", "n"], "polynomial", ["standard form"]),
    formula("degree", "Degree", "\\deg p=n\\text{ where }a_n\\ne0", "highest nonzero power", "Degree predicts end behavior and maximum roots.", "Basics", "Foundation", ["n"], "polynomial", ["degree"]),
    formula("remainder-theorem", "Remainder theorem", "p(x)\\div(x-a)\\Rightarrow remainder=p(a)", "remainder is p(a)", "Substitution gives the remainder directly.", "Theorems", "Practice", ["a"], "polynomial", ["remainder theorem"]),
    formula("factor-theorem", "Factor theorem", "p(a)=0\\iff(x-a)\\text{ is a factor}", "p(a)=0 iff factor", "A zero of the polynomial gives a linear factor.", "Theorems", "Practice", ["a"], "polynomial", ["factor theorem"], "Confusing p(a)=0 with quotient zero."),
    formula("division-algorithm", "Polynomial division", "p(x)=d(x)q(x)+r(x)", "dividend = divisor quotient + remainder", "Division separates a polynomial into quotient and remainder.", "Division", "Exam", ["x"], "polynomial", ["division"]),
    formula("roots-sum", "Sum of roots", "\\alpha+\\beta=-\\frac ba", "sum roots = -b/a", "Coefficients encode root relationships.", "Roots", "Practice", ["a", "b"], "polynomial", ["roots"]),
    formula("roots-product", "Product of roots", "\\alpha\\beta=\\frac ca", "product roots = c/a", "The constant term helps determine root product.", "Roots", "Practice", ["a", "c"], "polynomial", ["roots"]),
    formula("multiplicity", "Multiplicity", "p(x)=(x-a)^m q(x)", "root repeated m times", "Multiplicity controls whether the graph crosses or touches.", "Roots", "Exam", ["m"], "polynomial", ["multiplicity"]),
    formula("end-behavior", "End behavior", "a_nx^n\\text{ dominates}", "leading term dominates", "The leading term controls far-left and far-right shape.", "Graphs", "Practice", ["a", "n"], "polynomial", ["end behavior"]),
  ]),
  phase2Config("inequalities", "Inequalities Formula Visualizer", "Inequalities", "/inequalities/formula-visualizer", "/formulas/inequalities", "Solve, graph, shade, and compare inequalities across number lines and planes.", "linear-inequality", "inequality", [
    formula("linear-inequality", "Linear inequality", "ax+b<c", "ax+b < c", "A boundary point splits the number line.", "Linear", "Foundation", ["a", "b", "c"], "inequality", ["linear"]),
    formula("sign-reversal", "Sign reversal", "a<b\\Rightarrow -a>-b", "multiply by negative flips sign", "Multiplying by a negative reverses order.", "Rules", "Foundation", ["a", "b"], "inequality", ["sign reversal"], "Forgetting to flip the inequality sign."),
    formula("compound-and", "Compound inequality", "a<x<b", "x between a and b", "AND inequalities create an overlap interval.", "Compound", "Practice", ["a", "b"], "inequality", ["compound"]),
    formula("absolute-value", "Absolute value inequality", "|x-a|<r", "distance from a less than r", "Absolute value measures distance from a center.", "Absolute Value", "Practice", ["a", "r"], "inequality", ["absolute value"]),
    formula("quadratic-inequality", "Quadratic inequality", "ax^2+bx+c\\ge0", "quadratic inequality", "Roots divide the line into sign intervals.", "Quadratic", "Exam", ["a", "b", "c"], "inequality", ["quadratic"]),
    formula("interval-notation", "Interval notation", "(a,b],\\ [a,\\infty)", "interval notation", "Brackets show whether endpoints are included.", "Notation", "Foundation", ["a", "b"], "inequality", ["interval"]),
    formula("half-plane", "Half-plane", "y\\le mx+c", "shade below or on the line", "A linear inequality shades one side of its boundary.", "Graphing", "Practice", ["m", "c"], "inequality", ["half-plane"]),
    formula("am-gm", "AM-GM", "\\frac{a+b}{2}\\ge\\sqrt{ab}", "arithmetic mean >= geometric mean", "The average is at least the equal-area mean for positives.", "Classical", "Advanced", ["a", "b"], "inequality", ["am-gm"]),
    formula("triangle-inequality", "Triangle inequality", "|a+b|\\le |a|+|b|", "triangle inequality", "Going directly is no longer than detouring.", "Classical", "Practice", ["a", "b"], "inequality", ["triangle inequality"]),
  ]),
  phase2Config("probability-distributions", "Probability Distributions Formula Visualizer", "Probability Distributions", "/probability-distributions/formula-visualizer", "/formulas/probability-distributions", "Compare discrete and continuous distributions with parameters, means, variances, and simulation intuition.", "binomial-distribution", "distribution", [
    formula("bernoulli", "Bernoulli", "P(X=1)=p,\\ P(X=0)=1-p", "single success/failure trial", "Bernoulli models one yes-or-no trial.", "Discrete", "Foundation", ["p"], "distribution", ["bernoulli"]),
    formula("binomial-distribution", "Binomial", "P(X=k)={}^nC_kp^k(1-p)^{n-k}", "binomial probability", "Binomial counts successes in n independent trials.", "Discrete", "Practice", ["n", "p"], "distribution", ["binomial"], "Using binomial when trials are not independent."),
    formula("geometric", "Geometric", "P(X=k)=(1-p)^{k-1}p", "first success on k", "Geometric waits for the first success.", "Discrete", "Practice", ["p", "k"], "distribution", ["geometric"]),
    formula("poisson", "Poisson", "P(X=k)=e^{-\\lambda}\\frac{\\lambda^k}{k!}", "Poisson probability", "Poisson counts rare events in a fixed interval.", "Discrete", "Exam", ["lambda", "k"], "distribution", ["poisson"]),
    formula("uniform", "Uniform", "f(x)=\\frac1{b-a}", "uniform density", "Every value in the interval has equal density.", "Continuous", "Foundation", ["a", "b"], "distribution", ["uniform"]),
    formula("normal", "Normal distribution", "f(x)=\\frac1{\\sigma\\sqrt{2\\pi}}e^{-\\frac12((x-\\mu)/\\sigma)^2}", "normal density", "The bell curve is centered at mean and spread by standard deviation.", "Continuous", "Practice", ["mu", "sigma"], "distribution", ["normal"]),
    formula("z-score", "Z-score", "z=\\frac{x-\\mu}{\\sigma}", "standard score", "Z-score converts raw values to standard deviations.", "Standardization", "Foundation", ["x", "mu", "sigma"], "distribution", ["z-score"]),
    formula("expected-value", "Expected value", "E(X)=\\sum xP(X=x)", "weighted mean", "Expectation is a long-run average.", "Moments", "Practice", ["x", "p"], "distribution", ["expected value"]),
    formula("variance", "Variance", "\\operatorname{Var}(X)=E(X^2)-[E(X)]^2", "variance shortcut", "Variance measures squared spread.", "Moments", "Practice", ["x"], "distribution", ["variance"]),
    formula("cdf", "CDF", "F(x)=P(X\\le x)", "cumulative probability", "CDF accumulates probability up to x.", "Cumulative", "Practice", ["x"], "distribution", ["cdf"]),
  ]),
  ...phase3FormulaVisualizerConfigs,
];

function calculusConfig(
  id: string,
  title: string,
  shortTitle: string,
  route: string,
  formulaLibraryRoute: string,
  description: string,
  defaultFormulaId: string,
  formulas: FormulaVisualizerEntry[],
): FormulaVisualizerRouteConfig {
  return {
    id,
    title,
    shortTitle,
    route,
    category: "Calculus",
    subtitle: description,
    description: "Adjust function and interval parameters while the graph, formula substitution, and explanation update together.",
    defaultFormulaId,
    formulaLibraryRoute,
    relatedRoutes: [
      { label: "Calculus hub", href: "/calculus" },
      { label: shortTitle, href: id === "derivatives" ? "/math/derivatives" : "/math/integration" },
      { label: "Calculus visual proofs", href: "/visual-proofs/calculus" },
    ],
    examples: sharedExamples,
    searchTerms: [`${id} formula visualizer`, "calculus visualizer", "formula graph"],
    formulas,
    teacherNotes: id === "derivatives"
      ? classroomNotes("Explain derivatives as local rate first, then connect rules to faster calculation.", "Where does the tangent line best show increasing or decreasing behavior?", "Students often treat h as a fixed number in the limit; emphasize h shrinking toward zero.", "Compare secant slopes for three h-values and predict the tangent slope.", "Explain the chain rule using an inner and outer machine.", ["Functions", "Slope", "Limits"], ["Optimization", "Differential equations"])
      : classroomNotes("Explain integration as accumulation: area, total change, and antiderivative are connected views.", "When should an answer be signed area rather than ordinary area?", "Students may forget the constant of integration; ask what family of graphs share the same derivative.", "Use Riemann rectangles to estimate area, then increase n.", "Compare left, right, and midpoint estimates for one curve.", ["Functions", "Area", "Derivatives"], ["Applications of integration", "Differential equations"]),
  };
}

function phase2Config(
  id: string,
  title: string,
  shortTitle: string,
  route: string,
  formulaLibraryRoute: string,
  subtitle: string,
  defaultFormulaId: string,
  visualizerType: FormulaVisualizerType,
  formulas: FormulaVisualizerEntry[],
): FormulaVisualizerRouteConfig {
  return {
    id,
    title,
    shortTitle,
    route,
    category: shortTitle,
    subtitle,
    description: `${shortTitle} formulas with compact visual models, live controls, worked examples, common mistakes, and practice checks.`,
    defaultFormulaId,
    formulaLibraryRoute,
    relatedRoutes: [
      { label: "Formula library", href: formulaLibraryRoute },
      { label: "NCERT dashboard", href: "/ncert" },
      { label: "Math workspace", href: "/workspace" },
    ],
    examples: [
      { title: "Foundation check", description: "Small positive values for clear first-pass reading.", values: { a: 2, b: 3, c: 1, n: 5, p: 40 } },
      { title: "Boundary test", description: "A near-edge setup that exposes restrictions and common mistakes.", values: { a: -2, b: 4, c: 0, n: 9, p: 80 } },
      { title: "Exam-style values", description: "Integer-friendly values for substitution and mental checking.", values: { a: 4, b: 2, c: 3, n: 6, p: 25 } },
    ],
    formulas,
    searchTerms: [
      `${shortTitle} formula visualizer`,
      `${shortTitle} visual formulas`,
      `${shortTitle} interactive formula lab`,
      ...formulas.flatMap((item) => [item.title, ...item.tags]),
    ],
  };
}

function formula(
  id: string,
  title: string,
  latex: string,
  plainText: string,
  description: string,
  group: string,
  difficulty: FormulaVisualizerDifficulty,
  variables: string[],
  visualizerType: FormulaVisualizerType,
  tags: string[],
  commonMistake?: string,
): FormulaVisualizerEntry {
  return { id, title, latex, plainText, description, group, difficulty, variables, visualizerType, tags, commonMistake };
}

function classroomNotes(
  quickBoardExplanation: string,
  discussionPrompt: string,
  misconceptionPrompt: string,
  fiveMinuteActivity: string,
  practiceChallenge: string,
  prerequisites: string[],
  nextConcepts: string[],
): FormulaVisualizerRouteConfig["teacherNotes"] {
  return { quickBoardExplanation, discussionPrompt, misconceptionPrompt, fiveMinuteActivity, practiceChallenge, prerequisites, nextConcepts };
}

export const visualFormulaMenuLinks = formulaVisualizerConfigs.map((config) => ({
  title: config.shortTitle,
  route: config.route,
  searchTerms: config.searchTerms,
}));

export const formulaVisualizerCategoryRouteMap: Record<string, string> = {
  algebra: "/algebra/formula-visualizer",
  polynomials: "/polynomials/formula-visualizer",
  geometry: "/geometry/formula-visualizer",
  "euclidean-geometry-theorems": "/geometry/formula-visualizer",
  "coordinate-geometry": "/coordinate-geometry/formula-visualizer",
  derivatives: "/math/derivatives/formula-visualizer",
  "limits-continuity": "/math/derivatives/formula-visualizer",
  integration: "/math/integration/formula-visualizer",
  integrals: "/math/integration/formula-visualizer",
  matrices: "/matrices/formula-visualizer",
  determinants: "/matrices/formula-visualizer",
  vectors: "/vectors/formula-visualizer",
  probability: "/probability/formula-visualizer",
  statistics: "/statistics/formula-visualizer",
  mensuration: "/mensuration/formula-visualizer",
  "mensuration-units": "/mensuration/formula-visualizer",
  trigonometry: "/trigonometry/formula-visualizer",
  "number-systems": "/number-systems/formula-visualizer",
  "fractals-solid-views": "/visual-formulas/sierpinski-carpet",
  "sierpinski-carpet": "/visual-formulas/sierpinski-carpet",
  fractals: "/visual-formulas/sierpinski-carpet",
  "complex-numbers": "/complex-numbers/formula-visualizer",
  "sequences-series": "/sequences-series/formula-visualizer",
  combinatorics: "/combinatorics/formula-visualizer",
  "set-theory": "/set-theory/formula-visualizer",
  "set-theory-logic": "/set-theory/formula-visualizer",
  "relations-functions": "/relations-functions/formula-visualizer",
  functions: "/relations-functions/formula-visualizer",
  "linear-programming": "/linear-programming/formula-visualizer",
  inequalities: "/inequalities/formula-visualizer",
  "probability-distributions": "/probability-distributions/formula-visualizer",
  ...phase3FormulaVisualizerCategoryRouteMap,
};

export function getFormulaVisualizerConfig(id: string) {
  return formulaVisualizerConfigs.find((config) => config.id === id);
}

export function getFormulaVisualizerForFormulaCategory(categoryId?: string) {
  if (!categoryId) return undefined;
  return formulaVisualizerCategoryRouteMap[categoryId];
}
