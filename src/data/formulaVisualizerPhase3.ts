import type { FormulaVisualizerDifficulty, FormulaVisualizerEntry, FormulaVisualizerRouteConfig, FormulaVisualizerType } from "./formulaVisualizerRoutes";

type TopicSpec = {
  id: string;
  title: string;
  latex: string;
  plainText: string;
  description: string;
  group: string;
  difficulty?: FormulaVisualizerDifficulty;
  tags?: string[];
  commonMistake?: string;
};

type Phase3ConfigSpec = {
  id: string;
  title: string;
  shortTitle: string;
  route: string;
  formulaLibraryRoute: string;
  subtitle: string;
  defaultFormulaId: string;
  visualizerType: FormulaVisualizerType;
  searchTerms: string[];
  relatedRoutes?: Array<{ label: string; href: string }>;
  teacherNotes?: FormulaVisualizerRouteConfig["teacherNotes"];
  formulas: TopicSpec[];
};

const examples = [
  { title: "Small clean numbers", description: "A readable setup for first explanation.", values: { a: 2, b: 3, c: 1, n: 6, p: 40 } },
  { title: "Boundary behavior", description: "A near-edge setup that reveals restrictions.", values: { a: -2, b: 4, c: 0, n: 10, p: 80 } },
  { title: "Challenge values", description: "Slightly larger values for classroom checking.", values: { a: 5, b: 2, c: 3, n: 12, p: 25 } },
];

const teacher = (
  quickBoardExplanation: string,
  discussionPrompt: string,
  misconceptionPrompt: string,
  fiveMinuteActivity: string,
  practiceChallenge: string,
  prerequisites: string[],
  nextConcepts: string[],
): FormulaVisualizerRouteConfig["teacherNotes"] => ({
  quickBoardExplanation,
  discussionPrompt,
  misconceptionPrompt,
  fiveMinuteActivity,
  practiceChallenge,
  prerequisites,
  nextConcepts,
});

