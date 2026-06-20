import { formulaCategories, type FormulaCategory, type FormulaLibraryItem } from "../data/formulaLibrary";
import { theoremCategories, type TheoremCategory, type TheoremLibraryItem } from "../data/theoremLibrary";
import { visualProofsIndex } from "../visual-proofs/data/visualProofsIndex";

export type FormulaLearningMatch = FormulaLibraryItem & {
  category: FormulaCategory;
  route: string;
};

export type TheoremLearningMatch = TheoremLibraryItem & {
  category: TheoremCategory;
  route: string;
};

export type VisualProofLearningMatch = {
  title: string;
  route: string;
  categorySlug: string;
};

export type CuratedFormulaLearningLink = {
  formulaCategoryId: string;
  formulaTitle: string;
  theoremTitles: string[];
  visualProofRoutes: string[];
};

export type CuratedLearningLinks = {
  formulas: FormulaLearningMatch[];
  theorems: TheoremLearningMatch[];
  visualProofs: VisualProofLearningMatch[];
};

export type CuratedLearningLinkIssue = {
  linkKey: string;
  message: string;
};

export type ProofLearningCertificationSeed = {
  id: string;
  label: string;
  formulaCategoryId: string;
  formulaTitle: string;
};

export type ProofLearningCertificationJourney = ProofLearningCertificationSeed & {
  formulaRoute: string;
  theoremRoute: string;
  theoremTitle: string;
  visualProofRoute: string;
  visualProofTitle: string;
};

