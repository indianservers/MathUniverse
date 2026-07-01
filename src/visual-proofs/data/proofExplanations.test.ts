import { describe, expect, it } from "vitest";
import { buildProofNarration, getProofExplanation } from "./proofExplanations";
import { getVisualProof } from "./visualProofsIndex";

const phaseTwoExplanationRoutes = [
  ["trigonometry", "right-triangle-trig-ratios"],
  ["trigonometry", "unit-circle-sine-cosine"],
  ["trigonometry", "pythagorean-trig-identity"],
  ["trigonometry", "tangent-ratio-identity"],
  ["trigonometry", "radians-arc-radius"],
  ["trigonometry", "arc-length-formula"],
  ["trigonometry", "trig-graphs-from-unit-circle"],
  ["trigonometry", "cosine-angle-addition"],
  ["trigonometry", "sine-angle-addition"],
  ["trigonometry", "double-angle-identities"],
  ["trigonometry", "sine-rule-proof"],
  ["trigonometry", "cosine-rule-proof"],
  ["trigonometry", "complementary-angle-identities"],
  ["trigonometry", "triangle-area-sine-formula"],
  ["trigonometry", "small-angle-approximation"],
  ["coordinate-geometry", "distance-formula"],
  ["coordinate-geometry", "midpoint-formula"],
  ["coordinate-geometry", "section-formula"],
  ["coordinate-geometry", "slope-formula"],
  ["coordinate-geometry", "slope-intercept-line-equation"],
  ["coordinate-geometry", "point-slope-line-equation"],
  ["coordinate-geometry", "parallel-lines-slope"],
  ["coordinate-geometry", "perpendicular-lines-slope"],
  ["coordinate-geometry", "triangle-area-coordinates"],
  ["coordinate-geometry", "circle-equation"],
  ["coordinate-geometry", "translation-of-points"],
  ["coordinate-geometry", "reflection-across-axes"],
  ["coordinate-geometry", "rotation-about-origin"],
  ["coordinate-geometry", "scaling-dilation-origin"],
  ["coordinate-geometry", "coordinate-proof-pythagorean-theorem"],
] as const;

const phaseThreeExplanationRoutes = [
  ["calculus", "limit-approaches-point"],
  ["calculus", "derivative-slope-of-tangent"],
  ["calculus", "secant-becomes-tangent"],
  ["calculus", "derivative-power-rule"],
  ["calculus", "product-rule-visual-proof"],
  ["calculus", "chain-rule-visual-proof"],
  ["calculus", "mean-value-theorem"],
  ["calculus", "riemann-sums-area-under-curve"],
  ["calculus", "definite-integral-accumulated-area"],
  ["calculus", "fundamental-theorem-of-calculus"],
  ["calculus", "integration-by-parts-visual-proof"],
  ["calculus", "derivative-of-sine"],
  ["calculus", "derivative-of-exponential"],
  ["calculus", "taylor-series-approximation"],
  ["calculus", "optimization-derivative-max-min"],
  ["number-theory", "even-odd-pairing"],
  ["number-theory", "divisibility-equal-grouping"],
  ["number-theory", "primes-non-rectangular-arrays"],
  ["number-theory", "composites-rectangular-arrays"],
  ["number-theory", "fundamental-theorem-arithmetic-factor-trees"],
  ["number-theory", "euclid-infinitely-many-primes"],
  ["number-theory", "gcd-euclidean-algorithm"],
  ["number-theory", "lcm-grid-alignment"],
  ["number-theory", "modular-arithmetic-clock"],
  ["number-theory", "remainder-pattern-cycles"],
  ["number-theory", "divisibility-by-3-and-9-digit-sum"],
  ["number-theory", "irrationality-of-square-root-2"],
] as const;

