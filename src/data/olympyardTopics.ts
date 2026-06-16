export type OlympyardGradeBand = "class-1-2" | "class-3-4" | "class-5-6" | "class-7-8" | "class-9-10";

export type OlympyardDifficulty = "warm-up" | "basic" | "intermediate" | "advanced" | "speed";

export type OlympyardMode = "beginner" | "olympiad";

export type OlympyardTopic = {
  id: string;
  title: string;
  description: string;
  gradeBands: OlympyardGradeBand[];
  difficultyRange: OlympyardDifficulty[];
  visualModel: string;
  route?: string;
  prerequisites?: string[];
  availableQuestions: number;
};

export const olympyardGradeBands: Array<{ id: "all" | OlympyardGradeBand; label: string }> = [
  { id: "all", label: "All classes" },
  { id: "class-1-2", label: "Class 1-2" },
  { id: "class-3-4", label: "Class 3-4" },
  { id: "class-5-6", label: "Class 5-6" },
  { id: "class-7-8", label: "Class 7-8" },
  { id: "class-9-10", label: "Class 9-10" },
];

export const olympyardDifficulties: Array<{ id: "all" | OlympyardDifficulty; label: string }> = [
  { id: "all", label: "All levels" },
  { id: "warm-up", label: "Warm-up" },
  { id: "basic", label: "School Basic" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "speed", label: "Speed Round" },
];