export const curatedFormulaLearningLinks: CuratedFormulaLearningLink[] = [
  {
    formulaCategoryId: "geometry",
    formulaTitle: "Pythagorean theorem",
    theoremTitles: ["Pythagorean theorem", "Converse of Pythagoras"],
    visualProofRoutes: ["/visual-proofs/geometry/pythagorean-theorem-area-rearrangement"],
  },
  {
    formulaCategoryId: "geometry",
    formulaTitle: "Triangle area",
    theoremTitles: ["Area sine theorem"],
    visualProofRoutes: ["/visual-proofs/geometry/triangle-area-half-rectangle"],
  },
  {
    formulaCategoryId: "geometry",
    formulaTitle: "Circle circumference",
    theoremTitles: ["Tangent radius theorem"],
    visualProofRoutes: ["/visual-proofs/geometry/circle-circumference-unwrapping"],
  },
  {
    formulaCategoryId: "geometry",
    formulaTitle: "Circle area",
    theoremTitles: ["Tangent radius theorem"],
    visualProofRoutes: ["/visual-proofs/geometry/area-of-circle-by-unrolling"],
  },
  {
    formulaCategoryId: "trigonometry",
    formulaTitle: "Basic ratios",
    theoremTitles: ["Unit circle coordinate theorem", "Tangent quotient theorem"],
    visualProofRoutes: ["/visual-proofs/trigonometry/right-triangle-trig-ratios"],
  },
  {
    formulaCategoryId: "trigonometry",
    formulaTitle: "Pythagorean identities",
    theoremTitles: ["Pythagorean identity theorem"],
    visualProofRoutes: ["/visual-proofs/trigonometry/pythagorean-trig-identity"],
  },
  {
    formulaCategoryId: "trigonometry",
    formulaTitle: "Angle sum",
    theoremTitles: ["Sine addition theorem"],
    visualProofRoutes: ["/visual-proofs/trigonometry/sine-angle-addition"],
  },
  {
    formulaCategoryId: "trigonometry",
    formulaTitle: "Cosine angle sum",
    theoremTitles: ["Cosine addition theorem"],
    visualProofRoutes: ["/visual-proofs/trigonometry/cosine-angle-addition"],
  },
  {
    formulaCategoryId: "trigonometry",
    formulaTitle: "Double angle",
    theoremTitles: ["Double angle theorem"],
    visualProofRoutes: ["/visual-proofs/trigonometry/double-angle-identities"],
  },
  {
    formulaCategoryId: "trigonometry",
    formulaTitle: "Sine rule",
    theoremTitles: ["Sine rule"],
    visualProofRoutes: ["/visual-proofs/trigonometry/sine-rule-proof"],
  },
  {
    formulaCategoryId: "trigonometry",
    formulaTitle: "Cosine rule",
    theoremTitles: ["Cosine rule"],
    visualProofRoutes: ["/visual-proofs/trigonometry/cosine-rule-proof"],
  },
  {
    formulaCategoryId: "coordinate-geometry",
    formulaTitle: "Distance formula",
    theoremTitles: ["Distance formula theorem"],
    visualProofRoutes: ["/visual-proofs/coordinate-geometry/distance-formula"],
  },
  {
    formulaCategoryId: "coordinate-geometry",
    formulaTitle: "Midpoint",
    theoremTitles: ["Midpoint theorem"],
    visualProofRoutes: ["/visual-proofs/coordinate-geometry/midpoint-formula"],
  },
  {
    formulaCategoryId: "coordinate-geometry",
    formulaTitle: "Slope",
    theoremTitles: ["Slope criterion for parallel lines", "Slope criterion for perpendicular lines"],
    visualProofRoutes: ["/visual-proofs/coordinate-geometry/slope-formula"],
  },
  {
    formulaCategoryId: "coordinate-geometry",
    formulaTitle: "Point-slope line",
    theoremTitles: ["Two-point line theorem"],
    visualProofRoutes: ["/visual-proofs/coordinate-geometry/point-slope-line-equation"],
  },
  {
    formulaCategoryId: "coordinate-geometry",
    formulaTitle: "Circle",
    theoremTitles: ["Circle center-radius theorem"],
    visualProofRoutes: ["/visual-proofs/coordinate-geometry/circle-equation"],
  },
  {
    formulaCategoryId: "derivatives",
    formulaTitle: "Definition",
    theoremTitles: ["Mean value theorem"],
    visualProofRoutes: ["/visual-proofs/calculus/derivative-slope-of-tangent"],
  },
  {
    formulaCategoryId: "derivatives",
    formulaTitle: "Power rule",
    theoremTitles: ["Taylor theorem"],
    visualProofRoutes: ["/visual-proofs/calculus/derivative-power-rule"],
  },
  {
    formulaCategoryId: "derivatives",
    formulaTitle: "Product rule",
    theoremTitles: ["Integration by parts theorem"],
    visualProofRoutes: ["/visual-proofs/calculus/product-rule-visual-proof"],
  },
  {
    formulaCategoryId: "derivatives",
    formulaTitle: "Chain rule",
    theoremTitles: ["Change of variables theorem"],
    visualProofRoutes: ["/visual-proofs/calculus/chain-rule-visual-proof"],
  },
  {
    formulaCategoryId: "integrals",
    formulaTitle: "Fundamental theorem",
    theoremTitles: ["Fundamental theorem of calculus I", "Fundamental theorem of calculus II"],
    visualProofRoutes: ["/visual-proofs/calculus/fundamental-theorem-of-calculus"],
  },
  {
    formulaCategoryId: "integrals",
    formulaTitle: "Integration by parts",
    theoremTitles: ["Integration by parts theorem"],
    visualProofRoutes: ["/visual-proofs/calculus/integration-by-parts-visual-proof"],
  },
  {
    formulaCategoryId: "vectors",
    formulaTitle: "Dot product",
    theoremTitles: ["Dot product angle theorem", "Cauchy-Schwarz inequality"],
    visualProofRoutes: ["/visual-proofs/vectors/dot-product-as-projection"],
  },
  {
    formulaCategoryId: "vectors",
    formulaTitle: "Cross product magnitude",
    theoremTitles: ["Cross product area theorem"],
    visualProofRoutes: ["/visual-proofs/vectors/cross-product-area"],
  },
  {
    formulaCategoryId: "vectors",
    formulaTitle: "Projection",
    theoremTitles: ["Orthogonal projection theorem"],
    visualProofRoutes: ["/visual-proofs/vectors/vector-projection-component"],
  },
  {
    formulaCategoryId: "complex-numbers",
    formulaTitle: "Modulus",
    theoremTitles: ["Triangle inequality complex theorem"],
    visualProofRoutes: ["/visual-proofs/complex-numbers/modulus-and-argument"],
  },
  {
    formulaCategoryId: "complex-numbers",
    formulaTitle: "Euler form",
    theoremTitles: ["Euler formula theorem"],
    visualProofRoutes: ["/visual-proofs/complex-numbers/euler-form-unit-circle"],
  },
  {
    formulaCategoryId: "probability",
    formulaTitle: "Addition rule two events",
    theoremTitles: ["Addition rule theorem"],
    visualProofRoutes: ["/visual-proofs/probability/addition-rule-overlapping-events"],
  },
  {
    formulaCategoryId: "probability",
    formulaTitle: "Multiplication rule",
    theoremTitles: ["Multiplication rule theorem"],
    visualProofRoutes: ["/visual-proofs/probability/multiplication-rule-independent-events"],
  },
  {
    formulaCategoryId: "statistics",
    formulaTitle: "Population mean",
    theoremTitles: ["Expected value linearity theorem"],
    visualProofRoutes: ["/visual-proofs/statistics/mean-as-balance-point"],
  },
  {
    formulaCategoryId: "sequences-series",
    formulaTitle: "Arithmetic nth term",
    theoremTitles: ["Binomial theorem"],
    visualProofRoutes: ["/visual-proofs/sequences-and-series/arithmetic-progression-equal-steps"],
  },
  {
    formulaCategoryId: "sequences-series",
    formulaTitle: "Geometric sum",
    theoremTitles: ["Ratio test theorem"],
    visualProofRoutes: ["/visual-proofs/sequences-and-series/finite-geometric-series-sum"],
  },
];

