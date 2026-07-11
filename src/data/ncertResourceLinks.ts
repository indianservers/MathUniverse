import { getNCERTConcept, type NCERTConcept } from "./ncertConcepts";

export type NCERTResourceLink = {
  label: string;
  href: string;
  type: "formula" | "theorem" | "visual-proof" | "math-lab" | "workspace" | "ar-xr" | "practice" | "reference";
  exactness: "exact" | "category" | "related";
  keywords?: string[];
};

export type NCERTConceptResourceLinks = {
  conceptId: string;
  resources: NCERTResourceLink[];
};

export type NCERTResourceAuditStatus =
  | "Exact"
  | "Category fallback"
  | "Missing but available"
  | "Missing and not available"
  | "Broken"
  | "Not applicable";

export type NCERTResourceAuditRow = {
  ncertRoute: string;
  currentFormulaLink: string;
  currentTheoremLink: string;
  currentProofLink: string;
  currentToolLink: string;
  exactLinkAvailable: string;
  action: string;
};

const formula = (label: string, categoryId: string, keywords: string[] = []): NCERTResourceLink => ({
  label,
  href: `/formulas/${categoryId}`,
  type: "formula",
  exactness: "category",
  keywords,
});

const theorem = (label: string, categoryId: string, slug?: string, exactness: NCERTResourceLink["exactness"] = slug ? "exact" : "category", keywords: string[] = []): NCERTResourceLink => ({
  label,
  href: slug ? `/theorems/${categoryId}/${slug}` : `/theorems/${categoryId}`,
  type: "theorem",
  exactness,
  keywords,
});

const proof = (label: string, categorySlug: string, proofSlug?: string, exactness: NCERTResourceLink["exactness"] = proofSlug ? "exact" : "category", keywords: string[] = []): NCERTResourceLink => ({
  label,
  href: proofSlug ? `/visual-proofs/${categorySlug}/${proofSlug}` : `/visual-proofs/${categorySlug}`,
  type: "visual-proof",
  exactness,
  keywords,
});

const tool = (label: string, href: string, exactness: NCERTResourceLink["exactness"] = "exact", keywords: string[] = []): NCERTResourceLink => ({
  label,
  href,
  type: href.startsWith("/workspace") ? "workspace" : href.startsWith("/modules/ar-math-lab") ? "ar-xr" : "math-lab",
  exactness,
  keywords,
});

const reference = (label: string, href: string, exactness: NCERTResourceLink["exactness"] = "related", keywords: string[] = []): NCERTResourceLink => ({
  label,
  href,
  type: "reference",
  exactness,
  keywords,
});

const byUnitFallback: Record<string, NCERTResourceLink[]> = {
  "Number System": [
    formula("Number system formulas", "number-systems", ["integers", "rational", "irrational", "roots"]),
    proof("Number theory visual proofs", "number-theory"),
    theorem("Number theory theorems", "number-theory"),
  ],
  Arithmetic: [
    formula("Fractions, decimals, and percent formulas", "fractions-decimals-percent", ["percent", "interest", "decimals"]),
    reference("Practice dashboard", "/ncert", "related", ["NCERT practice"]),
  ],
  Algebra: [
    formula("Algebra formulas", "algebra"),
    proof("Algebraic identity proofs", "algebraic-identities"),
    theorem("Algebra theorems", "algebra"),
  ],
  Geometry: [
    formula("Geometry formulas", "geometry"),
    proof("Geometry visual proofs", "geometry"),
    theorem("Geometry theorems", "geometry"),
  ],
  "Coordinate Geometry": [
    formula("Coordinate geometry formulas", "coordinate-geometry"),
    proof("Coordinate geometry proofs", "coordinate-geometry"),
    theorem("Coordinate geometry theorems", "coordinate-geometry"),
  ],
  Trigonometry: [
    formula("Trigonometry formulas", "trigonometry"),
    proof("Trigonometry visual proofs", "trigonometry"),
    theorem("Trigonometry theorems", "trigonometry"),
    tool("Trigonometry lab", "/trigonometry", "related"),
  ],
  Mensuration: [
    formula("Mensuration and units formulas", "mensuration-units"),
    proof("Mensuration visual proofs", "mensuration"),
    tool("3D workspace", "/workspace/3d"),
  ],
  Statistics: [
    formula("Statistics formulas", "statistics"),
    proof("Statistics visual proofs", "statistics"),
    theorem("Probability and statistics theorems", "probability-statistics"),
  ],
  Probability: [
    formula("Probability formulas", "probability"),
    proof("Probability visual proofs", "probability"),
    theorem("Probability and statistics theorems", "probability-statistics"),
  ],
  Matrices: [
    formula("Matrices formulas", "matrices"),
    proof("Matrix visual proofs", "matrices-linear-algebra"),
    theorem("Linear algebra and vectors theorems", "linear-algebra-vectors"),
    tool("Linear algebra lab", "/linear-algebra", "related"),
  ],
  "Advanced Algebra": [
    formula("Relations and functions formulas", "relations-functions"),
    theorem("Discrete math and logic theorems", "discrete-logic"),
    tool("Function explorer", "/math/functions"),
  ],
  Calculus: [
    formula("Derivatives formulas", "derivatives"),
    proof("Calculus visual proofs", "calculus"),
    theorem("Calculus and analysis theorems", "calculus-analysis"),
    tool("Derivatives lab", "/math/derivatives"),
  ],
  Applications: [
    reference("NCERT dashboard", "/ncert", "related"),
    tool("Math workspace", "/workspace", "related"),
  ],
  Reasoning: [
    theorem("Discrete logic theorems", "discrete-logic"),
    reference("Visual proofs hub", "/visual-proofs", "category"),
  ],
};