const specs: Phase3ConfigSpec[] = [
  {
    id: "limits-continuity",
    title: "Limits and Continuity Formula Visualizer",
    shortTitle: "Limits & Continuity",
    route: "/math/limits-continuity/formula-visualizer",
    formulaLibraryRoute: "/formulas/limits-continuity",
    subtitle: "Approach values from the left and right, test continuity, and compare holes, jumps, and asymptotes.",
    defaultFormulaId: "limit-notation",
    visualizerType: "limits-continuity",
    searchTerms: ["limits visualizer", "continuity visualizer", "left hand limit", "right hand limit", "squeeze theorem"],
    relatedRoutes: [{ label: "Limits lab", href: "/math/limits-continuity" }, { label: "Calculus hub", href: "/calculus" }],
    formulas: [
      t("limit-notation", "Limit notation", "\\lim_{x\\to a}f(x)=L", "limit as x approaches a", "The output settles near L as x moves toward a.", "Approach", "Foundation", ["limit"]),
      t("left-right-limit", "Left and right limits", "\\lim_{x\\to a^-}f(x)=\\lim_{x\\to a^+}f(x)", "left limit equals right limit", "A two-sided limit exists only when both sides agree.", "Approach", "Practice", ["one-sided"]),
      t("continuity-test", "Continuity test", "\\lim_{x\\to a}f(x)=f(a)", "limit equals function value", "Continuity needs a value, a limit, and equality.", "Continuity", "Foundation", ["continuity"]),
      t("standard-sine-limit", "Standard sine limit", "\\lim_{x\\to0}\\frac{\\sin x}{x}=1", "sin x over x tends to 1", "Small arcs and chords become almost the same.", "Standard Limits", "Exam", ["standard limit"]),
      t("squeeze-theorem", "Squeeze theorem", "g(x)\\le f(x)\\le h(x)", "squeeze theorem", "If two bounding functions meet, the trapped function must meet too.", "Theorems", "Exam", ["squeeze"]),
      t("infinite-limit", "Infinite limit", "\\lim_{x\\to a}f(x)=\\infty", "infinite limit", "The graph climbs without bound near a vertical asymptote.", "Asymptotes", "Practice", ["asymptote"]),
      t("limit-at-infinity", "Limit at infinity", "\\lim_{x\\to\\infty}f(x)=L", "limit at infinity", "Far to the right, the graph may flatten toward a horizontal asymptote.", "Asymptotes", "Practice", ["infinity"]),
      t("removable-discontinuity", "Removable discontinuity", "f(a)\\ne\\lim_{x\\to a}f(x)", "hole discontinuity", "A hole can be filled if the approaching value exists.", "Discontinuity", "Practice", ["hole"]),
      t("jump-discontinuity", "Jump discontinuity", "\\lim_{x\\to a^-}f(x)\\ne\\lim_{x\\to a^+}f(x)", "jump discontinuity", "The two sides land at different heights.", "Discontinuity", "Practice", ["jump"]),
    ],
  },
  {
    id: "differential-equations",
    title: "Differential Equations Formula Visualizer",
    shortTitle: "Differential Equations",
    route: "/math/differential-equations/formula-visualizer",
    formulaLibraryRoute: "/formulas/differential-equations",
    subtitle: "Explore slope fields, initial values, separable models, exponential growth, and logistic saturation.",
    defaultFormulaId: "first-order",
    visualizerType: "differential-equations",
    searchTerms: ["differential equations visualizer", "slope field visualizer", "logistic growth", "separable equations"],
    relatedRoutes: [{ label: "Slope fields", href: "/math/slope-fields" }, { label: "Calculus hub", href: "/calculus" }],
    formulas: [
      t("first-order", "First-order equation", "\\frac{dy}{dx}=f(x,y)", "dy/dx = f(x,y)", "A differential equation describes a changing slope.", "Basics"),
      t("separable", "Separable equation", "\\frac{dy}{dx}=g(x)h(y)", "separable differential equation", "Move y terms and x terms to opposite sides.", "Separation", "Practice", ["separable"]),
      t("exponential-growth", "Exponential growth", "\\frac{dy}{dt}=ky", "dy/dt = ky", "Change proportional to amount creates exponential behavior.", "Growth", "Foundation", ["growth"]),
      t("logistic-growth", "Logistic growth", "\\frac{dy}{dt}=ky(1-\\frac yK)", "logistic growth", "Growth slows as y approaches carrying capacity K.", "Growth", "Exam", ["logistic"]),
      t("homogeneous-linear", "Homogeneous linear", "y'+py=0", "y prime plus p y equals zero", "The solution decays or grows by an integrating factor pattern.", "Linear", "Practice", ["homogeneous"]),
      t("general-solution", "General solution", "y=C e^{kx}", "general solution", "A constant family represents many solution curves.", "Solutions", "Foundation", ["general"]),
      t("initial-value", "Initial value problem", "y(x_0)=y_0", "initial condition", "One starting point picks one curve from the family.", "Solutions", "Foundation", ["ivp"]),
    ],
  },
  {
    id: "determinants",
    title: "Determinants Formula Visualizer",
    shortTitle: "Determinants",
    route: "/determinants/formula-visualizer",
    formulaLibraryRoute: "/formulas/determinants",
    subtitle: "Edit small matrices and connect determinant values to invertibility, area scale, volume scale, and Cramer's rule.",
    defaultFormulaId: "det-2x2",
    visualizerType: "determinant",
    searchTerms: ["determinant visualizer", "2x2 determinant", "3x3 determinant", "cramers rule", "cofactor expansion"],
    relatedRoutes: [{ label: "Matrices", href: "/matrices" }, { label: "Matrix transformations", href: "/math/matrix-transformations" }],
    formulas: [
      t("det-2x2", "2x2 determinant", "\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}=ad-bc", "ad minus bc", "The determinant measures signed area scaling.", "Small Matrices"),
      t("det-3x3", "3x3 determinant", "\\det A=aei+bfg+cdh-ceg-bdi-afh", "3 by 3 determinant", "A 3D determinant measures signed volume scaling.", "Small Matrices", "Exam"),
      t("cofactor-expansion", "Cofactor expansion", "\\det A=\\sum a_{ij}C_{ij}", "sum entries times cofactors", "Expand along a row or column using signed minors.", "Expansion", "Exam"),
      t("row-swap", "Row swap effect", "R_i\\leftrightarrow R_j\\Rightarrow \\det\\text{ changes sign}", "row swap flips determinant sign", "Swapping rows reverses orientation.", "Row Operations"),
      t("row-scale", "Row scaling", "R_i\\to kR_i\\Rightarrow \\det\\to k\\det", "scale row scales determinant", "Stretching one row stretches volume by the same factor.", "Row Operations"),
      t("invertibility", "Invertibility test", "\\det A\\ne0", "determinant not zero", "A nonzero determinant means the transformation can be undone.", "Inverse"),
      t("cramers-rule", "Cramer's rule", "x_i=\\frac{\\det A_i}{\\det A}", "Cramer's rule", "Replace one column to solve a small linear system.", "Systems", "Exam"),
      t("linear-dependence", "Zero determinant", "\\det A=0", "zero determinant", "Volume collapses, so columns are dependent.", "Dependence"),
    ],
  },
  {
    id: "three-d-geometry",
    title: "3D Geometry Formula Visualizer",
    shortTitle: "3D Geometry",
    route: "/three-d-geometry/formula-visualizer",
    formulaLibraryRoute: "/formulas/three-d-geometry",
    subtitle: "Use a stable isometric projection to inspect points, lines, planes, normals, angles, and sphere equations.",
    defaultFormulaId: "distance-3d",
    visualizerType: "three-d-geometry",
    searchTerms: ["3d geometry visualizer", "direction cosines", "plane equation", "point to plane distance", "sphere equation"],
    relatedRoutes: [{ label: "3D workspace", href: "/workspace/3d" }, { label: "Linear algebra", href: "/linear-algebra" }],
    formulas: [
      t("distance-3d", "Distance in 3D", "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}", "3D distance formula", "Distance extends Pythagoras into three axes.", "Points"),
      t("section-3d", "Section formula in 3D", "P=\\frac{mB+nA}{m+n}", "weighted section point", "A ratio point is a weighted average of coordinates.", "Points"),
      t("direction-ratios", "Direction ratios", "\\langle a,b,c\\rangle", "direction ratios", "Ratios describe a line direction.", "Lines"),
      t("direction-cosines", "Direction cosines", "l^2+m^2+n^2=1", "direction cosines identity", "Cosines with the axes square-sum to one.", "Lines"),
      t("line-3d", "Line in 3D", "\\vec r=\\vec a+\\lambda\\vec b", "vector equation of line", "A point plus a scaled direction draws a line.", "Lines"),
      t("plane", "Plane equation", "\\vec r\\cdot\\vec n=d", "plane dot normal equals d", "A plane is all points with fixed normal projection.", "Planes"),
      t("angle-lines", "Angle between lines", "\\cos\\theta=\\frac{\\vec a\\cdot\\vec b}{|a||b|}", "angle between lines", "Direction vectors determine the angle.", "Angles"),
      t("point-plane-distance", "Point to plane distance", "D=\\frac{|ax_1+by_1+cz_1+d|}{\\sqrt{a^2+b^2+c^2}}", "point plane distance", "The perpendicular normal gives shortest distance.", "Distances", "Exam"),
      t("sphere-equation", "Sphere equation", "(x-h)^2+(y-k)^2+(z-l)^2=r^2", "sphere equation", "All points are a fixed 3D distance from center.", "Surfaces"),
    ],
  },
  {
    id: "early-number-sense",
    title: "Early Number Sense Formula Visualizer",
    shortTitle: "Early Number Sense",
    route: "/early-number-sense/formula-visualizer",
    formulaLibraryRoute: "/formulas/early-number-sense",
    subtitle: "Child-safe controls for counting, place value, comparisons, number bonds, odd/even groups, and skip patterns.",
    defaultFormulaId: "place-value",
    visualizerType: "early-number-sense",
    searchTerms: ["early number sense visualizer", "place value blocks", "number line", "skip counting", "number bonds"],
    teacherNotes: teacher("Use objects first, symbols second: show the same number as blocks, a point, and a sentence.", "Which representation makes the number easiest to compare?", "Students may count digits instead of place values; ask them what each digit is worth.", "Build 24 with tens and ones, then move one slider and ask what changed.", "Show 36 three different ways.", ["Counting", "One-to-one correspondence"], ["Fractions", "Operations"]),
    formulas: [
      t("counting", "Counting", "1,2,3,\\ldots,n", "counting sequence", "Counting assigns one number name to each object.", "Counting"),
      t("place-value", "Place value", "N=100h+10t+u", "hundreds tens ones", "Each digit has a value based on its place.", "Place Value"),
      t("comparison", "Comparison", "a>b,\\ a<b,\\ a=b", "greater less equal", "Compare largest place values first.", "Compare"),
      t("odd-even", "Odd or even", "n=2k\\text{ or }2k+1", "even or odd", "Even numbers pair completely; odd numbers leave one.", "Parity"),
      t("skip-count", "Skip counting", "a,a+d,a+2d,\\ldots", "skip count pattern", "Equal jumps create a pattern.", "Patterns"),
      t("addition-fact", "Addition fact", "a+b=c", "addition", "Parts combine to make a whole.", "Facts"),
      t("subtraction-fact", "Subtraction fact", "c-a=b", "subtraction", "Subtraction finds a missing part.", "Facts"),
      t("number-bond", "Number bonds", "whole=part_1+part_2", "number bond", "A whole can be decomposed into parts.", "Bonds"),
    ],
  },
  {
    id: "fractions-decimals-percent",
    title: "Fractions, Decimals, Percent Formula Visualizer",
    shortTitle: "Fractions Decimals Percent",
    route: "/fractions-decimals-percent/formula-visualizer",
    formulaLibraryRoute: "/formulas/fractions-decimals-percent",
    subtitle: "Link bars, grids, decimal values, percent shading, simplification, and increase/decrease models.",
    defaultFormulaId: "fraction-meaning",
    visualizerType: "fraction-percent",
    searchTerms: ["fractions decimals percent visualizer", "equivalent fractions", "percent shaded grid", "fraction simplifier"],
    teacherNotes: teacher("Keep the same whole visible while changing fraction, decimal, and percent labels.", "When do two different-looking fractions cover the same amount?", "Students often change the whole while comparing fractions; keep the unit fixed.", "Shade 3/5, convert to decimal and percent, then ask for an equivalent fraction.", "Find three names for 0.75.", ["Division", "Place value"], ["Ratios", "Probability"]),
    formulas: [
      t("fraction-meaning", "Fraction meaning", "\\frac ab", "a parts out of b", "A fraction counts equal parts of one whole.", "Fractions"),
      t("equivalent-fractions", "Equivalent fractions", "\\frac ab=\\frac{ka}{kb}", "multiply numerator and denominator", "Scaling both parts keeps the same value.", "Fractions"),
      t("simplify", "Simplification", "\\frac ab=\\frac{a\\div g}{b\\div g}", "divide by gcd", "Divide numerator and denominator by a common factor.", "Fractions"),
      t("decimal-conversion", "Decimal conversion", "\\frac ab=a\\div b", "fraction to decimal", "Division turns a fraction into a decimal.", "Decimals"),
      t("percent-conversion", "Percent conversion", "p=100\\cdot\\frac ab", "fraction to percent", "Percent means parts per hundred.", "Percent"),
      t("percent-change", "Percent change", "\\frac{new-old}{old}\\times100\\%", "percentage increase decrease", "Change is measured relative to the original.", "Percent", "Practice"),
      t("fraction-addition", "Fraction addition", "\\frac ab+\\frac cd=\\frac{ad+bc}{bd}", "add fractions", "Common denominators align equal-sized pieces.", "Operations", "Practice"),
      t("fraction-multiply", "Fraction multiplication", "\\frac ab\\cdot\\frac cd=\\frac{ac}{bd}", "multiply fractions", "Multiplication scales one fraction by another.", "Operations"),
      t("ratio-percent", "Ratio to percent", "a:b\\Rightarrow\\frac{a}{a+b}\\times100\\%", "ratio to percent", "A part-to-part ratio can become a part-of-whole percent.", "Ratios", "Practice"),
    ],
  },
  commercialMathSpec(),
  speedWorkSpec(),
  mentalMathSpec(),
  preAlgebraSpec(),
  numberTheorySpec(),
  euclideanSpec(),
  analyticGeometrySpec(),
  precalculusSpec(),
  calculusApplicationsSpec(),
  multivariableSpec(),
  advancedLinearAlgebraSpec(),
  abstractAlgebraSpec(),
  realAnalysisSpec(),
  complexAnalysisSpec(),
  topologySpec(),
  differentialGeometrySpec(),
  discreteMathSpec(),
  optimizationSpec(),
  numericalMethodsSpec(),
  dynamicalSystemsSpec(),
  pdeSpec(),
  transformsSpec(),
  mathematicalPhysicsSpec(),
  informationTheorySpec(),
  machineLearningSpec(),
  cryptographySpec(),
];