const phaseFourExplanationRoutes = [
  ["probability", "probability-favorable-over-total"],
  ["probability", "complement-rule"],
  ["probability", "addition-rule-overlapping-events"],
  ["probability", "multiplication-rule-independent-events"],
  ["probability", "conditional-probability"],
  ["probability", "tree-diagram-compound-probability"],
  ["probability", "experimental-probability-law-large-numbers"],
  ["probability", "expected-value-long-run-average"],
  ["statistics", "mean-as-balance-point"],
  ["statistics", "median-and-quartiles"],
  ["statistics", "variance-standard-deviation"],
  ["statistics", "histogram-frequency-distribution"],
  ["statistics", "sampling-distribution-mean"],
  ["statistics", "normal-distribution-empirical-rule"],
  ["statistics", "correlation-scatterplot"],
  ["statistics", "linear-regression-least-squares"],
] as const;

const phaseFiveExplanationRoutes = [
  ["matrices-linear-algebra", "matrix-addition-cell-by-cell"],
  ["matrices-linear-algebra", "matrix-multiplication-row-column"],
  ["matrices-linear-algebra", "matrix-linear-transformation-grid"],
  ["matrices-linear-algebra", "determinant-area-scale-factor"],
  ["matrices-linear-algebra", "linear-system-line-intersection"],
  ["matrices-linear-algebra", "row-operations-preserve-solutions"],
  ["matrices-linear-algebra", "eigenvectors-directions-do-not-turn"],
  ["matrices-linear-algebra", "matrix-inverse-undo-transformation"],
  ["vectors", "vector-as-directed-segment"],
  ["vectors", "vector-addition-tip-to-tail"],
  ["vectors", "scalar-multiplication-vector"],
  ["vectors", "dot-product-as-projection"],
  ["vectors", "cross-product-area"],
  ["vectors", "unit-vectors-normalization"],
  ["vectors", "vector-equation-line"],
  ["vectors", "vector-projection-component"],
  ["complex-numbers", "complex-number-plane-point"],
  ["complex-numbers", "modulus-and-argument"],
  ["complex-numbers", "complex-addition-vector"],
  ["complex-numbers", "complex-multiplication-rotation-scaling"],
  ["complex-numbers", "multiplication-by-i-rotation"],
  ["complex-numbers", "complex-conjugate-reflection"],
  ["complex-numbers", "roots-of-unity"],
  ["complex-numbers", "euler-form-unit-circle"],
] as const;

const phaseSixExplanationRoutes = [
  ["mensuration", "rectangle-square-area"],
  ["mensuration", "perimeter-and-circumference"],
  ["mensuration", "cuboid-cube-surface-area"],
  ["mensuration", "cuboid-cube-volume"],
  ["mensuration", "cylinder-volume-surface-area"],
  ["mensuration", "cone-volume-surface-area"],
  ["mensuration", "sphere-surface-area-volume"],
  ["mensuration", "composite-solids-and-units"],
  ["conic-sections", "circle-locus-equal-distance"],
  ["conic-sections", "parabola-focus-directrix"],
  ["conic-sections", "ellipse-sum-of-distances"],
  ["conic-sections", "hyperbola-difference-of-distances"],
  ["conic-sections", "eccentricity-classification"],
  ["conic-sections", "cone-slicing-conics"],
  ["conic-sections", "parabola-reflective-property"],
  ["conic-sections", "directrix-focus-standard-equations"],
  ["inequalities", "inequality-number-line"],
  ["inequalities", "solving-linear-inequalities"],
  ["inequalities", "compound-inequalities-intervals"],
  ["inequalities", "quadratic-inequalities-graph-regions"],
  ["inequalities", "am-gm-inequality"],
  ["inequalities", "triangle-inequality"],
  ["inequalities", "cauchy-schwarz-dot-product-bound"],
  ["inequalities", "linear-inequality-regions"],
] as const;