export const ncertConceptResourceLinks: NCERTConceptResourceLinks[] = [
  {
    conceptId: "class-7-integers",
    resources: [formula("Integer and number formulas", "number-systems"), proof("Integer movement and divisibility proofs", "number-theory", "even-odd-pairing", "exact"), reference("NCERT dashboard", "/ncert")],
  },
  {
    conceptId: "class-7-exponents",
    resources: [formula("Exponent formulas", "algebra"), proof("Laws of exponents visual proof", "logarithms-exponents", "laws-of-exponents-same-base"), theorem("Exponent laws theorem", "algebra", "exponent-laws-theorem-16")],
  },
  {
    conceptId: "class-7-lines-and-triangles",
    resources: [formula("Geometry formulas", "geometry"), proof("Triangle angle sum proof", "geometry", "triangle-angle-sum"), theorem("Triangle angle sum theorem", "geometry", "triangle-angle-sum-theorem-3")],
  },
  {
    conceptId: "class-7-data-handling",
    resources: [formula("Statistics formulas", "statistics"), proof("Mean as balance point", "statistics", "mean-as-balance-point"), proof("Median and quartiles", "statistics", "median-and-quartiles")],
  },
  {
    conceptId: "class-8-algebraic-identities",
    resources: [formula("Algebraic identity formulas", "algebra"), proof("Square of a sum proof", "algebraic-identities", "square-of-sum"), proof("Difference of squares proof", "algebraic-identities", "difference-of-squares")],
  },
  {
    conceptId: "class-8-fractals-and-solid-views",
    resources: [
      formula("Fractals and solid views formulas", "fractals-solid-views", ["sierpinski", "area fractions", "solid views"]),
      reference("Sierpinski visual formula lab", "/visual-formulas/sierpinski-carpet", "exact", ["sierpinski carpet", "retained area", "removed squares"]),
      theorem("Sierpinski retained area principle", "geometry", "sierpinski-retained-area-principle-19", "exact", ["fractals", "retained area"]),
      theorem("Orthographic projection maximum principle", "geometry", "orthographic-projection-maximum-principle-21", "exact", ["solid views", "projection"]),
      proof("Sierpinski retained area proof", "sequences-and-series", "sierpinski-retained-area", "exact", ["fractal area", "sierpinski"]),
      proof("Sierpinski removed square sum proof", "sequences-and-series", "sierpinski-removed-square-sum", "exact", ["finite geometric sum"]),
      proof("Orthographic projection proof", "geometry", "orthographic-projection-from-cube-stacks", "exact", ["top view", "front view", "side view"]),
      proof("Non-unique solid projections proof", "geometry", "non-unique-solid-projections", "exact", ["projection equivalence", "hidden cubes"]),
      tool("Fractal explorer tab", "/ncert/class-8-fractals-and-solid-views?tab=fractal", "exact", ["sierpinski carpet", "self similarity"]),
      tool("Solid views tab", "/ncert/class-8-fractals-and-solid-views?tab=solid", "exact", ["cube stacks", "orthographic projections"]),
      tool("Step-by-step Sierpinski solver", "/problem-solver", "related", ["retained squares", "removed area", "side scale"]),
      tool("3D workspace", "/workspace/3d", "related", ["solid views", "cube stacks", "orthographic projections"]),
      reference("NCERT dashboard", "/ncert", "related"),
    ],
  },
  {
    conceptId: "class-9-euclid-geometry",
    resources: [theorem("Geometry theorems", "geometry"), proof("Geometry proof library", "geometry"), reference("Visual proofs hub", "/visual-proofs", "category")],
  },
  {
    conceptId: "class-9-heron",
    resources: [formula("Geometry formulas", "geometry"), proof("Triangle area proof", "geometry", "triangle-area-half-rectangle"), theorem("Geometry theorems", "geometry")],
  },
  {
    conceptId: "class-10-real-numbers",
    resources: [formula("Number system formulas", "number-systems"), proof("Euclidean algorithm proof", "number-theory", "gcd-euclidean-algorithm"), theorem("Euclidean algorithm theorem", "number-theory", "euclidean-algorithm-theorem-2")],
  },
  {
    conceptId: "class-10-arithmetic-progressions",
    resources: [formula("Sequences and series formulas", "sequences-series"), proof("Arithmetic progression visual proof", "sequences-and-series", "arithmetic-progression-equal-steps"), proof("Sum of AP proof", "sequences-and-series", "sum-arithmetic-progression")],
  },
  {
    conceptId: "class-10-section-formula",
    resources: [formula("Coordinate geometry formulas", "coordinate-geometry"), proof("Section formula visual proof", "coordinate-geometry", "section-formula"), theorem("Section formula theorem", "coordinate-geometry", "section-formula-theorem-3")],
  },
  {
    conceptId: "class-10-heights-distances",
    resources: [formula("Trigonometry formulas", "trigonometry"), proof("Right triangle ratios proof", "trigonometry", "right-triangle-trig-ratios"), tool("Trigonometry lab", "/trigonometry", "related")],
  },
  {
    conceptId: "class-10-polynomials",
    resources: [formula("Polynomial formulas", "polynomials"), theorem("Factor theorem", "algebra", "factor-theorem-1"), proof("Quadratic factorization area model", "algebraic-identities", "quadratic-factorization-area-model"), tool("Polynomial workspace", "/workspace?template=polynomials")],
  },
  {
    conceptId: "class-10-pair-linear",
    resources: [formula("Algebra formulas", "algebra"), proof("Linear system line intersection", "matrices-linear-algebra", "linear-system-line-intersection"), tool("Graph workspace", "/workspace/graph")],
  },
  {
    conceptId: "class-10-quadratic",
    resources: [formula("Quadratic formulas", "polynomials"), theorem("Quadratic discriminant theorem", "algebra", "quadratic-discriminant-theorem-6"), proof("Completing the square proof", "algebraic-identities", "completing-the-square"), tool("Graph workspace", "/workspace/graph")],
  },
  {
    conceptId: "class-10-irrational-numbers",
    resources: [formula("Number system formulas", "number-systems"), proof("Irrationality of sqrt(2)", "number-theory", "irrationality-of-square-root-2"), theorem("Number theory theorems", "number-theory")],
  },
  {
    conceptId: "class-10-polynomial-zero-coefficients",
    resources: [formula("Polynomial formulas", "polynomials"), theorem("Vieta theorem", "algebra", "vieta-theorem-5"), proof("Quadratic factorization area model", "algebraic-identities", "quadratic-factorization-area-model")],
  },
  {
    conceptId: "class-10-linear-substitution-elimination",
    resources: [formula("Algebra formulas", "algebra"), proof("Linear system line intersection", "matrices-linear-algebra", "linear-system-line-intersection"), tool("Graph workspace", "/workspace/graph")],
  },
  {
    conceptId: "class-10-linear-consistency",
    resources: [formula("Algebra formulas", "algebra"), proof("Linear system line intersection", "matrices-linear-algebra", "linear-system-line-intersection"), theorem("Algebra theorems", "algebra")],
  },
  {
    conceptId: "class-10-triangle-bpt-converse",
    resources: [formula("Geometry formulas", "geometry"), proof("Similar triangles proportional sides", "geometry", "similar-triangles-proportional-sides"), theorem("Basic proportionality theorem", "geometry", "basic-proportionality-theorem-10")],
  },
  {
    conceptId: "class-10-similarity-criteria",
    resources: [formula("Geometry formulas", "geometry"), proof("Similar triangles proportional sides", "geometry", "similar-triangles-proportional-sides"), theorem("AA similarity theorem", "geometry", "aa-similarity-theorem-9")],
  },
  {
    conceptId: "class-10-areas-similar-triangles",
    resources: [formula("Geometry formulas", "geometry"), proof("Similar triangles proportional sides", "geometry", "similar-triangles-proportional-sides"), theorem("Homothety scale theorem", "coordinate-geometry", "homothety-scale-theorem-18")],
  },
  {
    conceptId: "class-10-special-trig-angles",
    resources: [formula("Trigonometry formulas", "trigonometry"), proof("Right triangle trig ratios", "trigonometry", "right-triangle-trig-ratios"), proof("Unit circle sine and cosine", "trigonometry", "unit-circle-sine-cosine")],
  },
  {
    conceptId: "class-10-circle-tangent-radius",
    resources: [formula("Geometry formulas", "geometry"), theorem("Tangent radius theorem", "geometry", "tangent-radius-theorem-15"), proof("Circle tangent visual proofs", "geometry", undefined, "category")],
  },
  {
    conceptId: "class-10-two-tangents",
    resources: [formula("Geometry formulas", "geometry"), theorem("Power of a point theorem", "geometry", "power-of-a-point-theorem-18"), proof("Circle tangent visual proofs", "geometry", undefined, "category")],
  },
  {
    conceptId: "class-10-sector-segment-area",
    resources: [formula("Mensuration formulas", "mensuration-units"), proof("Sector area formula proof", "geometry", "sector-area-formula"), proof("Area of circle by unrolling", "geometry", "area-of-circle-by-unrolling")],
  },
  {
    conceptId: "class-10-composite-circle-regions",
    resources: [formula("Mensuration formulas", "mensuration-units"), proof("Circle to triangle proof", "geometry", "circle-to-triangle"), proof("Sector area formula proof", "geometry", "sector-area-formula")],
  },
  {
    conceptId: "class-10-combination-solids",
    resources: [formula("Mensuration formulas", "mensuration-units"), proof("Composite solids proof", "mensuration", "composite-solids-and-units"), tool("3D workspace", "/workspace/3d")],
  },
  {
    conceptId: "class-10-recasting-solids",
    resources: [formula("Mensuration formulas", "mensuration-units"), proof("Cylinder volume and surface area", "mensuration", "cylinder-volume-surface-area"), tool("3D workspace", "/workspace/3d")],
  },
  {
    conceptId: "class-10-frustum-cone",
    resources: [formula("Mensuration formulas", "mensuration-units"), proof("Cone volume and surface area", "mensuration", "cone-volume-surface-area"), tool("3D workspace", "/workspace/3d")],
  },
  {
    conceptId: "class-10-grouped-mean-methods",
    resources: [formula("Statistics formulas", "statistics"), proof("Mean as balance point", "statistics", "mean-as-balance-point"), theorem("Expected value linearity theorem", "probability-statistics", "expected-value-linearity-theorem-6")],
  },
  {
    conceptId: "class-10-grouped-mode",
    resources: [formula("Statistics formulas", "statistics"), proof("Histogram frequency distribution", "statistics", "histogram-frequency-distribution"), theorem("Probability and statistics theorems", "probability-statistics")],
  },
  {
    conceptId: "class-10-grouped-median",
    resources: [formula("Statistics formulas", "statistics"), proof("Median and quartiles", "statistics", "median-and-quartiles"), theorem("Probability and statistics theorems", "probability-statistics")],
  },
  {
    conceptId: "class-12-relations-functions",
    resources: [formula("Relations and functions formulas", "relations-functions"), theorem("Inverse function theorem", "algebra", "inverse-function-theorem-for-algebra-17"), tool("Function explorer", "/math/functions")],
  },
  {
    conceptId: "class-12-determinants",
    resources: [formula("Determinant formulas", "determinants"), proof("Determinant area scale factor", "matrices-linear-algebra", "determinant-area-scale-factor"), theorem("Determinant area theorem", "linear-algebra-vectors", "determinant-area-theorem-7"), tool("Linear algebra lab", "/linear-algebra", "related")],
  },
  {
    conceptId: "class-12-continuity-differentiability",
    resources: [formula("Derivatives formulas", "derivatives"), proof("Derivative as tangent slope", "calculus", "derivative-slope-of-tangent"), theorem("Mean value theorem", "calculus-analysis", "mean-value-theorem-5"), tool("Derivatives lab", "/math/derivatives")],
  },
  {
    conceptId: "class-12-integration-methods",
    resources: [formula("Integral formulas", "integrals"), proof("Definite integral accumulated area", "calculus", "definite-integral-accumulated-area"), theorem("Fundamental theorem of calculus I", "calculus-analysis", "fundamental-theorem-of-calculus-i-8"), tool("Integration lab", "/math/integration")],
  },
  {
    conceptId: "class-12-differential-equations",
    resources: [formula("Differential equations formulas", "differential-equations"), proof("Slope field visual proof", "engineering-mathematics", "first-order-differential-equation-slope-field"), tool("Slope fields lab", "/math/slope-fields")],
  },
  {
    conceptId: "class-12-vectors-3d-geometry",
    resources: [formula("Vector formulas", "vectors"), proof("Vector projection component", "vectors", "vector-projection-component"), theorem("Dot product angle theorem", "linear-algebra-vectors", "dot-product-angle-theorem-14"), tool("Linear algebra lab", "/linear-algebra", "related")],
  },
  {
    conceptId: "class-12-bayes-theorem",
    resources: [formula("Probability formulas", "probability"), theorem("Bayes theorem", "probability-statistics", "bayes-theorem-3"), proof("Conditional probability proof", "probability", "conditional-probability")],
  },
  {
    conceptId: "class-12-linear-programming",
    resources: [formula("Linear programming formulas", "linear-programming"), proof("Linear programming feasible region", "engineering-mathematics", "linear-programming-feasible-region"), tool("Concept map", "/concept-map", "related")],
  },
  {
    conceptId: "class-12-inverse-trig",
    resources: [formula("Trigonometry formulas", "trigonometry"), theorem("Inverse trig range theorem", "trigonometry", "inverse-trig-range-theorem-18"), proof("Complementary angle identities", "trigonometry", "complementary-angle-identities"), tool("Trigonometry lab", "/trigonometry", "related")],
  },
];