export const phase3FormulaVisualizerConfigs: FormulaVisualizerRouteConfig[] = specs.map((spec) => ({
  id: spec.id,
  title: spec.title,
  shortTitle: spec.shortTitle,
  route: spec.route,
  category: spec.shortTitle,
  subtitle: spec.subtitle,
  description: `${spec.shortTitle} formulas with compact interactive controls, live substitution, visual intuition, formula bank, examples, practice, and teacher-ready prompts where useful.`,
  defaultFormulaId: spec.defaultFormulaId,
  formulaLibraryRoute: spec.formulaLibraryRoute,
  relatedRoutes: spec.relatedRoutes ?? [
    { label: "Formula library", href: spec.formulaLibraryRoute },
    { label: "Visual formula hub", href: "/trigonometry/formula-visualizer" },
    { label: "Math workspace", href: "/workspace" },
  ],
  examples,
  formulas: spec.formulas.map((item) => f(item, spec.visualizerType)),
  searchTerms: [
    ...spec.searchTerms,
    `${spec.shortTitle} formula visualizer`,
    `${spec.shortTitle} interactive formula lab`,
    ...spec.formulas.flatMap((item) => [item.title, ...(item.tags ?? [])]),
  ],
  teacherNotes: spec.teacherNotes,
}));

export const phase3FormulaVisualizerCategoryRouteMap = Object.fromEntries(
  specs.flatMap((spec) => [
    [spec.id, spec.route],
    [spec.id.replace(/-/g, "_"), spec.route],
  ]),
) as Record<string, string>;

function t(
  id: string,
  title: string,
  latex: string,
  plainText: string,
  description: string,
  group: string,
  difficulty: FormulaVisualizerDifficulty = "Foundation",
  tags: string[] = [],
  commonMistake?: string,
): TopicSpec {
  return { id, title, latex, plainText, description, group, difficulty, tags, commonMistake };
}

function f(topic: TopicSpec, visualizerType: FormulaVisualizerType): FormulaVisualizerEntry {
  return {
    id: topic.id,
    title: topic.title,
    latex: topic.latex,
    plainText: topic.plainText,
    description: topic.description,
    group: topic.group,
    difficulty: topic.difficulty ?? "Foundation",
    variables: ["a", "b", "c", "n", "p"],
    visualizerType,
    commonMistake: topic.commonMistake,
    tags: topic.tags ?? [],
  };
}

function commercialMathSpec(): Phase3ConfigSpec {
  return spec("commercial-math", "Commercial Math Formula Visualizer", "Commercial Math", "/commercial-math/formula-visualizer", "commercial-math", "Price, profit, loss, discount, tax, commission, depreciation, and interest models with bill-style visuals.", "profit", "commercial-math", ["commercial math calculator visualizer", "profit loss visualizer", "discount gst interest"], teacher("Separate cost price, selling price, marked price, and final bill before writing formulas.", "Which value is the base for the percent?", "Students often apply discount after tax in the wrong order; ask for the story sequence.", "Make a marked-price bill with discount and tax sliders.", "Compare simple and compound interest for the same principal.", ["Percent", "Decimals"], ["Financial math", "Exponential growth"]), [
    t("profit", "Profit", "Profit=SP-CP", "profit equals selling price minus cost price", "Profit is the gain after selling above cost.", "Profit and Loss"),
    t("loss", "Loss", "Loss=CP-SP", "loss equals cost price minus selling price", "Loss happens when selling below cost.", "Profit and Loss"),
    t("marked-price", "Marked price", "SP=MP-Discount", "selling price after discount", "Discount lowers marked price before billing.", "Discount"),
    t("discount-percent", "Discount percent", "Discount=\\frac d{100}MP", "discount percent of marked price", "A discount is a percent of the marked price.", "Discount"),
    t("simple-interest", "Simple interest", "SI=\\frac{PRT}{100}", "simple interest", "Interest grows by a constant amount each period.", "Interest"),
    t("compound-interest", "Compound interest", "A=P(1+\\frac r{100})^t", "compound amount", "Interest earns interest when compounded.", "Interest", "Practice"),
    t("tax", "Tax", "Bill=Price(1+\\frac t{100})", "tax inclusive bill", "Tax adds a percentage to the base price.", "Tax"),
    t("commission", "Commission", "Commission=rate\\times sales", "commission", "Commission rewards a percentage of sales.", "Commission"),
    t("depreciation", "Depreciation", "V=P(1-\\frac r{100})^t", "depreciated value", "Value decreases by a repeated percentage.", "Depreciation", "Practice"),
  ]);
}

function speedWorkSpec(): Phase3ConfigSpec {
  return spec("speed-time-work", "Speed, Time, Work Formula Visualizer", "Speed Time Work", "/speed-time-work/formula-visualizer", "speed-time-work", "Motion timelines and tank/work-rate models for distance, speed, time, relative speed, and combined work.", "speed", "speed-work", ["speed time work visualizer", "relative speed", "pipes cisterns", "combined work"], undefined, [
    t("speed", "Speed", "s=\\frac dt", "speed equals distance over time", "Speed compares distance travelled to time taken.", "Motion"),
    t("distance", "Distance", "d=st", "distance equals speed times time", "Distance accumulates as speed continues over time.", "Motion"),
    t("time", "Time", "t=\\frac ds", "time equals distance over speed", "Time shrinks when speed increases for fixed distance.", "Motion"),
    t("average-speed", "Average speed", "\\bar s=\\frac{total\\ distance}{total\\ time}", "average speed", "Average speed uses total distance and total time.", "Motion", "Practice"),
    t("relative-speed", "Relative speed", "s_{rel}=s_1+s_2", "relative speed opposite direction", "Opposite directions add speeds; same direction subtracts.", "Relative Motion", "Practice"),
    t("work-rate", "Work rate", "rate=\\frac1{time}", "work rate", "A job completed in t hours has rate one over t.", "Work"),
    t("combined-work", "Combined work", "\\frac1T=\\frac1a+\\frac1b", "combined work rate", "Rates add when people or pipes work together.", "Work", "Exam"),
    t("pipes", "Pipes and cisterns", "net\\ rate=inlet-outlet", "net tank rate", "Filling and emptying rates combine with signs.", "Work", "Practice"),
  ]);
}

function mentalMathSpec(): Phase3ConfigSpec {
  return spec("mental-math", "Mental Math and Vedic Tricks Formula Visualizer", "Mental Math", "/mental-math/formula-visualizer", "mental-math", "Step-by-step shortcut models with validity checks, practice values, and normal-method comparison.", "square-ending-5", "mental-math", ["vedic math visualizer", "mental math tricks", "fast multiplication", "divisibility shortcuts"], undefined, [
    t("square-ending-5", "Square ending in 5", "(10a+5)^2=100a(a+1)+25", "square number ending in five", "Multiply the leading part by the next number and append 25.", "Squares"),
    t("near-base", "Near-base multiplication", "(B+x)(B+y)=B(B+x+y)+xy", "near base multiplication", "Use distance from a base such as 10 or 100.", "Multiplication"),
    t("digit-sum", "Digit sum check", "n\\equiv sum\\ digits\\pmod9", "casting out nines", "Digit sums preserve remainder modulo 9.", "Checks"),
    t("divisibility", "Divisibility shortcuts", "10\\equiv r\\pmod m", "divisibility rule", "Place value remainders create shortcuts.", "Checks"),
    t("fast-percent", "Fast percent", "p\\%\\ of\\ n=n\\%\\ of\\ p", "percent swap", "Swapping percent and number can simplify mental math.", "Percent"),
    t("complement", "Complement method", "a-b=a+(10^k-b)-10^k", "complement subtraction", "Use a nearby base to subtract faster.", "Subtraction"),
    t("difference-squares-trick", "Difference of squares", "(a-b)(a+b)=a^2-b^2", "difference of squares shortcut", "Products near a center become a square difference.", "Multiplication"),
    t("cross-multiply", "Cross multiplication", "(10a+b)(10c+d)", "cross multiplication", "Tens and ones can be combined by cross-products.", "Multiplication", "Practice"),
    t("estimation", "Estimation", "actual\\approx rounded\\ value", "estimation", "Rounded values give a quick reasonableness check.", "Estimation"),
  ]);
}

function preAlgebraSpec(): Phase3ConfigSpec {
  return spec("pre-algebra", "Pre-Algebra Formula Visualizer", "Pre-Algebra", "/pre-algebra/formula-visualizer", "pre-algebra", "Expression building, balance-scale equations, distributive area models, ratios, proportions, and basic graphing.", "order-operations", "pre-algebra", ["pre algebra visualizer", "balance scale equation", "like terms", "distributive property"], undefined, [
    t("order-operations", "Order of operations", "P\\to E\\to MD\\to AS", "order of operations", "Operations follow a predictable priority.", "Expressions"),
    t("variables", "Variables", "x\\ represents\\ a\\ number", "variable as unknown", "A variable stands for a value that can change or be unknown.", "Expressions"),
    t("like-terms", "Like terms", "ax+bx=(a+b)x", "combine like terms", "Only matching variable parts combine.", "Expressions"),
    t("simple-equation", "Simple equations", "ax+b=c", "linear equation", "Undo operations to isolate the unknown.", "Equations"),
    t("properties", "Number properties", "a+b=b+a", "commutative property", "Properties explain legal rearrangements.", "Properties"),
    t("distributive", "Distributive property", "a(b+c)=ab+ac", "distributive property", "One side length multiplies both parts of a split side.", "Properties"),
    t("ratio", "Ratio", "a:b=\\frac ab", "ratio", "Ratios compare quantities by division.", "Ratios"),
    t("proportion", "Proportion", "\\frac ab=\\frac cd", "proportion", "Equal ratios form a proportion.", "Ratios", "Practice"),
    t("basic-graphing", "Basic graphing", "y=mx+b", "line graph", "A table of values becomes points on a line.", "Graphs"),
  ]);
}