const phaseSevenExplanationRoutes = [
  ["logarithms-exponents", "exponents-repeated-multiplication"],
  ["logarithms-exponents", "laws-of-exponents-same-base"],
  ["logarithms-exponents", "exponential-growth-decay"],
  ["logarithms-exponents", "logarithm-inverse-exponential"],
  ["logarithms-exponents", "laws-of-logarithms"],
  ["logarithms-exponents", "change-of-base-formula"],
  ["logarithms-exponents", "logarithmic-scale-orders-magnitude"],
  ["logarithms-exponents", "natural-exponential-e"],
  ["transformations-symmetry", "translation-sliding-vector"],
  ["transformations-symmetry", "reflection-mirror-line"],
  ["transformations-symmetry", "rotation-about-point"],
  ["transformations-symmetry", "dilation-similarity-scale-factor"],
  ["transformations-symmetry", "congruence-rigid-motions"],
  ["transformations-symmetry", "line-rotational-symmetry"],
  ["transformations-symmetry", "tessellations-repeated-transformations"],
  ["transformations-symmetry", "transformation-matrices-2d"],
  ["engineering-mathematics", "first-order-differential-equation-slope-field"],
  ["engineering-mathematics", "simple-harmonic-motion"],
  ["engineering-mathematics", "fourier-series-wave-building"],
  ["engineering-mathematics", "laplace-transform-decay-system"],
  ["engineering-mathematics", "gradient-steepest-increase"],
  ["engineering-mathematics", "divergence-curl-vector-field"],
  ["engineering-mathematics", "trapezoidal-rule-numerical-integration"],
  ["engineering-mathematics", "linear-programming-feasible-region"],
] as const;

const phaseEightExplanationRoutes = [
  ["sequences-and-series", "arithmetic-progression-equal-steps"],
  ["sequences-and-series", "sum-first-n-natural-numbers"],
  ["sequences-and-series", "sum-first-n-odd-numbers"],
  ["sequences-and-series", "sum-arithmetic-progression"],
  ["sequences-and-series", "geometric-progression-repeated-scaling"],
  ["sequences-and-series", "finite-geometric-series-sum"],
  ["sequences-and-series", "infinite-geometric-series-convergence"],
  ["sequences-and-series", "triangular-numbers"],
  ["sequences-and-series", "square-numbers-odd-layers"],
  ["sequences-and-series", "fibonacci-sequence-tiling"],
  ["sequences-and-series", "fibonacci-spiral-approximation"],
  ["sequences-and-series", "sum-of-fibonacci-numbers"],
  ["sequences-and-series", "pascal-triangle-binomial-coefficients"],
  ["sequences-and-series", "visual-induction-domino-growth"],
  ["sequences-and-series", "harmonic-series-growth-intuition"],
] as const;

function expectExplanationCoverage(routes: readonly (readonly [string, string])[]) {
  for (const [categorySlug, proofSlug] of routes) {
    const proof = getVisualProof(categorySlug, proofSlug);

    expect(proof, `${categorySlug}/${proofSlug} should exist`).toBeTruthy();

    const explanation = getProofExplanation(proof!);
    expect(explanation, `${categorySlug}/${proofSlug} should have an explanation`).toBeTruthy();
    expect(explanation?.plainLanguage.length).toBeGreaterThan(40);
    expect(explanation?.whyItWorks.length).toBeGreaterThan(40);
    expect(explanation?.watchFor.length).toBeGreaterThanOrEqual(3);
    expect(explanation?.commonMisconception.length).toBeGreaterThan(30);
    expect(explanation?.teacherPrompt).toContain("Ask:");
    expect(buildProofNarration(proof!, explanation!)).toContain(proof!.title);
  }
}

describe("visual proof explanation coverage", () => {
  it("adds Phase 2 explanations and narration for trigonometry and coordinate geometry routes", () => {
    expectExplanationCoverage(phaseTwoExplanationRoutes);
  });

  it("adds Phase 3 explanations and narration for calculus and number theory routes", () => {
    expectExplanationCoverage(phaseThreeExplanationRoutes);
  });

  it("adds Phase 4 explanations and narration for probability and statistics routes", () => {
    expectExplanationCoverage(phaseFourExplanationRoutes);
  });

  it("adds Phase 5 explanations and narration for matrices, vectors, and complex number routes", () => {
    expectExplanationCoverage(phaseFiveExplanationRoutes);
  });

  it("adds Phase 6 explanations and narration for mensuration, conic, and inequality routes", () => {
    expectExplanationCoverage(phaseSixExplanationRoutes);
  });

  it("adds Phase 7 explanations and narration for logarithm, transformation, and engineering routes", () => {
    expectExplanationCoverage(phaseSevenExplanationRoutes);
  });

  it("adds Phase 8 explanations and narration for sequence and series routes", () => {
    expectExplanationCoverage(phaseEightExplanationRoutes);
  });
});