const explicitResourceMap = new Map(ncertConceptResourceLinks.map((entry) => [entry.conceptId, entry.resources]));

export function getNCERTConceptResourceLinks(conceptOrId: NCERTConcept | string): NCERTResourceLink[] {
  const concept = typeof conceptOrId === "string" ? getNCERTConcept(conceptOrId) : conceptOrId;
  const explicit = explicitResourceMap.get(typeof conceptOrId === "string" ? conceptOrId : conceptOrId.id);
  if (explicit) return explicit;
  if (!concept) return [reference("NCERT dashboard", "/ncert")];
  return byUnitFallback[concept.unit] ?? [
    reference("NCERT dashboard", "/ncert"),
    reference("Formula library", "/formulas", "category"),
    reference("Visual proofs hub", "/visual-proofs", "category"),
  ];
}

export function getNCERTResourceAuditRow(concept: NCERTConcept): NCERTResourceAuditRow {
  const resources = getNCERTConceptResourceLinks(concept);
  const byType = (type: NCERTResourceLink["type"]) => resources.find((resource) => resource.type === type);
  const proofLink = byType("visual-proof");
  const formulaLink = byType("formula");
  const theoremLink = byType("theorem");
  const toolLink = resources.find((resource) => resource.type === "math-lab" || resource.type === "workspace" || resource.type === "ar-xr");
  const exactCount = resources.filter((resource) => resource.exactness === "exact").length;
  const categoryCount = resources.filter((resource) => resource.exactness === "category").length;

  return {
    ncertRoute: `/ncert/${concept.id}`,
    currentFormulaLink: formatAuditCell(formulaLink),
    currentTheoremLink: formatAuditCell(theoremLink),
    currentProofLink: formatAuditCell(proofLink),
    currentToolLink: formatAuditCell(toolLink),
    exactLinkAvailable: exactCount > 0 ? `Yes (${exactCount} exact, ${categoryCount} category/related)` : "No exact route; category fallback kept",
    action: exactCount > 0 ? "Use centralized exact/resource links" : "Keep documented category fallback",
  };
}

export function formatAuditCell(resource?: NCERTResourceLink) {
  if (!resource) return "Not applicable";
  const status = resource.exactness === "exact" ? "Exact" : resource.exactness === "category" ? "Category fallback" : "Related";
  return `${status}: ${resource.href}`;
}
