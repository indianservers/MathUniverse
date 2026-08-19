import { theoremCategories, theoremCount, type TheoremCategory, type TheoremLibraryItem } from "../../data/theoremLibrary";

export type TheoremProofStatus = "Complete" | "partial" | "weak" | "missing" | "broken";
export type TheoremProofType = "Visual proof" | "formal proof" | "intuition" | "experiment";
export type TheoremProofLevel = "Foundation" | "Intermediate" | "Advanced";

export type VisualStrategyFamily =
  | "Dissection"
  | "Rearrangement"
  | "Conservation"
  | "Transformation"
  | "Symmetry"
  | "Motion or locus"
  | "Measurement"
  | "Coordinate derivation"
  | "Graph behaviour"
  | "Algebra tiles"
  | "Balance model"
  | "Number-line model"
  | "Modular clock"
  | "Counting arrangement"
  | "Set partition"
  | "Probability simulation"
  | "Distribution morphing"
  | "Matrix transformation"
  | "Vector decomposition"
  | "Network flow"
  | "Graph traversal"
  | "Colouring challenge"
  | "Limit process"
  | "Approximation convergence"
  | "Vector field"
  | "Surface or volume deformation"
  | "Contradiction"
  | "Invariant tracking"
  | "Bijection"
  | "Induction"
  | "Optimization landscape"
  | "Physical analogy";

export type TheoremVisualProofRecord = {
  id: string;
  theorem: TheoremLibraryItem;
  category: TheoremCategory;
  theoremName: string;
  categoryName: string;
  categoryId: string;
  route: string;
  existingStatus: TheoremProofStatus;
  proofType: TheoremProofType;
  mathematicalLevel: TheoremProofLevel;
  coreIdea: string;
  visualMetaphor: string;
  interaction: string;
  proofSteps: string;
  engine: string;
  mobileStrategy: string;
  verificationStatus: string;
  accessibility: string;
  estimatedTime: string;
  learningOrder: number;
  searchText: string;
  strategyFamily: VisualStrategyFamily;
};

export type VisualProofCategorySummary = {
  id: string;
  title: string;
  description: string;
  accent: string;
  count: number;
};

const advancedCategoryIds = new Set(["complex-numbers", "optimization-engineering", "graph-theory"]);
const foundationSubtopics = ["angle", "area", "ratio", "unit", "distance", "midpoint", "slope", "divisibility", "mean"];
const experimentCategoryIds = new Set(["probability-statistics"]);
const phaseTwoCategoryIds = new Set(["algebra", "proportional-reasoning", "number-theory"]);
const phaseThreeCategoryIds = new Set(["geometry", "coordinate-geometry"]);
const phaseFourCategoryIds = new Set(["trigonometry", "complex-numbers"]);
const phaseFiveCategoryIds = new Set(["calculus-analysis", "optimization-engineering"]);
const phaseSixCategoryIds = new Set(["probability-statistics", "linear-algebra-vectors"]);
const implementedCategoryIds = new Set([...phaseTwoCategoryIds, ...phaseThreeCategoryIds, ...phaseFourCategoryIds, ...phaseFiveCategoryIds, ...phaseSixCategoryIds]);