function numberTheorySpec(): Phase3ConfigSpec {
  return spec("number-theory", "Olympiad Number Theory Formula Visualizer", "Number Theory", "/number-theory/formula-visualizer", "number-theory", "Modular clocks, Euclidean algorithm steps, prime factors, CRT examples, and pigeonhole counting.", "modular-arithmetic", "number-theory", ["number theory visualizer", "modular arithmetic visualizer", "euclidean algorithm", "crt visualizer"], undefined, [
    t("modular-arithmetic", "Modular arithmetic", "a\\equiv b\\pmod m", "a congruent b mod m", "Numbers with the same remainder land on the same clock point.", "Modular"),
    t("congruence", "Congruence", "m\\mid(a-b)", "m divides a minus b", "Congruence means the difference is a multiple of m.", "Modular"),
    t("prime-factorization", "Prime factorization", "n=p_1^{a_1}p_2^{a_2}\\cdots", "prime factors", "Every integer factors into primes.", "Factors"),
    t("gcd-lcm", "GCD and LCM", "ab=gcd(a,b)lcm(a,b)", "gcd lcm relation", "Common factors and common multiples balance.", "Factors"),
    t("euclidean", "Euclidean algorithm", "a=bq+r", "Euclidean algorithm", "Repeated remainders find the GCD.", "Algorithms", "Practice"),
    t("fermat", "Fermat's little theorem", "a^{p-1}\\equiv1\\pmod p", "Fermat theorem", "For prime p, nonmultiples cycle back to 1.", "Theorems", "Advanced"),
    t("euler-phi", "Euler phi", "\\phi(n)=n\\prod_{p\\mid n}(1-\\frac1p)", "Euler phi", "Phi counts numbers coprime to n.", "Theorems", "Advanced"),
    t("crt", "Chinese remainder theorem", "x\\equiv a_i\\pmod{m_i}", "CRT system", "Compatible coprime moduli make one repeating solution.", "Theorems", "Advanced"),
    t("pigeonhole", "Pigeonhole principle", "n+1\\ objects\\ into\\ n\\ boxes", "pigeonhole principle", "One box must contain at least two objects.", "Counting"),
  ]);
}

function euclideanSpec(): Phase3ConfigSpec {
  return spec("euclidean-geometry", "Euclidean Geometry Theorems Formula Visualizer", "Euclidean Geometry", "/euclidean-geometry/formula-visualizer", "euclidean-geometry", "Dynamic theorem diagrams for congruence, similarity, Pythagoras, circle theorems, tangents, bisectors, and proportionality.", "pythagoras-euclidean", "euclidean-geometry", ["euclidean geometry theorem visualizer", "circle theorem visualizer", "angle bisector theorem"], undefined, [
    t("congruence", "Congruence criteria", "SSS,SAS,ASA,RHS", "triangle congruence criteria", "Enough matching parts force triangles to coincide.", "Triangles"),
    t("similarity", "Similarity criteria", "AA,SAS,SSS", "triangle similarity criteria", "Equal angles or proportional sides preserve shape.", "Triangles"),
    t("pythagoras-euclidean", "Pythagoras", "a^2+b^2=c^2", "Pythagoras theorem", "Squares on legs equal the square on hypotenuse.", "Right Triangles"),
    t("circle-theorem", "Angle in semicircle", "\\angle APB=90^\\circ", "angle in a semicircle", "A diameter subtends a right angle.", "Circles"),
    t("tangent-radius", "Tangent-radius theorem", "OT\\perp tangent", "radius perpendicular tangent", "Radius to point of contact is perpendicular to tangent.", "Circles"),
    t("angle-bisector", "Angle bisector theorem", "\\frac{BD}{DC}=\\frac{AB}{AC}", "angle bisector ratio", "An angle bisector splits the opposite side in adjacent side ratio.", "Ratios", "Exam"),
    t("bpt", "Basic proportionality theorem", "\\frac{AD}{DB}=\\frac{AE}{EC}", "basic proportionality theorem", "A line parallel to one side splits other sides proportionally.", "Ratios", "Exam"),
    t("ceva", "Ceva theorem", "\\frac{BD}{DC}\\frac{CE}{EA}\\frac{AF}{FB}=1", "Ceva theorem", "Concurrent cevians balance three side ratios.", "Advanced", "Advanced"),
  ]);
}

function analyticGeometrySpec(): Phase3ConfigSpec {
  return spec("analytic-geometry", "Advanced Analytic Geometry Formula Visualizer", "Analytic Geometry", "/analytic-geometry/formula-visualizer", "analytic-geometry", "Conic selectors, eccentricity, focus-directrix ideas, polar curves, and tangent-normal previews.", "conic-general", "analytic-geometry", ["analytic geometry visualizer", "conic visualizer", "eccentricity slider", "polar plot"], undefined, [
    t("conic-general", "Conic general form", "Ax^2+Bxy+Cy^2+Dx+Ey+F=0", "general conic", "Coefficients classify conic sections.", "Conics"),
    t("parabola", "Parabola", "y^2=4ax", "parabola standard form", "A parabola keeps equal distance from focus and directrix.", "Conics"),
    t("ellipse", "Ellipse", "\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1", "ellipse equation", "Ellipse points have constant sum of focal distances.", "Conics"),
    t("hyperbola", "Hyperbola", "\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1", "hyperbola equation", "Hyperbola points keep a constant difference of focal distances.", "Conics"),
    t("eccentricity", "Eccentricity", "e=\\frac ca", "eccentricity", "Eccentricity controls how open or stretched a conic is.", "Conics"),
    t("parametric", "Parametric equations", "x=f(t),\\ y=g(t)", "parametric curve", "A moving parameter traces the curve.", "Parametric"),
    t("polar", "Polar coordinates", "r=f(\\theta)", "polar equation", "A radius and angle locate each point.", "Polar"),
    t("tangent-normal", "Tangent and normal", "T\\perp N", "tangent perpendicular normal", "The normal is perpendicular to the tangent at a point.", "Tangents"),
  ]);
}

function precalculusSpec(): Phase3ConfigSpec {
  return spec("precalculus", "Precalculus Formula Visualizer", "Precalculus", "/precalculus/formula-visualizer", "precalculus", "Function transformations, exponentials, logarithms, trig waves, inverse relations, rational graphs, parametric and polar basics.", "function-transform", "precalculus", ["precalculus visualizer", "function transformations", "exponential log comparison", "inverse trig"], undefined, [
    t("function-transform", "Function transformation", "g(x)=af(b(x-h))+k", "function transformation", "Parameters shift, stretch, and reflect the graph.", "Functions"),
    t("exponential", "Exponential function", "y=ab^x", "exponential function", "Equal input steps multiply output by a constant ratio.", "Functions"),
    t("logarithmic", "Logarithmic function", "y=\\log_b x", "logarithm", "Logarithms undo exponential functions.", "Functions"),
    t("trig-wave", "Trig function", "y=A\\sin(Bx+C)+D", "sine wave", "Amplitude, period, phase, and midline control the wave.", "Trigonometry"),
    t("inverse-trig", "Inverse trig", "y=\\sin^{-1}x", "inverse sine", "Inverse trig returns an angle from a ratio.", "Trigonometry"),
    t("rational", "Rational function", "f(x)=\\frac{p(x)}{q(x)}", "rational function", "Zeros of the denominator can create asymptotes.", "Functions"),
    t("composite", "Composite function", "(f\\circ g)(x)=f(g(x))", "composite function", "One function's output feeds another.", "Functions"),
    t("parametric-basic", "Parametric basics", "x=f(t),y=g(t)", "parametric basics", "A parameter traces x and y together.", "Parametric"),
    t("polar-basic", "Polar basics", "r=f(\\theta)", "polar basics", "Angle and radius describe location.", "Polar"),
  ]);
}

