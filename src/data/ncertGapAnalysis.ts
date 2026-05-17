export type NCERTGapStatus = "strong" | "partial" | "missing" | "external";

export type NCERTGapItem = {
  classLevel: "Class 7" | "Class 8" | "Class 9" | "Class 10";
  chapter: string;
  status: NCERTGapStatus;
  currentCoverage: string;
  recommendedBuild: string;
  route?: string;
};

export const ncertGapItems: NCERTGapItem[] = [
  { classLevel: "Class 7", chapter: "Integers", status: "strong", currentCoverage: "Interactive integer number-line lab.", recommendedBuild: "Add more word-problem practice sets.", route: "/ncert/class-7-integers" },
  { classLevel: "Class 7", chapter: "Fractions and Decimals", status: "strong", currentCoverage: "Fraction bar, decimal value and number-line conversion lab.", recommendedBuild: "Add operations drill mode.", route: "/ncert/class-7-fractions-decimals" },
  { classLevel: "Class 7", chapter: "Data Handling", status: "external", currentCoverage: "Linked to Anveshak statistics app.", recommendedBuild: "Keep external link, add launch card and kid-level bridge examples.", route: "https://www.aimersociety.com/anveshak/" },
  { classLevel: "Class 7", chapter: "Simple Equations", status: "partial", currentCoverage: "Algebra page and workspace can solve simple expressions.", recommendedBuild: "Balance-scale equation solver with step-by-step inverse operations.", route: "/algebra" },
  { classLevel: "Class 7", chapter: "Lines and Angles", status: "strong", currentCoverage: "Geometry subpages include angles and parallel lines.", recommendedBuild: "Add exercise-style NCERT questions and theorem checks.", route: "/geometry/angles" },
  { classLevel: "Class 7", chapter: "Triangle and its Properties", status: "strong", currentCoverage: "Triangle, Pythagoras, theorem visualizers, and geometry pages.", recommendedBuild: "Add median, altitude, exterior-angle and congruence drills.", route: "/geometry/triangles" },
  { classLevel: "Class 7", chapter: "Comparing Quantities", status: "strong", currentCoverage: "Percentage, percent-change and simple-interest visual lab.", recommendedBuild: "Add marketplace story problems.", route: "/ncert/class-7-comparing-quantities" },
  { classLevel: "Class 7", chapter: "Rational Numbers", status: "strong", currentCoverage: "Rational number-line and decimal comparison lab.", recommendedBuild: "Add operation practice.", route: "/ncert/class-7-rational-numbers" },
  { classLevel: "Class 7", chapter: "Perimeter and Area", status: "strong", currentCoverage: "Shapes and geometry area/perimeter subpage.", recommendedBuild: "Add composite-figure NCERT practice mode.", route: "/geometry/area-perimeter" },
  { classLevel: "Class 7", chapter: "Algebraic Expressions", status: "partial", currentCoverage: "Algebra page supports identities and graphing basics.", recommendedBuild: "Like/unlike terms, expression tiles, substitution and simplification.", route: "/algebra" },
  { classLevel: "Class 7", chapter: "Exponents and Powers", status: "strong", currentCoverage: "Exponent-law block visualizer.", recommendedBuild: "Add standard-form practice.", route: "/ncert/class-7-exponents" },
  { classLevel: "Class 7", chapter: "Symmetry", status: "strong", currentCoverage: "Geometry symmetry subpage.", recommendedBuild: "Add rotational symmetry and pattern-completion puzzles.", route: "/geometry/symmetry" },
  { classLevel: "Class 7", chapter: "Visualising Solid Shapes", status: "strong", currentCoverage: "Shapes explorer and 3D mensuration pages.", recommendedBuild: "Add nets, front/top/side views, and shadow guessing games.", route: "/shapes" },

  { classLevel: "Class 8", chapter: "Rational Numbers", status: "strong", currentCoverage: "Rational number-line and property exploration lab.", recommendedBuild: "Add property sorting quiz.", route: "/ncert/class-8-rational-numbers" },
  { classLevel: "Class 8", chapter: "Linear Equations in One Variable", status: "partial", currentCoverage: "Algebra/workspace can handle some equations.", recommendedBuild: "Dedicated one-variable equation story and balance model.", route: "/algebra" },
  { classLevel: "Class 8", chapter: "Understanding Quadrilaterals", status: "strong", currentCoverage: "Geometry quadrilateral and polygon pages.", recommendedBuild: "Add angle-sum proof games and property sorting.", route: "/geometry/quadrilaterals" },
  { classLevel: "Class 8", chapter: "Practical Geometry", status: "partial", currentCoverage: "Geometry construction page has construction visuals.", recommendedBuild: "Compass-straightedge step player for quadrilateral construction.", route: "/geometry/geometric-constructions" },
  { classLevel: "Class 8", chapter: "Data Handling", status: "external", currentCoverage: "Statistics moved to Anveshak.", recommendedBuild: "Direct launch card with NCERT class 8 datasets.", route: "https://www.aimersociety.com/anveshak/" },
  { classLevel: "Class 8", chapter: "Squares and Square Roots", status: "strong", currentCoverage: "Square/cube root visual tile lab.", recommendedBuild: "Add estimation game.", route: "/ncert/class-8-square-cube-roots" },
  { classLevel: "Class 8", chapter: "Cubes and Cube Roots", status: "strong", currentCoverage: "Square/cube root visual tile lab.", recommendedBuild: "Add 3D cube stacking challenge.", route: "/ncert/class-8-square-cube-roots" },
  { classLevel: "Class 8", chapter: "Comparing Quantities", status: "strong", currentCoverage: "Percent and compound comparison lab.", recommendedBuild: "Add tax/discount worksheet generator.", route: "/ncert/class-8-comparing-quantities" },
  { classLevel: "Class 8", chapter: "Algebraic Expressions and Identities", status: "partial", currentCoverage: "Algebra and workspace include identities but limited practice.", recommendedBuild: "Algebra tiles for identities, multiplication and factorization.", route: "/algebra" },
  { classLevel: "Class 8", chapter: "Mensuration", status: "strong", currentCoverage: "Shapes explorer and 3D measurement labs.", recommendedBuild: "Add NCERT exercise mode and composite solids.", route: "/shapes" },
  { classLevel: "Class 8", chapter: "Exponents and Powers", status: "strong", currentCoverage: "Exponent laws including negative powers.", recommendedBuild: "Add scientific notation scale slider.", route: "/ncert/class-8-exponents" },
  { classLevel: "Class 8", chapter: "Direct and Inverse Proportions", status: "partial", currentCoverage: "Algebra graphing can represent proportionality.", recommendedBuild: "Ratio table, constant k, inverse-area rectangle simulator.", route: "/algebra" },
  { classLevel: "Class 8", chapter: "Factorisation", status: "partial", currentCoverage: "Workspace has basic factor command.", recommendedBuild: "Common-factor tree, identity factoring, algebra-tile factorization.", route: "/workspace" },
  { classLevel: "Class 8", chapter: "Introduction to Graphs", status: "strong", currentCoverage: "Algebra/workspace graphing and coordinate geometry.", recommendedBuild: "Add NCERT table-to-graph exercises.", route: "/workspace" },

  { classLevel: "Class 9", chapter: "Number Systems", status: "strong", currentCoverage: "Real-number hierarchy and root placement lab.", recommendedBuild: "Add decimal expansion classifier.", route: "/ncert/class-9-number-systems" },
  { classLevel: "Class 9", chapter: "Polynomials", status: "partial", currentCoverage: "Algebra and workspace support polynomial graphing/factoring.", recommendedBuild: "Remainder theorem, factor theorem and zero relationship lab.", route: "/algebra" },
  { classLevel: "Class 9", chapter: "Coordinate Geometry", status: "strong", currentCoverage: "Geometry coordinate page and algebra graphs.", recommendedBuild: "Add quadrant games and coordinate plotting quizzes.", route: "/geometry/coordinate-geometry" },
  { classLevel: "Class 9", chapter: "Linear Equations in Two Variables", status: "strong", currentCoverage: "Algebra line and simultaneous-equation labs.", recommendedBuild: "Add infinite-solutions/no-solution visual checks.", route: "/algebra" },
  { classLevel: "Class 9", chapter: "Introduction to Euclid's Geometry", status: "strong", currentCoverage: "Axiom/postulate and proof-flow card lab.", recommendedBuild: "Add proof sequencing quiz.", route: "/ncert/class-9-euclid-geometry" },
  { classLevel: "Class 9", chapter: "Lines and Angles", status: "strong", currentCoverage: "Geometry angles and parallel-line pages.", recommendedBuild: "Add theorem proof steps and exercises.", route: "/geometry/parallel-lines" },
  { classLevel: "Class 9", chapter: "Triangles", status: "strong", currentCoverage: "Triangle, congruence, similarity, Pythagoras pages.", recommendedBuild: "Add congruence-rule proof checker.", route: "/geometry/triangle-congruence" },
  { classLevel: "Class 9", chapter: "Quadrilaterals", status: "strong", currentCoverage: "Quadrilateral page and theorem visualizers.", recommendedBuild: "Add midpoint theorem and parallelogram proof mode.", route: "/geometry/quadrilaterals" },
  { classLevel: "Class 9", chapter: "Circles", status: "strong", currentCoverage: "Circle, arcs, tangents, theorem visualizers.", recommendedBuild: "Add angle in same segment and cyclic quadrilateral pages.", route: "/geometry/circles" },
  { classLevel: "Class 9", chapter: "Heron's Formula", status: "strong", currentCoverage: "Full Heron workflow with side validity, semiperimeter and area.", recommendedBuild: "Add word-problem bank.", route: "/ncert/class-9-heron" },
  { classLevel: "Class 9", chapter: "Surface Areas and Volumes", status: "strong", currentCoverage: "Shapes and 3D mensuration pages.", recommendedBuild: "Add frustum/composite solids practice.", route: "/shapes" },
  { classLevel: "Class 9", chapter: "Statistics", status: "external", currentCoverage: "Anveshak statistics app.", recommendedBuild: "Link class 9 mean/median/mode datasets directly.", route: "https://www.aimersociety.com/anveshak/" },

  { classLevel: "Class 10", chapter: "Real Numbers", status: "strong", currentCoverage: "Euclid algorithm, HCF and LCM visual lab.", recommendedBuild: "Add prime factor tree mode.", route: "/ncert/class-10-real-numbers" },
  { classLevel: "Class 10", chapter: "Polynomials", status: "partial", currentCoverage: "Graphing and basic factoring exist.", recommendedBuild: "Zeros-coefficients relationship and division algorithm lab.", route: "/algebra" },
  { classLevel: "Class 10", chapter: "Pair of Linear Equations", status: "strong", currentCoverage: "Simultaneous equations and graph intersection.", recommendedBuild: "Add elimination/substitution method stepper.", route: "/algebra" },
  { classLevel: "Class 10", chapter: "Quadratic Equations", status: "strong", currentCoverage: "Quadratic graph and workspace solving.", recommendedBuild: "Add completing-square animation and word-problem templates.", route: "/algebra" },
  { classLevel: "Class 10", chapter: "Arithmetic Progressions", status: "strong", currentCoverage: "AP term blocks and sum readout.", recommendedBuild: "Add derivation animation.", route: "/ncert/class-10-arithmetic-progressions" },
  { classLevel: "Class 10", chapter: "Triangles", status: "strong", currentCoverage: "Similarity, Pythagoras and triangle pages.", recommendedBuild: "Add BPT and areas-of-similar-triangles exercise mode.", route: "/geometry/similar-triangles" },
  { classLevel: "Class 10", chapter: "Coordinate Geometry", status: "strong", currentCoverage: "Section formula visualizer plus existing coordinate graph support.", recommendedBuild: "Add triangle-area formula lab.", route: "/ncert/class-10-section-formula" },
  { classLevel: "Class 10", chapter: "Introduction to Trigonometry", status: "strong", currentCoverage: "Unit circle, waves, trig experiments.", recommendedBuild: "Add ratio table drills and identity proof cards.", route: "/trigonometry" },
  { classLevel: "Class 10", chapter: "Applications of Trigonometry", status: "strong", currentCoverage: "Heights-and-distances tangent visual lab.", recommendedBuild: "Add two-angle problem mode.", route: "/ncert/class-10-heights-distances" },
  { classLevel: "Class 10", chapter: "Circles", status: "strong", currentCoverage: "Tangents and circle visualizations exist.", recommendedBuild: "Add tangent-length theorem proof and exercises.", route: "/geometry/tangents" },
  { classLevel: "Class 10", chapter: "Areas Related to Circles", status: "strong", currentCoverage: "Shapes/geometry sector and arc labs.", recommendedBuild: "Add segment area and composite circle regions.", route: "/geometry/arcs-sectors" },
  { classLevel: "Class 10", chapter: "Surface Areas and Volumes", status: "strong", currentCoverage: "Shapes and 3D mensuration labs.", recommendedBuild: "Add conversion of solids and frustum-focused questions.", route: "/shapes" },
  { classLevel: "Class 10", chapter: "Statistics", status: "external", currentCoverage: "Anveshak statistics app.", recommendedBuild: "Deep-link grouped-data mean, median and mode labs.", route: "https://www.aimersociety.com/anveshak/" },
  { classLevel: "Class 10", chapter: "Probability", status: "external", currentCoverage: "Anveshak probability app.", recommendedBuild: "Deep-link dice/card/coin simulations with NCERT examples.", route: "https://www.aimersociety.com/anveshak/" },
];

export const ncertGapSummary = {
  total: ncertGapItems.length,
  strong: ncertGapItems.filter((item) => item.status === "strong").length,
  partial: ncertGapItems.filter((item) => item.status === "partial").length,
  missing: ncertGapItems.filter((item) => item.status === "missing").length,
  external: ncertGapItems.filter((item) => item.status === "external").length,
};
