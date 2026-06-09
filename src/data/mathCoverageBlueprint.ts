export type CoverageStatus = "Live" | "Mapped" | "Needs depth";

export type CoreMathLane = {
  id: string;
  gradeBand: string;
  title: string;
  topics: string[];
  primaryRoute: string;
  labRoutes: string[];
  status: CoverageStatus;
};

export type InteractiveMathTool = {
  id: string;
  title: string;
  purpose: string;
  route: string;
  gradeBand: string;
  dimensions: "2D" | "3D" | "2D + 3D";
  status: CoverageStatus;
};

export type LearningFeature = {
  id: string;
  title: string;
  description: string;
  route: string;
  status: CoverageStatus;
  signals: string[];
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const coreMathLanes: CoreMathLane[] = [
  {
    id: "class-6-8-foundations",
    gradeBand: "Class 6-8",
    title: "Foundational Number, Algebra, Geometry and Data Lane",
    topics: ["Number systems", "Integers", "Fractions", "Decimals", "Ratio and proportion", "Basic algebra", "Basic geometry", "Mensuration", "Data handling"],
    primaryRoute: "/syllabus/class-8",
    labRoutes: ["/number-systems", "/ncert/class-7-simple-equations", "/geometry", "/shapes", "/math-lab/probability"],
    status: "Live",
  },
  {
    id: "class-9-10-board-core",
    gradeBand: "Class 9-10",
    title: "Secondary Board Algebra, Geometry, Trigonometry and Statistics Lane",
    topics: ["Real numbers", "Polynomials", "Linear equations", "Quadratic equations", "Arithmetic progressions", "Triangles", "Coordinate geometry", "Trigonometry", "Circles", "Constructions", "Surface area and volume", "Statistics", "Probability"],
    primaryRoute: "/syllabus/class-10",
    labRoutes: ["/ncert/class-10-polynomials", "/ncert/class-10-pair-linear", "/ncert/class-10-quadratic", "/trigonometry", "/geometry", "/probability-statistics"],
    status: "Live",
  },
  {
    id: "class-11-pre-calculus",
    gradeBand: "Class 11",
    title: "Senior Secondary Functions, Algebra, Coordinate Geometry and Intro Calculus Lane",
    topics: ["Sets", "Relations and functions", "Trigonometric functions", "Complex numbers", "Linear inequalities", "Permutations and combinations", "Binomial theorem", "Sequences and series", "Straight lines", "Conic sections", "3D geometry", "Limits and derivatives", "Statistics", "Probability"],
    primaryRoute: "/syllabus/class-11",
    labRoutes: ["/set-theory", "/trigonometry", "/complex-numbers", "/combinatorics", "/math/limits-continuity", "/math/derivatives"],
    status: "Live",
  },
  {
    id: "class-12-calculus-linear-algebra",
    gradeBand: "Class 12",
    title: "Board Calculus, Matrices, Vectors, 3D Geometry and Probability Lane",
    topics: ["Relations and functions", "Inverse trigonometry", "Matrices", "Determinants", "Continuity and differentiability", "Applications of derivatives", "Integrals", "Applications of integrals", "Differential equations", "Vectors", "3D geometry", "Linear programming", "Probability"],
    primaryRoute: "/syllabus/class-12",
    labRoutes: ["/trigonometry", "/matrices", "/calculus", "/math/integration", "/math/slope-fields", "/linear-algebra", "/probability-statistics"],
    status: "Live",
  },
];

export const interactiveMathTools: InteractiveMathTool[] = [
  { id: "number-line-explorer", title: "Number Line Explorer", purpose: "Compare integers, rationals, decimals, surds and real-number density.", route: "/number-systems", gradeBand: "Class 6-10", dimensions: "2D", status: "Live" },
  { id: "fraction-decimal-visualizer", title: "Fraction and Decimal Visualizer", purpose: "Show equivalence, place value, decimal expansion and fraction operations.", route: "/ncert/class-7-fractions-decimals", gradeBand: "Class 6-8", dimensions: "2D", status: "Live" },
  { id: "algebra-balance-scale", title: "Algebra Balance Scale", purpose: "Solve simple and linear equations with inverse operations.", route: "/ncert/class-7-simple-equations", gradeBand: "Class 7-9", dimensions: "2D", status: "Live" },
  { id: "polynomial-roots-lab", title: "Polynomial Graph and Roots Lab", purpose: "Connect polynomial coefficients, graph crossings, roots and factor form.", route: "/ncert/class-10-polynomials", gradeBand: "Class 9-11", dimensions: "2D", status: "Live" },
  { id: "linear-intersection-lab", title: "Linear Equations Intersection Lab", purpose: "Classify unique, no-solution and infinitely-many solution systems.", route: "/ncert/class-10-pair-linear", gradeBand: "Class 9-10", dimensions: "2D", status: "Live" },
  { id: "quadratic-parabola-lab", title: "Quadratic Parabola Lab", purpose: "Explore discriminant, vertex, axis, roots and coefficient changes.", route: "/ncert/class-10-quadratic", gradeBand: "Class 10-11", dimensions: "2D", status: "Live" },
  { id: "triangle-similarity-proof", title: "Triangle Similarity Proof Explorer", purpose: "Drag triangles, compare ratios and inspect AA/SSS/SAS similarity.", route: "/geometry/triangles", gradeBand: "Class 7-10", dimensions: "2D", status: "Live" },
  { id: "unit-circle-lab", title: "Trigonometry Unit-Circle Lab", purpose: "Connect angle, sine, cosine, tangent and wave graphs.", route: "/trigonometry/unit-circle", gradeBand: "Class 10-12", dimensions: "2D + 3D", status: "Live" },
  { id: "coordinate-geometry-plotter", title: "Coordinate Geometry Plotter", purpose: "Plot points, lines, distance, midpoint, section formula and slopes.", route: "/geometry/coordinate-geometry", gradeBand: "Class 8-11", dimensions: "2D", status: "Live" },
  { id: "circle-theorem-visualizer", title: "Circle Theorem Visualizer", purpose: "Inspect arcs, sectors, tangents, chords, angles and circle measures.", route: "/geometry/circles", gradeBand: "Class 9-10", dimensions: "2D", status: "Live" },
  { id: "mensuration-shape-lab", title: "Mensuration 2D/3D Shape Lab", purpose: "Compare area, perimeter, surface area, volume, nets and solid models.", route: "/shapes", gradeBand: "Class 6-10", dimensions: "2D + 3D", status: "Live" },
  { id: "statistics-lab", title: "Statistics Histogram and Mean-Median Lab", purpose: "Visualize mean, median, mode, spread, histograms and data interpretation.", route: "/probability-statistics", gradeBand: "Class 7-12", dimensions: "2D", status: "Mapped" },
  { id: "probability-simulator", title: "Probability Dice/Card Simulator", purpose: "Run chance experiments, trees, outcomes, dice/card simulations and empirical probability.", route: "/math-lab/probability", gradeBand: "Class 8-12", dimensions: "2D", status: "Live" },
  { id: "matrix-transformation-lab", title: "Matrix Transformation Lab", purpose: "Show transformations, determinants, inverse, rank, systems and eigen directions.", route: "/matrices", gradeBand: "Class 12+", dimensions: "2D + 3D", status: "Live" },
  { id: "calculus-visualizer", title: "Calculus Limit/Derivative/Integral Visualizer", purpose: "Connect limits, tangents, rates, area accumulation and slope fields.", route: "/calculus", gradeBand: "Class 11-12", dimensions: "2D + 3D", status: "Live" },
  { id: "vector-3d-geometry-scene", title: "Vector and 3D Geometry Scene", purpose: "Explore vectors, planes, direction ratios, direction cosines and 3D relationships.", route: "/linear-algebra", gradeBand: "Class 12+", dimensions: "3D", status: "Live" },
];

export const learningFeatures: LearningFeature[] = [
  {
    id: "chapter-journeys",
    title: "Chapter journeys based on strengths and gaps",
    description: "Uses local quiz scores and completion signals to recommend what to revise, practice, or stretch next.",
    route: "/learn",
    status: "Live",
    signals: ["Best quiz score", "Visited topic", "Completed syllabus cards", "Daily activity"],
  },
  {
    id: "daily-challenges",
    title: "Daily challenges",
    description: "Calendar-seeded daily math problem with streaks and heatmap activity.",
    route: "/daily-challenge",
    status: "Live",
    signals: ["Solved today", "Current streak", "56-day heatmap"],
  },
  {
    id: "topic-games-puzzles",
    title: "Topic-wise games and puzzles",
    description: "Puzzle-ready entry points for graph, geometry, probability, logic and spaced-repetition practice.",
    route: "/spaced-repetition",
    status: "Mapped",
    signals: ["Topic selection", "Recall card", "Retry loop"],
  },
  {
    id: "adaptive-practice",
    title: "Adaptive practice",
    description: "Learners are routed to foundation, practice, or challenge actions based on their strongest and weakest local score bands.",
    route: "/quiz",
    status: "Live",
    signals: ["Score below 50", "Score 50-79", "Score 80+"],
  },
  {
    id: "instant-feedback",
    title: "Instant feedback per step",
    description: "Quiz explanations, problem-solver steps, and assisted hints give immediate correction loops.",
    route: "/problem-solver",
    status: "Live",
    signals: ["Answer state", "Hint used", "Step explanation"],
  },
  {
    id: "mistake-diagnosis",
    title: "Mistake diagnosis",
    description: "Wrong answers are reviewed after quizzes and mapped into recommended remedial topic actions.",
    route: "/quiz",
    status: "Live",
    signals: ["Wrong answer review", "Assisted answer flag", "Topic weakness"],
  },
  {
    id: "question-bank",
    title: "Large question bank by difficulty",
    description: "The structure supports difficulty-banded banks; current quiz data is live but should keep expanding topic by topic.",
    route: "/quiz",
    status: "Needs depth",
    signals: ["Topic", "Difficulty", "Best score"],
  },
  {
    id: "revision-tests",
    title: "Revision tests and checkpoints",
    description: "Best-score tracking, spaced repetition, daily checks and syllabus completion form the checkpoint layer.",
    route: "/spaced-repetition",
    status: "Live",
    signals: ["Best score", "Completion", "Recall cadence"],
  },
  {
    id: "micro-lessons",
    title: "Animated micro-lessons for every concept",
    description: "Every Class 6-12 board pack now links to a 2D/3D visual lesson shell; bespoke animations can be deepened per chapter.",
    route: "/syllabus",
    status: "Mapped",
    signals: ["2D view", "3D view", "Coverage checklist"],
  },
];

export const coverageSummary = {
  coreLaneCount: coreMathLanes.length,
  toolCount: interactiveMathTools.length,
  learningFeatureCount: learningFeatures.length,
  liveToolCount: interactiveMathTools.filter((tool) => tool.status === "Live").length,
};

export function toolIdFromTitle(title: string) {
  return slug(title);
}