function calculusApplicationsSpec(): Phase3ConfigSpec {
  return spec("calculus-applications", "Calculus Applications Formula Visualizer", "Calculus Applications", "/calculus-applications/formula-visualizer", "calculus-applications", "Optimization, related rates, curve sketching, area, volume, arc length, work, and accumulation models.", "optimization-app", "calculus-applications", ["calculus applications visualizer", "related rates", "area between curves", "volumes of revolution"], teacher("Start each application by defining the changing quantity and the constraint.", "Which variable is controlled, and which one is being optimized?", "Students often differentiate before setting up the equation; insist on a diagram first.", "Sketch a rectangle optimization model and test three slider values.", "Explain why a critical point must still be checked.", ["Derivatives", "Integrals"], ["Optimization", "Differential equations"]), [
    t("optimization-app", "Optimization", "f'(x)=0", "optimization critical point", "Maxima and minima occur at critical points or endpoints.", "Optimization"),
    t("related-rates", "Related rates", "\\frac{dy}{dt}=\\frac{dy}{dx}\\frac{dx}{dt}", "related rates chain rule", "Linked quantities change through the chain rule.", "Rates", "Exam"),
    t("curve-sketching", "Curve sketching", "f',f''\\ guide\\ shape", "curve sketching", "First and second derivatives reveal increasing, concavity, and turning.", "Sketching"),
    t("max-min-test", "Second derivative test", "f''(c)>0\\Rightarrow min", "second derivative test", "Concavity classifies a critical point.", "Tests"),
    t("area-between", "Area between curves", "A=\\int_a^b(f-g)dx", "area between curves", "Subtract lower curve from upper curve.", "Area"),
    t("volume-revolution", "Volume of revolution", "V=\\pi\\int_a^b R(x)^2dx", "washer method", "Rotating area builds volume.", "Volumes", "Exam"),
    t("arc-length", "Arc length", "L=\\int_a^b\\sqrt{1+(y')^2}dx", "arc length", "Tiny tangent segments add up to curve length.", "Length", "Advanced"),
    t("work", "Work", "W=\\int_a^b F(x)dx", "work integral", "Variable force accumulates over distance.", "Work"),
  ]);
}

function multivariableSpec(): Phase3ConfigSpec {
  return spec("multivariable-calculus", "Multivariable Calculus Formula Visualizer", "Multivariable Calculus", "/multivariable-calculus/formula-visualizer", "multivariable-calculus", "Contour maps, gradients, tangent planes, multiple integrals, Jacobians, vector fields, and constrained optimization.", "partial-derivative", "multivariable-calculus", ["multivariable calculus visualizer", "gradient vector field", "tangent plane", "lagrange multipliers"], undefined, [
    t("partial-derivative", "Partial derivative", "f_x=\\frac{\\partial f}{\\partial x}", "partial derivative", "Change one input while holding the other fixed.", "Derivatives"),
    t("gradient", "Gradient", "\\nabla f=\\langle f_x,f_y\\rangle", "gradient vector", "The gradient points toward steepest increase.", "Derivatives"),
    t("directional", "Directional derivative", "D_{\\vec u}f=\\nabla f\\cdot\\vec u", "directional derivative", "Project the gradient onto a direction.", "Derivatives"),
    t("tangent-plane", "Tangent plane", "z=f(a,b)+f_x(x-a)+f_y(y-b)", "tangent plane", "A plane locally approximates a surface.", "Surfaces"),
    t("double-integral", "Double integral", "\\iint_R f(x,y)dA", "double integral", "Add small columns over a region.", "Integrals"),
    t("triple-integral", "Triple integral", "\\iiint_E f(x,y,z)dV", "triple integral", "Accumulate over a 3D region.", "Integrals"),
    t("jacobian", "Jacobian", "J=\\frac{\\partial(x,y)}{\\partial(u,v)}", "Jacobian determinant", "Jacobian scales area during coordinate changes.", "Change of Variables"),
    t("divergence", "Divergence", "\\nabla\\cdot\\vec F", "divergence", "Divergence measures source or sink behavior.", "Vector Fields"),
    t("curl", "Curl", "\\nabla\\times\\vec F", "curl", "Curl measures local rotation.", "Vector Fields"),
    t("lagrange", "Lagrange multipliers", "\\nabla f=\\lambda\\nabla g", "Lagrange multipliers", "At constrained extrema, gradients align.", "Optimization", "Advanced"),
  ]);
}

function advancedLinearAlgebraSpec(): Phase3ConfigSpec {
  return spec("linear-algebra", "Advanced Linear Algebra Formula Visualizer", "Linear Algebra", "/linear-algebra/formula-visualizer", "linear-algebra", "Basis, span, rank-nullity, eigenvectors, projections, orthogonality, diagonalization, and Gram-Schmidt.", "basis", "advanced-linear-algebra", ["linear algebra visualizer", "rank nullity", "eigenvector transformation", "gram schmidt"], teacher("Connect every formula to a question: span, independence, solve, transform, or project.", "What changes under a matrix, and what direction stays the same?", "Students often treat basis as any list; test independence and spanning separately.", "Use two vectors to build a span, then add one vector and ask whether dimension changes.", "Explain rank-nullity using columns and solutions.", ["Vectors", "Matrices"], ["Eigenvalues", "Vector spaces"]), [
    t("vector-space", "Vector space", "u+v\\in V,\\ cu\\in V", "closure in vector space", "A vector space is closed under addition and scalar multiplication.", "Spaces"),
    t("basis", "Basis and dimension", "dim(V)=|basis|", "basis size is dimension", "A basis spans without redundancy.", "Spaces"),
    t("independence", "Linear independence", "c_1v_1+\\cdots+c_nv_n=0", "linear independence", "Only the zero combination makes zero.", "Spaces"),
    t("rank", "Matrix rank", "rank(A)=dim(Col(A))", "rank as column space dimension", "Rank counts independent columns.", "Subspaces"),
    t("null-space", "Null space", "N(A)=\\{x:Ax=0\\}", "null space", "Null space contains vectors collapsed to zero.", "Subspaces"),
    t("rank-nullity", "Rank-nullity", "rank(A)+nullity(A)=n", "rank nullity theorem", "Input dimensions split into column output and null directions.", "Subspaces", "Exam"),
    t("eigenvalue", "Eigenvalue", "Av=\\lambda v", "eigenvector equation", "Eigenvectors keep direction under transformation.", "Eigen"),
    t("diagonalization", "Diagonalization", "A=PDP^{-1}", "diagonalization", "A matrix becomes simpler in an eigenbasis.", "Eigen", "Advanced"),
    t("projection", "Projection", "proj_b a=\\frac{a\\cdot b}{b\\cdot b}b", "vector projection", "Projection is the shadow of one vector on another.", "Orthogonality"),
    t("gram-schmidt", "Gram-Schmidt", "u_k=v_k-\\sum proj_{u_i}v_k", "Gram Schmidt", "Subtract previous shadows to build orthogonal vectors.", "Orthogonality", "Advanced"),
  ]);
}

function abstractAlgebraSpec(): Phase3ConfigSpec {
  return spec("abstract-algebra", "Abstract Algebra Formula Visualizer", "Abstract Algebra", "/abstract-algebra/formula-visualizer", "abstract-algebra", "Small finite examples for groups, subgroups, cyclic groups, cosets, Lagrange theorem, rings, fields, and homomorphisms.", "group-axioms", "abstract-algebra", ["abstract algebra visualizer", "cayley table", "cyclic group", "cosets"], undefined, [
    t("group-axioms", "Group axioms", "(G,*)", "closure identity inverse associativity", "A group combines elements with one operation following four rules.", "Groups"),
    t("subgroup", "Subgroup", "H\\le G", "subgroup", "A subgroup is a smaller group inside a group.", "Groups"),
    t("cyclic", "Cyclic group", "\\langle a\\rangle=\\{a^n\\}", "cyclic group", "One generator can produce the whole group.", "Groups"),
    t("cosets", "Cosets", "aH=\\{ah:h\\in H\\}", "cosets", "Cosets partition the group into equal-sized copies.", "Groups"),
    t("lagrange", "Lagrange theorem", "|H|\\mid |G|", "subgroup order divides group order", "Subgroup size divides group size.", "Theorems"),
    t("rings", "Rings", "(R,+,\\cdot)", "ring", "Rings have addition and multiplication structures.", "Rings"),
    t("fields", "Fields", "a\\ne0\\Rightarrow a^{-1}\\ exists", "field inverse", "Every nonzero element has a multiplicative inverse.", "Fields"),
    t("homomorphism", "Homomorphism", "\\phi(ab)=\\phi(a)\\phi(b)", "structure preserving map", "A homomorphism preserves the operation.", "Maps"),
    t("modular-group", "Modular group example", "(\\mathbb Z_n,+)", "integers mod n under addition", "Clock arithmetic gives a concrete group.", "Examples"),
  ]);
}