export const proofLearningCertificationSeeds: ProofLearningCertificationSeed[] = [
  { id: "geometry-pythagorean", label: "Geometry: Pythagorean theorem", formulaCategoryId: "geometry", formulaTitle: "Pythagorean theorem" },
  { id: "trigonometry-pythagorean-identity", label: "Trigonometry: Pythagorean identity", formulaCategoryId: "trigonometry", formulaTitle: "Pythagorean identities" },
  { id: "coordinate-distance", label: "Coordinate Geometry: Distance formula", formulaCategoryId: "coordinate-geometry", formulaTitle: "Distance formula" },
  { id: "calculus-fundamental-theorem", label: "Calculus: Fundamental theorem", formulaCategoryId: "integrals", formulaTitle: "Fundamental theorem" },
  { id: "probability-addition-rule", label: "Probability: Addition rule", formulaCategoryId: "probability", formulaTitle: "Addition rule two events" },
  { id: "vectors-dot-product", label: "Vectors: Dot product", formulaCategoryId: "vectors", formulaTitle: "Dot product" },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function formulaKey(categoryId: string, formulaTitle: string) {
  return `${categoryId}:${normalize(formulaTitle)}`;
}

const formulas = formulaCategories.flatMap((category) =>
  category.formulas.map((formula) => ({
    ...formula,
    category,
    route: `/formulas/${category.id}`,
  })),
);

const theorems = theoremCategories.flatMap((category) =>
  category.theorems.map((theorem) => ({
    ...theorem,
    category,
    route: `/theorems/${category.id}/${theorem.slug}`,
  })),
);

const visualProofs = visualProofsIndex
  .filter((proof) => proof.status === "available")
  .map((proof) => ({ title: proof.title, route: proof.route, categorySlug: proof.categorySlug }));

const formulaByKey = new Map(formulas.map((formula) => [formulaKey(formula.category.id, formula.title), formula]));
const theoremByTitle = new Map(theorems.map((theorem) => [normalize(theorem.title), theorem]));
const visualProofByRoute = new Map(visualProofs.map((proof) => [proof.route, proof]));

function uniqueByRoute<T extends { route: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.route, item])).values());
}