export const olympyardTopics: OlympyardTopic[] = [
  {
    id: "number-sense",
    title: "Number Sense",
    description: "Build quantities, compare numbers, and reason with place value before symbols.",
    gradeBands: ["class-1-2", "class-3-4", "class-5-6"],
    difficultyRange: ["warm-up", "basic"],
    visualModel: "Counting blocks, ten frames, number lines",
    route: "/number-systems",
    prerequisites: ["Counting", "More and less"],
    availableQuestions: 0,
  },
  {
    id: "arithmetic-tricks",
    title: "Arithmetic Tricks",
    description: "Use mental math, digit roots, shortcuts, and reversible checks.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8"],
    difficultyRange: ["warm-up", "basic", "intermediate"],
    visualModel: "Number cards, digit paths, operation chips",
    route: "/magic-maths",
    prerequisites: ["Addition", "Multiplication facts"],
    availableQuestions: 0,
  },
  {
    id: "fractions-decimals",
    title: "Fractions and Decimals",
    description: "Compare part-whole models, decimal grids, and equivalent values.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8"],
    difficultyRange: ["basic", "intermediate"],
    visualModel: "Fraction strips, decimal grids, number lines",
    route: "/number-systems",
    prerequisites: ["Division", "Place value"],
    availableQuestions: 0,
  },
  {
    id: "ratios-proportions",
    title: "Ratios and Proportions",
    description: "Scale recipes, maps, shapes, and unit rates with linked visuals.",
    gradeBands: ["class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["basic", "intermediate", "advanced"],
    visualModel: "Ratio bars, double number lines, scale diagrams",
    route: "/geometry/similar-triangles",
    prerequisites: ["Fractions", "Multiplication"],
    availableQuestions: 0,
  },
  {
    id: "patterns-sequences",
    title: "Patterns and Sequences",
    description: "Spot rules in growing patterns, tables, grids, and number strings.",
    gradeBands: ["class-1-2", "class-3-4", "class-5-6", "class-7-8"],
    difficultyRange: ["warm-up", "basic", "intermediate"],
    visualModel: "Growing tiles, term cards, pattern builders",
    route: "/visual-proofs/sequences-and-series",
    prerequisites: ["Counting", "Skip counting"],
    availableQuestions: 0,
  },
  {
    id: "logical-reasoning",
    title: "Logical Reasoning",
    description: "Train statements, cases, grids, truth patterns, and elimination.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["basic", "intermediate", "advanced"],
    visualModel: "Truth tables, clue grids, relation maps",
    route: "/mathematical-logic",
    prerequisites: ["Careful reading"],
    availableQuestions: 0,
  },
  {
    id: "number-theory",
    title: "Number Theory",
    description: "Explore primes, remainders, modular clocks, and hidden structure.",
    gradeBands: ["class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["basic", "intermediate", "advanced"],
    visualModel: "Prime grids, factor trees, modular clocks",
    route: "/visual-proofs/number-theory",
    prerequisites: ["Factors", "Multiples"],
    availableQuestions: 0,
  },
  {
    id: "divisibility-rules",
    title: "Divisibility Rules",
    description: "Use place value and digit sums to test divisibility quickly.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8"],
    difficultyRange: ["basic", "intermediate"],
    visualModel: "Digit cards, place-value splits, remainder checks",
    route: "/visual-proofs/number-theory",
    prerequisites: ["Multiplication", "Place value"],
    availableQuestions: 0,
  },
  {
    id: "factors-multiples",
    title: "Factors and Multiples",
    description: "Build arrays, common multiples, HCF, and LCM visually.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8"],
    difficultyRange: ["basic", "intermediate"],
    visualModel: "Rectangular arrays, factor ladders, multiple tracks",
    route: "/number-systems",
    prerequisites: ["Multiplication facts"],
    availableQuestions: 0,
  },
  {
    id: "geometry-reasoning",
    title: "Geometry Reasoning",
    description: "Reason from diagrams, marks, symmetry, and construction clues.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["basic", "intermediate", "advanced"],
    visualModel: "Marked diagrams, proof cues, construction overlays",
    route: "/geometry",
    prerequisites: ["Shapes", "Angles"],
    availableQuestions: 0,
  },
  {
    id: "area-perimeter",
    title: "Area and Perimeter",
    description: "Solve tiling, boundary, composite shape, and optimization puzzles.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8"],
    difficultyRange: ["basic", "intermediate", "advanced"],
    visualModel: "Grid tiles, boundary trace, composite regions",
    route: "/geometry/area-perimeter",
    prerequisites: ["Length", "Multiplication"],
    availableQuestions: 0,
  },
  {
    id: "counting-combinatorics",
    title: "Counting and Combinatorics",
    description: "Use organized counting, arrangements, selections, and tree diagrams.",
    gradeBands: ["class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["intermediate", "advanced", "speed"],
    visualModel: "Counting trees, slots, Pascal rows",
    route: "/combinatorics",
    prerequisites: ["Multiplication", "Patterns"],
    availableQuestions: 0,
  },
  {
    id: "probability-puzzles",
    title: "Probability Puzzles",
    description: "Reason with chance, dice, cards, spinners, and sample spaces.",
    gradeBands: ["class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["basic", "intermediate", "advanced"],
    visualModel: "Sample spaces, dice grids, probability bars",
    route: "/math-lab/probability",
    prerequisites: ["Fractions", "Counting"],
    availableQuestions: 0,
  },
  {
    id: "data-interpretation",
    title: "Data Interpretation",
    description: "Read tables, charts, averages, and misleading visuals like a contest solver.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["basic", "intermediate", "speed"],
    visualModel: "Bar charts, tables, dot plots, quick comparisons",
    route: "/probability-statistics",
    prerequisites: ["Reading charts"],
    availableQuestions: 0,
  },
  {
    id: "clock-calendar",
    title: "Clock and Calendar",
    description: "Crack time, angles, cycles, days, dates, and modular patterns.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8"],
    difficultyRange: ["basic", "intermediate", "advanced"],
    visualModel: "Clock face, week cycles, modular calendars",
    route: "/magic-maths",
    prerequisites: ["Time", "Remainders"],
    availableQuestions: 0,
  },
  {
    id: "algebraic-thinking",
    title: "Algebraic Thinking",
    description: "Use boxes, balances, rules, and patterns before formal equations.",
    gradeBands: ["class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["basic", "intermediate", "advanced"],
    visualModel: "Balance scales, rule machines, expression chips",
    route: "/algebra",
    prerequisites: ["Operations", "Patterns"],
    availableQuestions: 0,
  },
  {
    id: "word-problems",
    title: "Word Problems",
    description: "Translate stories into diagrams, equations, and answer checks.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["basic", "intermediate", "advanced", "speed"],
    visualModel: "Story boards, bar models, equation builders",
    route: "/problem-solver",
    prerequisites: ["Reading", "Arithmetic"],
    availableQuestions: 0,
  },
  {
    id: "mixed-mock-test",
    title: "Mixed Review",
    description: "A contest-style route through mixed topics, pacing, review, and stamina.",
    gradeBands: ["class-3-4", "class-5-6", "class-7-8", "class-9-10"],
    difficultyRange: ["basic", "intermediate", "advanced", "speed"],
    visualModel: "Mixed challenge queue, score bands, review trail",
    route: "/quiz",
    prerequisites: ["Any three topic tracks"],
    availableQuestions: 0,
  },
];

export function filterOlympyardTopics(
  topics: OlympyardTopic[],
  grade: "all" | OlympyardGradeBand,
  difficulty: "all" | OlympyardDifficulty,
) {
  return topics.filter((topic) => {
    const gradeMatch = grade === "all" || topic.gradeBands.includes(grade);
    const difficultyMatch = difficulty === "all" || topic.difficultyRange.includes(difficulty);
    return gradeMatch && difficultyMatch;
  });
}

export function olympyardTopicById(id: string | null | undefined) {
  return olympyardTopics.find((topic) => topic.id === id);
}