function realAnalysisSpec(): Phase3ConfigSpec {
  return spec("real-analysis", "Real Analysis Formula Visualizer", "Real Analysis", "/real-analysis/formula-visualizer", "real-analysis", "Safe concrete visualizations for sequences, epsilon bands, Cauchy tails, supremum, infimum, and series tests.", "sequence-limit", "real-analysis", ["real analysis visualizer", "epsilon delta", "Cauchy sequence", "supremum infimum"], undefined, [
    t("sequence-limit", "Sequence limit", "a_n\\to L", "sequence tends to L", "Terms eventually stay near the limit.", "Sequences"),
    t("epsilon-delta", "Epsilon-delta", "0<|x-a|<\\delta\\Rightarrow |f(x)-L|<\\epsilon", "epsilon delta limit", "A small x-window forces a small y-window.", "Limits"),
    t("continuity", "Continuity", "\\lim_{x\\to a}f(x)=f(a)", "continuity", "No gap appears between approaching and actual value.", "Continuity"),
    t("uniform-continuity", "Uniform continuity", "\\delta\\ works\\ for\\ all\\ x", "uniform continuity", "One delta handles the whole domain.", "Continuity", "Advanced"),
    t("monotone-convergence", "Monotone convergence", "a_n\\uparrow, bounded\\Rightarrow convergent", "monotone convergence", "Increasing bounded sequences settle.", "Sequences"),
    t("cauchy", "Cauchy sequence", "|a_m-a_n|<\\epsilon", "Cauchy sequence", "Terms eventually get close to each other.", "Sequences"),
    t("supremum", "Supremum", "\\sup S", "least upper bound", "The smallest ceiling of a set.", "Bounds"),
    t("infimum", "Infimum", "\\inf S", "greatest lower bound", "The greatest floor of a set.", "Bounds"),
    t("series-test", "Series convergence", "\\sum a_n", "series convergence", "Partial sums reveal whether infinite addition settles.", "Series"),
  ]);
}

function complexAnalysisSpec(): Phase3ConfigSpec {
  return spec("complex-analysis", "Complex Analysis Formula Visualizer", "Complex Analysis", "/complex-analysis/formula-visualizer", "complex-analysis", "Two-plane mapping intuition, Cauchy-Riemann checks, contour paths, pole markers, residues, and conformal examples.", "complex-function", "complex-analysis", ["complex analysis visualizer", "Cauchy Riemann", "complex mapping", "residue theorem"], undefined, [
    t("complex-function", "Complex function", "w=f(z)", "complex function mapping", "A complex function maps one plane to another.", "Functions"),
    t("analyticity", "Analyticity", "f'(z)\\ exists\\ nearby", "analytic function", "Analytic functions have complex derivatives in a neighborhood.", "Analytic"),
    t("cauchy-riemann", "Cauchy-Riemann", "u_x=v_y,\\ u_y=-v_x", "Cauchy Riemann equations", "Real and imaginary parts must align for differentiability.", "Analytic"),
    t("contour-integral", "Contour integral", "\\int_C f(z)dz", "complex contour integral", "Integrate along a path in the complex plane.", "Integrals"),
    t("cauchy-theorem", "Cauchy integral theorem", "\\oint_C f(z)dz=0", "Cauchy theorem", "Analytic functions integrate to zero around closed paths.", "Integrals", "Advanced"),
    t("residue", "Residue theorem", "\\oint_C f(z)dz=2\\pi i\\sum Res(f)", "residue theorem", "Poles inside a contour determine the integral.", "Residues", "Advanced"),
    t("laurent", "Laurent series", "f(z)=\\sum a_n(z-z_0)^n", "Laurent series", "Negative powers reveal behavior near singularities.", "Series"),
    t("conformal", "Conformal mapping", "angles\\ preserved", "conformal map", "Analytic maps locally preserve angles when derivative is nonzero.", "Mappings"),
  ]);
}

function topologySpec(): Phase3ConfigSpec {
  return spec("topology", "Topology Formula Visualizer", "Topology", "/topology/formula-visualizer", "topology", "Metric balls, open/closed toggles, neighborhoods, connectedness, finite cover intuition, and homeomorphism deformation demos.", "open-set", "topology", ["topology visualizer", "metric ball", "open closed set", "homeomorphism"], undefined, [
    t("open-set", "Open set", "\\forall x\\in U,\\exists r:B_r(x)\\subset U", "open set", "Every point has a little room inside the set.", "Sets"),
    t("closed-set", "Closed set", "X\\setminus C\\ is\\ open", "closed set", "A closed set contains its boundary behavior.", "Sets"),
    t("neighborhood", "Neighborhood", "N_r(x)", "neighborhood", "A neighborhood surrounds a point.", "Local"),
    t("basis", "Basis", "U=\\bigcup B_i", "basis for topology", "Basic open sets build all open sets.", "Sets"),
    t("topological-continuity", "Continuity", "f^{-1}(open)\\ is\\ open", "topological continuity", "Continuity preserves openness backward.", "Maps"),
    t("compactness", "Compactness", "open\\ cover\\Rightarrow finite\\ subcover", "compactness", "A finite selection can still cover the space.", "Properties"),
    t("connectedness", "Connectedness", "not\\ A\\cup B\\ separated", "connectedness", "A connected space cannot be split into two open-separated pieces.", "Properties"),
    t("homeomorphism", "Homeomorphism", "f,f^{-1}\\ continuous", "homeomorphism", "Two spaces are topologically the same if they deform continuously both ways.", "Maps"),
    t("metric", "Metric space", "d(x,y)", "metric distance", "A metric gives distances satisfying rules.", "Metric"),
  ]);
}

function differentialGeometrySpec(): Phase3ConfigSpec {
  return spec("differential-geometry", "Differential Geometry Formula Visualizer", "Differential Geometry", "/differential-geometry/formula-visualizer", "differential-geometry", "Parametric curves, tangent and normal vectors, curvature, torsion intuition, surfaces, geodesics, and curvature sign examples.", "parametric-curve", "differential-geometry", ["differential geometry visualizer", "curvature visualizer", "geodesic intuition"], undefined, [
    t("parametric-curve", "Curves", "\\vec r(t)", "parametric curve", "A parameter traces a path through space.", "Curves"),
    t("tangent-vector", "Tangent vector", "\\vec r'(t)", "tangent vector", "The derivative points along the curve.", "Curves"),
    t("curvature", "Curvature", "\\kappa=\\frac{|r'\\times r''|}{|r'|^3}", "curvature", "Curvature measures how quickly direction changes.", "Curves"),
    t("torsion", "Torsion", "\\tau", "torsion", "Torsion measures twisting out of the osculating plane.", "Curves", "Advanced"),
    t("surface", "Surface", "\\vec r(u,v)", "parametric surface", "Two parameters sweep a surface.", "Surfaces"),
    t("normal-vector", "Normal vector", "\\vec n=r_u\\times r_v", "surface normal", "Crossed tangent directions give a normal.", "Surfaces"),
    t("first-form", "First fundamental form", "ds^2=Edu^2+2Fdudv+Gdv^2", "first fundamental form", "The first form measures lengths on a surface.", "Surfaces", "Advanced"),
    t("geodesic", "Geodesic", "\\nabla_{\\dot\\gamma}\\dot\\gamma=0", "geodesic", "A geodesic is the straightest available path on a surface.", "Geodesics", "Advanced"),
    t("gaussian-curvature", "Gaussian curvature", "K=k_1k_2", "Gaussian curvature", "Curvature sign separates dome, saddle, and flat behavior.", "Curvature"),
  ]);
}

function discreteMathSpec(): Phase3ConfigSpec {
  return spec("discrete-math", "Discrete Math Formula Visualizer", "Discrete Math", "/discrete-math/formula-visualizer", "discrete-math", "Logic, sets, relations, graphs, trees, recurrence sequences, counting, Boolean algebra, modular arithmetic, and induction.", "truth-table", "discrete-math", ["discrete math visualizer", "truth table visualizer", "recurrence relation", "induction visualizer"], undefined, [
    t("logic", "Logic", "p\\land q", "and statement", "Compound statements combine truth values.", "Logic"),
    t("truth-table", "Truth table", "2^n\\ rows", "truth table rows", "Each variable doubles the number of truth rows.", "Logic"),
    t("sets", "Sets", "A\\cup B, A\\cap B", "set operations", "Set operations combine regions.", "Sets"),
    t("relations", "Relations", "R\\subseteq A\\times B", "relation subset", "A relation is a set of ordered pairs.", "Relations"),
    t("graphs", "Graph basics", "G=(V,E)", "graph vertices edges", "Graphs model connections.", "Graphs"),
    t("trees", "Tree edge count", "|E|=|V|-1", "tree edge count", "A connected acyclic graph has one fewer edge than vertices.", "Graphs"),
    t("recurrence", "Recurrence", "a_n=ra_{n-1}+b", "recurrence relation", "Each term depends on earlier terms.", "Sequences"),
    t("boolean", "Boolean algebra", "x+x'=1", "boolean complement", "Boolean operations model true/false logic.", "Logic"),
    t("induction", "Induction", "P(1), P(k)\\Rightarrow P(k+1)", "mathematical induction", "A base case and step prove an infinite chain.", "Proof"),
  ]);
}