function linksFromSeed(seed: CuratedFormulaLearningLink): CuratedLearningLinks {
  return {
    formulas: [formulaByKey.get(formulaKey(seed.formulaCategoryId, seed.formulaTitle))].filter(
      (formula): formula is FormulaLearningMatch => Boolean(formula),
    ),
    theorems: seed.theoremTitles
      .map((title) => theoremByTitle.get(normalize(title)))
      .filter((theorem): theorem is TheoremLearningMatch => Boolean(theorem)),
    visualProofs: seed.visualProofRoutes
      .map((route) => visualProofByRoute.get(route))
      .filter((proof): proof is VisualProofLearningMatch => Boolean(proof)),
  };
}

export function getCuratedFormulaLearningLinks(categoryId: string, formulaTitle: string): CuratedLearningLinks {
  const seed = curatedFormulaLearningLinks.find(
    (link) => formulaKey(link.formulaCategoryId, link.formulaTitle) === formulaKey(categoryId, formulaTitle),
  );

  return seed ? linksFromSeed(seed) : { formulas: [], theorems: [], visualProofs: [] };
}

export function getCuratedTheoremLearningLinks(categoryId: string, theoremTitle: string): CuratedLearningLinks {
  const matchingSeeds = curatedFormulaLearningLinks.filter((link) =>
    link.theoremTitles.some((title) => normalize(title) === normalize(theoremTitle)),
  );

  const links = matchingSeeds.map(linksFromSeed);

  return {
    formulas: uniqueByRoute(links.flatMap((link) => link.formulas)),
    theorems: theorems.filter((theorem) => theorem.category.id === categoryId && normalize(theorem.title) !== normalize(theoremTitle)).slice(0, 2),
    visualProofs: uniqueByRoute(links.flatMap((link) => link.visualProofs)),
  };
}

export function getCuratedVisualProofLearningLinks(visualProofRoute: string): CuratedLearningLinks {
  const matchingSeeds = curatedFormulaLearningLinks.filter((link) => link.visualProofRoutes.includes(visualProofRoute));
  const links = matchingSeeds.map(linksFromSeed);

  return {
    formulas: uniqueByRoute(links.flatMap((link) => link.formulas)),
    theorems: uniqueByRoute(links.flatMap((link) => link.theorems)),
    visualProofs: [],
  };
}

export function getProofLearningCertificationJourneys(): ProofLearningCertificationJourney[] {
  return proofLearningCertificationSeeds.map((seed) => {
    const links = getCuratedFormulaLearningLinks(seed.formulaCategoryId, seed.formulaTitle);
    const formula = links.formulas[0];
    const theorem = links.theorems[0];
    const visualProof = links.visualProofs[0];

    if (!formula || !theorem || !visualProof) {
      throw new Error(`Incomplete proof learning certification journey: ${seed.id}`);
    }

    return {
      ...seed,
      formulaRoute: formula.route,
      theoremRoute: theorem.route,
      theoremTitle: theorem.title,
      visualProofRoute: visualProof.route,
      visualProofTitle: visualProof.title,
    };
  });
}

export function validateCuratedLearningLinks(): CuratedLearningLinkIssue[] {
  return curatedFormulaLearningLinks.flatMap((link) => {
    const linkKey = `${link.formulaCategoryId}:${link.formulaTitle}`;
    const issues: CuratedLearningLinkIssue[] = [];

    if (!formulaByKey.has(formulaKey(link.formulaCategoryId, link.formulaTitle))) {
      issues.push({ linkKey, message: "Formula target is missing." });
    }

    link.theoremTitles.forEach((title) => {
      if (!theoremByTitle.has(normalize(title))) {
        issues.push({ linkKey, message: `Theorem target is missing: ${title}.` });
      }
    });

    link.visualProofRoutes.forEach((route) => {
      if (!visualProofByRoute.has(route)) {
        issues.push({ linkKey, message: `Visual Proof route is missing: ${route}.` });
      }
    });

    return issues;
  });
}