const categoryStrategy: Record<string, { family: VisualStrategyFamily; metaphor: string; interaction: string; engine: string }> = {
  algebra: {
    family: "Algebra tiles",
    metaphor: "Tile, area, coefficient, and balance models that turn symbolic equalities into visible preserved quantities.",
    interaction: "Change coefficients, reveal matching regions, compare factor blocks, and step through equivalent forms.",
    engine: "Shared SVG algebra-tile and equation-transformation renderer",
  },
  geometry: {
    family: "Dissection",
    metaphor: "Constraint-preserving diagrams with marked equal lengths, copied angles, conserved areas, and before-after overlays.",
    interaction: "Step through construction lines, toggle measurements, compare equal regions, and test assumption failure cases.",
    engine: "Shared SVG geometry theorem renderer",
  },
  "proportional-reasoning": {
    family: "Measurement",
    metaphor: "Ratio bars, double number lines, scaling rectangles, and matching rate tables.",
    interaction: "Adjust scale factors, compare equivalent ratios, and watch invariant products or quotients stay fixed.",
    engine: "Shared SVG ratio and scale renderer",
  },
  trigonometry: {
    family: "Motion or locus",
    metaphor: "Unit-circle motion, triangle projections, angle sweeps, and synchronized wave traces.",
    interaction: "Move an angle, show projections, compare triangle ratios, and reveal identity-preserving rotations.",
    engine: "Shared SVG unit-circle and triangle renderer",
  },
  "coordinate-geometry": {
    family: "Coordinate derivation",
    metaphor: "Coordinate grids with slope triangles, distance decompositions, determinant sweeps, and conic loci.",
    interaction: "Move points within valid ranges, show helper triangles, trace loci, and compare coordinate expressions.",
    engine: "Shared SVG coordinate-grid renderer",
  },
  "calculus-analysis": {
    family: "Limit process",
    metaphor: "Secant-to-tangent transitions, epsilon bands, accumulating areas, and convergence timelines.",
    interaction: "Adjust step size or tolerance, pause convergence, compare approximations, and reveal assumptions.",
    engine: "Shared SVG graph-limit renderer",
  },
  "number-theory": {
    family: "Modular clock",
    metaphor: "Number lines, clocks, residue grids, factor trees, Euclidean rectangles, and pattern cycles.",
    interaction: "Change modulus, move counters, group factors, and inspect invariant remainders.",
    engine: "Shared SVG number-model renderer",
  },
  "probability-statistics": {
    family: "Probability simulation",
    metaphor: "Outcome partitions, trees, Venn regions, sampling stacks, and distribution morphs with proof labels.",
    interaction: "Change sample size or event partitions with deterministic states and distinguish simulation from proof.",
    engine: "Shared SVG/chart probability and distribution renderer",
  },
  "linear-algebra-vectors": {
    family: "Matrix transformation",
    metaphor: "Grid warps, vector decompositions, span regions, determinant areas, and invariant directions.",
    interaction: "Move basis vectors, transform grids, compare projections, and test rank or independence visually.",
    engine: "Shared SVG vector and matrix-transformation renderer",
  },
  "complex-numbers": {
    family: "Transformation",
    metaphor: "Complex-plane rotation, scaling, root polygons, winding, and labelled mapping regions.",
    interaction: "Rotate arguments, scale moduli, reveal roots, and label intuition versus rigorous proof sketches.",
    engine: "Shared SVG complex-plane renderer",
  },
  "discrete-logic": {
    family: "Induction",
    metaphor: "Domino steps, recursive trees, set partitions, truth tables, and case-splitting boards.",
    interaction: "Advance induction cases, split counted objects, build truth rows, and inspect assumptions.",
    engine: "Shared SVG counting and logic renderer",
  },
  "graph-theory": {
    family: "Graph traversal",
    metaphor: "Node-edge constructions, degree counters, trails, cuts, flows, colourings, and forbidden patterns.",
    interaction: "Trace paths, toggle cuts, colour graphs, grow trees, and inspect invariant counters.",
    engine: "Shared SVG graph/network renderer",
  },
  "optimization-engineering": {
    family: "Optimization landscape",
    metaphor: "Curves, surfaces, feasible regions, gradient arrows, flow fields, transforms, and error timelines.",
    interaction: "Move constraints or parameters, compare before-after states, and prevent invalid mathematical settings.",
    engine: "Shared SVG graph, vector-field, and applied-system renderer",
  },
};

export const theoremVisualProofCategorySummaries: VisualProofCategorySummary[] = theoremCategories.map((category) => ({
  id: category.id,
  title: category.title,
  description: category.description,
  accent: category.accent,
  count: category.theorems.length,
}));