function optimizationSpec(): Phase3ConfigSpec {
  return spec("optimization", "Optimization Formula Visualizer", "Optimization", "/optimization/formula-visualizer", "optimization", "Gradient descent, convexity, constraints, local/global extrema, Lagrange multipliers, Newton steps, and loss surfaces.", "gradient-descent", "optimization", ["optimization visualizer", "gradient descent stepper", "convexity visualizer", "local minima"], undefined, [
    t("objective", "Objective function", "min\\ f(x)", "minimize objective", "Optimization searches for best objective values.", "Objective"),
    t("constraints", "Constraints", "g_i(x)\\le0", "constraints", "Constraints limit the feasible choices.", "Constraints"),
    t("gradient-descent", "Gradient descent", "x_{k+1}=x_k-\\eta\\nabla f(x_k)", "gradient descent", "Move opposite the gradient to reduce the objective.", "Algorithms"),
    t("convexity", "Convexity", "f(tx+(1-t)y)\\le tf(x)+(1-t)f(y)", "convex function", "Convex functions have no misleading local minima.", "Shape"),
    t("local-global", "Local and global extrema", "f(c)\\le f(x)", "minimum", "A local best may not be the global best.", "Extrema"),
    t("lagrange", "Lagrange multipliers", "\\nabla f=\\lambda\\nabla g", "constraint optimization", "At constrained optima, gradients align.", "Constraints"),
    t("newton", "Newton method", "x_{k+1}=x_k-\\frac{f'}{f''}", "Newton optimization step", "Curvature improves the next step estimate.", "Algorithms", "Advanced"),
    t("loss-surface", "Loss surface", "L(\\theta)", "loss surface", "Training searches a surface of parameter losses.", "Applications"),
  ]);
}

function numericalMethodsSpec(): Phase3ConfigSpec {
  return spec("numerical-methods", "Numerical Methods Formula Visualizer", "Numerical Methods", "/numerical-methods/formula-visualizer", "numerical-methods", "Root-finding, iteration tables, tangent/secant steps, numerical integration, Euler method, and error approximation.", "bisection", "numerical-methods", ["numerical methods visualizer", "Newton Raphson visualizer", "bisection method", "Euler method"], undefined, [
    t("bisection", "Bisection method", "c=\\frac{a+b}{2}", "bisection midpoint", "Halve an interval that brackets a root.", "Root Finding"),
    t("newton-raphson", "Newton-Raphson", "x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}", "Newton Raphson", "Use a tangent line to jump toward a root.", "Root Finding"),
    t("secant", "Secant method", "x_{n+1}=x_n-f(x_n)\\frac{x_n-x_{n-1}}{f(x_n)-f(x_{n-1})}", "secant method", "Use two points instead of a derivative.", "Root Finding"),
    t("fixed-point", "Fixed point iteration", "x_{n+1}=g(x_n)", "fixed point", "Repeated substitution may settle at a fixed point.", "Iteration"),
    t("trapezoidal", "Trapezoidal rule", "\\int_a^b f\\approx \\frac h2[y_0+2\\sum y_i+y_n]", "trapezoidal rule", "Trapezoids approximate area under a curve.", "Integration"),
    t("simpson", "Simpson's rule", "\\int_a^b f\\approx \\frac h3[y_0+4y_1+2y_2+\\cdots+y_n]", "Simpson rule", "Parabolic arcs improve area approximation.", "Integration", "Exam"),
    t("euler-method", "Euler method", "y_{n+1}=y_n+hf(x_n,y_n)", "Euler method", "Follow short slope steps to approximate a solution.", "ODE"),
    t("error", "Error approximation", "error=|true-approx|", "absolute error", "Error measures approximation quality.", "Error"),
  ]);
}

function dynamicalSystemsSpec(): Phase3ConfigSpec {
  return spec("dynamical-systems", "Dynamical Systems Formula Visualizer", "Dynamical Systems", "/dynamical-systems/formula-visualizer", "dynamical-systems", "Iteration maps, cobweb diagrams, fixed points, stability, logistic map, phase lines, equilibria, and bifurcation samples.", "iteration-map", "dynamical-systems", ["dynamical systems visualizer", "logistic map", "cobweb diagram", "bifurcation"], undefined, [
    t("iteration-map", "Iteration map", "x_{n+1}=f(x_n)", "iteration map", "Repeatedly feeding output back as input creates dynamics.", "Iteration"),
    t("fixed-point", "Fixed point", "f(x^*)=x^*", "fixed point", "A fixed point maps to itself.", "Stability"),
    t("stability", "Stability", "|f'(x^*)|<1", "stable fixed point", "Nearby points move toward a stable fixed point.", "Stability"),
    t("logistic-map", "Logistic map", "x_{n+1}=rx_n(1-x_n)", "logistic map", "A simple recurrence can settle, oscillate, or become chaotic.", "Maps"),
    t("phase-line", "Phase line", "\\dot x=f(x)", "phase line", "Arrows show one-dimensional motion.", "Flows"),
    t("phase-plane", "Phase plane", "\\dot x=f(x,y),\\dot y=g(x,y)", "phase plane", "Vector fields show two-variable dynamics.", "Flows"),
    t("equilibrium", "Equilibrium", "f(x)=0", "equilibrium", "No motion occurs at equilibrium.", "Flows"),
    t("bifurcation", "Bifurcation", "parameter\\ changes\\ behavior", "bifurcation", "A small parameter change can alter long-term behavior.", "Chaos", "Advanced"),
  ]);
}

function pdeSpec(): Phase3ConfigSpec {
  return spec("pde", "Partial Differential Equations Formula Visualizer", "PDE", "/pde/formula-visualizer", "pde", "Heat diffusion bars, wave strings, boundary conditions, initial presets, time sliders, and separation-of-variables intuition.", "heat-equation", "pde", ["pde visualizer", "heat equation visualizer", "wave equation", "Laplace equation"], undefined, [
    t("heat-equation", "Heat equation", "u_t=\\alpha u_{xx}", "heat equation", "Heat smooths out over time.", "Heat"),
    t("wave-equation", "Wave equation", "u_{tt}=c^2u_{xx}", "wave equation", "Waves move and reflect while preserving oscillation.", "Waves"),
    t("laplace-equation", "Laplace equation", "\\nabla^2u=0", "Laplace equation", "A harmonic function balances neighboring values.", "Elliptic"),
    t("boundary-condition", "Boundary conditions", "u(0,t)=u(L,t)=0", "boundary condition", "Boundary rules anchor the solution.", "Conditions"),
    t("initial-condition", "Initial conditions", "u(x,0)=f(x)", "initial condition", "Initial shape starts the evolution.", "Conditions"),
    t("separation", "Separation of variables", "u(x,t)=X(x)T(t)", "separation of variables", "Split space and time when the equation allows.", "Methods"),
    t("fourier-link", "Fourier link", "u=\\sum b_n\\sin(n\\pi x/L)e^{-\\lambda_nt}", "Fourier heat solution", "Modes decay at different speeds.", "Methods", "Advanced"),
    t("diffusion", "Diffusion intuition", "spread\\ from\\ high\\ to\\ low", "diffusion", "Steep differences flatten with time.", "Heat"),
  ]);
}

function transformsSpec(): Phase3ConfigSpec {
  return spec("fourier-laplace", "Fourier and Laplace Transforms Formula Visualizer", "Fourier Laplace", "/fourier-laplace/formula-visualizer", "fourier-laplace", "Wave decomposition, harmonic sliders, frequency spectrum bars, signal reconstruction, Laplace examples, and convolution intuition.", "fourier-series", "transforms", ["fourier visualizer", "laplace visualizer", "frequency spectrum", "signal reconstruction"], undefined, [
    t("fourier-series", "Fourier series", "f(x)\\sim a_0+\\sum a_n\\cos nx+b_n\\sin nx", "Fourier series", "Periodic signals combine sine and cosine waves.", "Fourier"),
    t("fourier-transform", "Fourier transform", "F(\\omega)=\\int f(t)e^{-i\\omega t}dt", "Fourier transform", "Transform view reveals frequency content.", "Fourier"),
    t("decomposition", "Sine/cosine decomposition", "signal=\\sum harmonics", "harmonic decomposition", "Harmonics add to reconstruct a shape.", "Fourier"),
    t("spectrum", "Frequency spectrum", "|F(\\omega)|", "frequency spectrum", "Bars show which frequencies are strong.", "Fourier"),
    t("laplace", "Laplace transform", "F(s)=\\int_0^\\infty f(t)e^{-st}dt", "Laplace transform", "Laplace converts time behavior into an algebraic domain.", "Laplace"),
    t("inverse-laplace", "Inverse Laplace", "\\mathcal L^{-1}\\{F(s)\\}=f(t)", "inverse Laplace", "The inverse transform returns to time.", "Laplace"),
    t("convolution", "Convolution", "(f*g)(t)=\\int f(\\tau)g(t-\\tau)d\\tau", "convolution", "One signal slides across another.", "Systems"),
    t("transfer", "Transfer function", "H(s)=\\frac{Y(s)}{X(s)}", "transfer function", "A transfer function describes system response.", "Systems"),
  ]);
}

function mathematicalPhysicsSpec(): Phase3ConfigSpec {
  return spec("mathematical-physics", "Mathematical Physics Formula Visualizer", "Mathematical Physics", "/mathematical-physics/formula-visualizer", "mathematical-physics", "Motion graphs, projectile paths, energy bars, oscillators, waves, vector fields, and dimensional checks.", "kinematics", "mathematical-physics", ["mathematical physics visualizer", "kinematics equations", "harmonic oscillator", "vector field"], undefined, [
    t("vectors", "Vectors in physics", "\\vec F=m\\vec a", "force vector", "Vectors encode magnitude and direction.", "Vectors"),
    t("kinematics", "Kinematics", "s=ut+\\frac12at^2", "kinematics equation", "Position changes with velocity and acceleration.", "Motion"),
    t("work-energy", "Work-energy", "W=\\Delta K", "work energy theorem", "Work changes kinetic energy.", "Energy"),
    t("oscillator", "Harmonic oscillator", "x''+\\omega^2x=0", "harmonic oscillator", "Restoring force creates periodic motion.", "Oscillation"),
    t("wave", "Wave basics", "v=f\\lambda", "wave speed", "Wave speed links frequency and wavelength.", "Waves"),
    t("field", "Field intuition", "\\vec F(x,y)", "vector field", "A field assigns a vector to every point.", "Fields"),
    t("dimensions", "Dimensional analysis", "[L]=[L]", "dimension check", "Valid equations balance units.", "Units"),
    t("physics-de", "Physics differential equations", "m x''=F(x)", "Newton differential equation", "Laws often become differential equations.", "Models"),
  ]);
}

function informationTheorySpec(): Phase3ConfigSpec {
  return spec("information-theory", "Information Theory Formula Visualizer", "Information Theory", "/information-theory/formula-visualizer", "information-theory", "Probability sliders, entropy bars, surprise values, mutual information, KL divergence, cross entropy, and noisy channel intuition.", "information-content", "information-theory", ["information theory visualizer", "entropy visualizer", "mutual information", "KL divergence"], undefined, [
    t("information-content", "Information content", "I(x)=-\\log_2p(x)", "surprise", "Rare events carry more information.", "Information"),
    t("entropy", "Entropy", "H(X)=-\\sum p_i\\log_2p_i", "entropy", "Entropy measures average uncertainty.", "Entropy"),
    t("joint-entropy", "Joint entropy", "H(X,Y)", "joint entropy", "Joint entropy measures uncertainty of a pair.", "Entropy"),
    t("conditional-entropy", "Conditional entropy", "H(Y|X)", "conditional entropy", "Knowing X can reduce uncertainty about Y.", "Entropy"),
    t("mutual-information", "Mutual information", "I(X;Y)=H(X)-H(X|Y)", "mutual information", "Mutual information measures shared information.", "Information"),
    t("kl-divergence", "KL divergence", "D_{KL}(P||Q)=\\sum p\\log\\frac pq", "KL divergence", "KL measures mismatch between distributions.", "Divergence", "Advanced"),
    t("cross-entropy", "Cross entropy", "H(P,Q)=-\\sum p\\log q", "cross entropy", "Cross entropy penalizes confident wrong predictions.", "Learning"),
    t("channel-capacity", "Channel capacity", "C=\\max I(X;Y)", "channel capacity", "Capacity is the best information rate through a channel.", "Channels", "Advanced"),
  ]);
}

function machineLearningSpec(): Phase3ConfigSpec {
  return spec("machine-learning-math", "Machine Learning Math Formula Visualizer", "Machine Learning Math", "/machine-learning-math/formula-visualizer", "machine-learning-math", "Regression, loss curves, gradient descent, classification boundaries, sigmoid, neuron weighted sums, and regularization.", "linear-regression", "machine-learning", ["machine learning math visualizer", "linear regression visualizer", "gradient descent loss", "cross entropy"], teacher("Treat ML formulas as geometry plus optimization: data, model, loss, update.", "What does the model change when loss is high?", "Students may think a lower training loss always means better learning; discuss overfitting.", "Fit a line with the slider, then add regularization and observe the trade-off.", "Explain one gradient descent step in words.", ["Functions", "Statistics", "Vectors"], ["Optimization", "Neural networks"]), [
    t("linear-regression", "Linear regression", "\\hat y=mx+b", "linear regression", "A line predicts output from input.", "Regression"),
    t("logistic-regression", "Logistic regression", "p=\\sigma(w\\cdot x+b)", "logistic regression", "Sigmoid converts a score into probability.", "Classification"),
    t("loss", "Loss function", "L=\\frac1n\\sum(\\hat y-y)^2", "mean squared error", "Loss measures prediction error.", "Training"),
    t("gradient-descent", "Gradient descent", "\\theta\\leftarrow\\theta-\\eta\\nabla L", "gradient descent update", "Parameters move downhill on the loss surface.", "Training"),
    t("dot-product", "Dot product", "w\\cdot x=\\sum w_ix_i", "weighted sum", "Dot product combines features with weights.", "Vectors"),
    t("matrix-multiply", "Matrix multiplication", "Y=XW", "matrix multiply", "Batch predictions use matrix multiplication.", "Matrices"),
    t("cross-entropy", "Cross entropy", "-\\sum y\\log\\hat y", "cross entropy loss", "Wrong confident predictions receive large penalty.", "Training"),
    t("regularization", "Regularization", "L+\\lambda||w||^2", "regularization", "Penalty terms discourage overly large weights.", "Training"),
    t("activation", "Activation function", "a=\\sigma(z)", "activation function", "Activation adds nonlinearity to a neuron.", "Neural Nets"),
  ]);
}

function cryptographySpec(): Phase3ConfigSpec {
  return spec("cryptography-math", "Cryptography Math Formula Visualizer", "Cryptography Math", "/cryptography-math/formula-visualizer", "cryptography-math", "Toy-only modular arithmetic, ciphers, inverses, fast exponentiation, Fermat/Euler ideas, and a small RSA learning demo.", "modular-arithmetic", "cryptography", ["cryptography math visualizer", "Caesar cipher visualizer", "modular inverse", "toy RSA"], undefined, [
    t("modular-arithmetic", "Modular arithmetic", "a\\equiv b\\pmod m", "modular arithmetic", "Clock remainders power many cryptography ideas.", "Modular"),
    t("caesar", "Caesar cipher", "C\\equiv P+k\\pmod{26}", "Caesar cipher", "Shift letters by a fixed amount.", "Toy Ciphers"),
    t("affine", "Affine cipher", "C\\equiv aP+b\\pmod{26}", "affine cipher", "Multiply and shift letters modulo 26.", "Toy Ciphers"),
    t("modular-inverse", "Modular inverse", "aa^{-1}\\equiv1\\pmod m", "modular inverse", "An inverse undoes multiplication modulo m.", "Modular"),
    t("fast-exp", "Fast exponentiation", "a^n\\pmod m", "modular exponentiation", "Repeated squaring computes powers efficiently.", "Algorithms"),
    t("fermat", "Fermat theorem", "a^{p-1}\\equiv1\\pmod p", "Fermat theorem", "Prime moduli create useful cycles.", "Theorems"),
    t("euler-phi", "Euler phi", "a^{\\phi(n)}\\equiv1\\pmod n", "Euler theorem", "Coprime bases cycle after phi steps.", "Theorems"),
    t("toy-rsa", "Toy RSA", "c\\equiv m^e\\pmod n", "toy RSA", "Small-number RSA illustrates public-key arithmetic only.", "Toy RSA", "Advanced"),
    t("hashing", "Hash intuition", "message\\to digest", "hashing intuition", "A hash maps data to a fixed-size digest; this demo is not secure.", "Hashing"),
  ]);
}

function spec(
  id: string,
  title: string,
  shortTitle: string,
  route: string,
  formulaCategorySlug: string,
  subtitle: string,
  defaultFormulaId: string,
  visualizerType: FormulaVisualizerType,
  searchTerms: string[],
  teacherNotes: FormulaVisualizerRouteConfig["teacherNotes"],
  formulas: TopicSpec[],
): Phase3ConfigSpec {
  return {
    id,
    title,
    shortTitle,
    route,
    formulaLibraryRoute: `/formulas/${formulaCategorySlug}`,
    subtitle,
    defaultFormulaId,
    visualizerType,
    searchTerms,
    teacherNotes,
    formulas,
  };
}