export const theoremVisualProofRecords: TheoremVisualProofRecord[] = theoremCategories.flatMap((category, categoryIndex) =>
  category.theorems.map((theorem, theoremIndex) => {
    const strategy = categoryStrategy[category.id] ?? categoryStrategy.geometry;
    const route = `/theorems/${category.id}/${theorem.slug}`;
    const level = inferLevel(theorem, category);
    const proofType = inferProofType(theorem, category, level);
    const stepCount = theorem.proofSteps?.length ?? 3;

    return {
      id: `${category.id}:${theorem.slug}`,
      theorem,
      category,
      theoremName: theorem.title,
      categoryName: category.title,
      categoryId: category.id,
      route,
      existingStatus: mapExistingStatus(theorem, category),
      proofType,
      mathematicalLevel: level,
      coreIdea: theorem.proofIdea ?? theorem.proofPlan,
      visualMetaphor: strategy.metaphor,
      interaction: strategy.interaction,
      proofSteps: implementedCategoryIds.has(category.id)
        ? `${stepCount} implemented visual states: givens, theorem-specific visual model, invariant/relation, assumption check, and conclusion.`
        : `${stepCount} planned visual states: setup, condition check, invariant/relationship, and conclusion.`,
      engine: strategy.engine,
      mobileStrategy: "Single-column flow, proof stage near top, 44px controls, compact breadcrumbs, resize-safe SVG stage, and non-gesture step buttons.",
      verificationStatus: implementedCategoryIds.has(category.id)
        ? `Theory checked from theorem draft; ${phaseSixCategoryIds.has(category.id) ? "Phase 6" : phaseFiveCategoryIds.has(category.id) ? "Phase 5" : phaseFourCategoryIds.has(category.id) ? "Phase 4" : phaseThreeCategoryIds.has(category.id) ? "Phase 3" : "Phase 2"} implementation checked with category-specific renderer smoke tests.`
        : theorem.proofSteps?.length
          ? "Theory checked from theorem draft; implementation checked by shared renderer in Phase 1."
          : "Theory scaffolded; requires theorem-specific verification in later phase.",
      accessibility: "Keyboard step controls, visible focus, labelled SVG role text, contrast-safe semantic colours, reduced-motion state transitions.",
      estimatedTime: estimateTime(level, theorem),
      learningOrder: categoryIndex * 100 + theoremIndex + 1,
      searchText: [
        theorem.title,
        theorem.statement,
        theorem.subtopic,
        theorem.purpose,
        theorem.whyItMatters,
        theorem.proofIdea,
        theorem.proofPlan,
        theorem.prerequisites.join(" "),
        theorem.commonMistakes?.join(" "),
        category.title,
        category.description,
        level,
        proofType,
        strategy.family,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
      strategyFamily: strategy.family,
    };
  }),
);

export const theoremVisualProofTotal = theoremVisualProofRecords.length;
export const theoremVisualProofExpectedTotal = 299;
export const theoremVisualProofInventoryMatches = theoremVisualProofTotal === theoremCount && theoremVisualProofTotal === theoremVisualProofExpectedTotal;

export const visualProofLearningPaths = [
  {
    title: "Start Seeing Proofs",
    caption: "A gentle route through diagrams, givens, and conclusions.",
    routes: [
      "/theorems/geometry/pythagorean-theorem-1",
      "/theorems/geometry/triangle-angle-sum-theorem-3",
      "/theorems/proportional-reasoning/unit-rate-theorem-7",
    ],
  },
  {
    title: "Algebra Becomes Area",
    caption: "Use tiles and rectangles before symbols get abstract.",
    routes: [
      "/theorems/algebra/completing-square-theorem-7",
      "/theorems/algebra/binomial-theorem-11",
      "/theorems/algebra/am-gm-inequality-8",
    ],
  },
  {
    title: "Motion, Limits, and Change",
    caption: "Watch angle, graph, and optimization ideas move carefully.",
    routes: [
      "/theorems/trigonometry/unit-circle-coordinate-theorem-4",
      "/theorems/calculus-analysis/mean-value-theorem-5",
      "/theorems/optimization-engineering/newton-convergence-theorem-6",
    ],
  },
];

export function getTheoremVisualProofRecord(route: string) {
  return theoremVisualProofRecords.find((record) => record.route === route);
}

export function getTheoremVisualProofCategorySummary(categoryId: string) {
  return theoremVisualProofCategorySummaries.find((category) => category.id === categoryId);
}

function mapExistingStatus(theorem: TheoremLibraryItem, category: TheoremCategory): TheoremProofStatus {
  if (implementedCategoryIds.has(category.id)) return "Complete";
  if (theorem.proofStatus === "visual-ready") return "Complete";
  if (theorem.proofStatus === "draft-ready" && theorem.proofSteps?.length) return "partial";
  if (theorem.proofStatus === "draft-ready") return "weak";
  if (theorem.proofStatus === "planned") return "missing";
  return "weak";
}

function inferLevel(theorem: TheoremLibraryItem, category: TheoremCategory): TheoremProofLevel {
  const text = `${theorem.title} ${theorem.subtopic} ${theorem.statement}`.toLowerCase();
  if (advancedCategoryIds.has(category.id) || theorem.prerequisites.length >= 3 || /(decomposition|duality|canonical|riemann|cauchy|laplace|fourier|stochastic|central limit)/.test(text)) {
    return "Advanced";
  }
  if (foundationSubtopics.some((keyword) => text.includes(keyword)) || theorem.prerequisites.length <= 1) {
    return "Foundation";
  }
  return "Intermediate";
}

function inferProofType(theorem: TheoremLibraryItem, category: TheoremCategory, level: TheoremProofLevel): TheoremProofType {
  const text = `${theorem.title} ${theorem.statement}`.toLowerCase();
  if (experimentCategoryIds.has(category.id) && /(sampling|experimental|distribution|correlation|law of large numbers)/.test(text)) return "experiment";
  if (level === "Advanced" && /(four color|riemann|cauchy|casorati|pontryagin|strong duality|jordan|schur|perron)/.test(text)) return "intuition";
  if (theorem.proofSteps?.length && theorem.proofSteps.length >= 4) return "Visual proof";
  return "Visual proof";
}

function estimateTime(level: TheoremProofLevel, theorem: TheoremLibraryItem) {
  const base = level === "Foundation" ? 7 : level === "Intermediate" ? 10 : 13;
  const extra = Math.min(3, Math.max(0, (theorem.proofSteps?.length ?? 3) - 3));
  return `${base + extra} min`;
}
