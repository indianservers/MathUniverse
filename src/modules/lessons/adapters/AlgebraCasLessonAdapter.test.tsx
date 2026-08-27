import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import AlgebraCasLessonAdapter from "./AlgebraCasLessonAdapter";

describe("AlgebraCasLessonAdapter", () => {
  it("routes lesson 92 to its dedicated algebra-tiles object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 92)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0149"');
    expect(html).toContain('data-dedicated-lesson="92"');
    expect(html).toContain("editable-positive-negative-algebra-tiles-draggable-bank-zero-pairs-linked-area-model-symbolic-trace-model");
    expect(html).toContain('aria-label="Add x tile"');
    expect(html).toContain("Area model: (x+2)(x+3)");
  });

  it("routes lesson 93 to its dedicated like-terms object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 93)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0150"');
    expect(html).toContain('data-dedicated-lesson="93"');
    expect(html).toContain("draggable-like-term-coefficient-grouping-simplification-substitution-equivalence-graded-practice-model");
    expect(html).toContain('aria-label="Add positive variable tile"');
    expect(html).toContain("Substitution check");
  });

  it("routes lesson 94 to its dedicated substitution object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 94)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0151"');
    expect(html).toContain('data-dedicated-lesson="94"');
    expect(html).toContain("draggable-substitution-slot-expression-value-step-evaluation-negative-brackets-equivalence-practice-model");
    expect(html).toContain('aria-label="Drag chosen value"');
    expect(html).toContain("Why brackets matter");
  });

  it("routes lesson 95 to its dedicated expanding-brackets object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 95)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0152"');
    expect(html).toContain('data-dedicated-lesson="95"');
    expect(html).toContain("draggable-distributive-factor-dynamic-area-partition-symbolic-expansion-substitution-proof-graded-practice-model");
    expect(html).toContain('aria-label="Drag outside factor"');
    expect(html).toContain("Distributive area model");
  });

  it("routes lesson 96 to its dedicated double-brackets object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 96)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0153"');
    expect(html).toContain('data-dedicated-lesson="96"');
    expect(html).toContain("draggable-four-product-binomial-area-middle-term-combination-substitution-proof-graded-challenge-model");
    expect(html).toContain('aria-label="Drag first middle product"');
    expect(html).toContain("Area Tiles Model");
  });

  it("routes lesson 97 to its dedicated factorisation object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 97)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0154"');
    expect(html).toContain('data-dedicated-lesson="97"');
    expect(html).toContain("editable-quadratic-factor-pair-search-draggable-reverse-area-expansion-substitution-graded-practice-model");
    expect(html).toContain('aria-label="Drag first split term"');
    expect(html).toContain("Find factor pair");
  });

  it("routes lesson 98 to its dedicated algebraic-fractions object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 98)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0155"');
    expect(html).toContain('data-dedicated-lesson="98"');
    expect(html).toContain("selectable-rational-expression-draggable-common-factor-cancellation-domain-restriction-substitution-graded-practice-model");
    expect(html).toContain('aria-label="Drag numerator common factor"');
    expect(html).toContain("Simplify the rational expression");
  });

  it("routes lesson 99 to its dedicated indices object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 99)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0156"');
    expect(html).toContain('data-dedicated-lesson="99"');
    expect(html).toContain("editable-same-base-repeated-factor-draggable-product-of-powers-numeric-equality-graded-practice-model");
    expect(html).toContain('aria-label="Drag first power factor 1"');
    expect(html).toContain("Visualize the law with repeated multiplication");
  });

  it("routes lesson 100 to its dedicated surds object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 100)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0157"');
    expect(html).toContain('data-dedicated-lesson="100"');
    expect(html).toContain("editable-radicand-perfect-square-divisor-search-draggable-factor-extraction-exact-decimal-equivalence-graded-practice-model");
    expect(html).toContain('aria-label="Use factor 25"');
    expect(html).toContain("Square factor extraction drop target");
  });

  it("routes lesson 101 to its dedicated rationalisation object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 101)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0158"');
    expect(html).toContain('data-dedicated-lesson="101"');
    expect(html).toContain("selectable-radical-and-conjugate-denominator-draggable-unity-multiplier-rational-result-decimal-equivalence-graded-practice-model");
    expect(html).toContain('aria-label="Use matching multiplier"');
    expect(html).toContain("Denominator-cleaning workspace");
  });

  it("routes lesson 102 to its dedicated polynomial-operations object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 102)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0159"');
    expect(html).toContain('data-dedicated-lesson="102"');
    expect(html).toContain("coefficient-map-polynomial-add-subtract-convolution-draggable-degree-columns-substitution-equivalence-graded-practice-model");
    expect(html).toContain('aria-label="Drag A degree 2 term"');
    expect(html).toContain("Polynomial table workspace");
  });

  it("routes lesson 103 to its dedicated synthetic-division object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 103)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0160"');
    expect(html).toContain('data-dedicated-lesson="103"');
    expect(html).toContain("editable-polynomial-coefficient-horner-synthetic-number-draggable-table-quotient-remainder-expansion-graded-practice-model");
    expect(html).toContain('aria-label="Drag synthetic number"');
    expect(html).toContain("Synthetic division steps");
  });

  it("routes lesson 104 to its dedicated remainder-theorem object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 104)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0161"');
    expect(html).toContain('data-dedicated-lesson="104"');
    expect(html).toContain("editable-polynomial-independent-evaluation-synthetic-division-draggable-a-remainder-agreement-reconstruction-graded-practice-model");
    expect(html).toContain('aria-label="Drag value a"');
    expect(html).toContain("Check reconstruction");
  });

  it("routes lesson 105 to its dedicated factor-theorem object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 105)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0162"');
    expect(html).toContain('data-dedicated-lesson="105"');
    expect(html).toContain("editable-polynomial-candidate-factor-root-extraction-draggable-substitution-zero-meter-synthetic-remainder-factor-pair-practice-model");
    expect(html).toContain('aria-label="Drag candidate factor"');
    expect(html).toContain("Factor Test Station");
  });

  it("routes lesson 106 to its dedicated identities object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 106)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0163"');
    expect(html).toContain('data-dedicated-lesson="106"');
    expect(html).toContain("dynamic-square-area-partition-draggable-region-symbolic-combination-sample-equivalence-graded-practice-model");
    expect(html).toContain('aria-label="Drag area tile x2"');
    expect(html).toContain("Prove the identity with an area model");
  });

  it("routes lesson 107 to its dedicated one-step-equation object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 107)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0164"');
    expect(html).toContain('data-dedicated-lesson="107"');
    expect(html).toContain("selectable-one-step-equation-dynamic-balance-draggable-inverse-operation-both-sides-substitution-check-graded-practice-model");
    expect(html).toContain('aria-label="Drag inverse operation Subtract 5"');
    expect(html).toContain("Solve using the balance model");
  });

  it("routes lesson 108 to its dedicated multi-step-equation object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 108)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0165"');
    expect(html).toContain('data-dedicated-lesson="108"');
    expect(html).toContain("selectable-linear-expression-balance-sequence-draggable-constant-removal-equal-group-division-ordered-inverse-operations-substitution-check-graded-practice-model");
    expect(html).toContain('aria-label="Drag remove constant Subtract 3"');
    expect(html).toContain("EXPLORE WITH THE BALANCE MODEL");
  });

  it("routes lesson 109 to its dedicated fraction-equation object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 109)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0166"');
    expect(html).toContain('data-dedicated-lesson="109"');
    expect(html).toContain("selectable-fraction-equation-lcd-three-term-native-drag-clearing-simplification-original-substitution-check-lcd-and-answer-graded-practice-model");
    expect(html).toContain('aria-label="Drag LCD multiplier 3"');
    expect(html).toContain("INTERACT · LCD BALANCE MODEL");
  });

  it("routes lesson 110 to its dedicated literal-equation rearrangement model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 110)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0167"');
    expect(html).toContain('data-dedicated-lesson="110"');
    expect(html).toContain("selectable-literal-formula-target-subject-native-inverse-operation-drag-symbolic-isolation-restriction-tracking-numeric-substitution-generated-practice-model");
    expect(html).toContain('aria-label="Drag inverse operation Divide by l"');
    expect(html).toContain("INTERACTION · FORMULA REARRANGER");
  });

  it("routes lesson 111 to its dedicated linear-equation algebra and graph model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 111)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0168"');
    expect(html).toContain('data-dedicated-lesson="111"');
    expect(html).toContain("selectable-first-degree-equation-inverse-operation-native-drag-balance-table-dynamic-line-target-intersection-pointer-probe-substitution-check-graded-practice-model");
    expect(html).toContain('aria-label="Drag constant operation Subtract 1"');
    expect(html).toContain("Graph: y = 4x + 1");
  });

  it("routes lesson 112 to its dedicated simultaneous-equation elimination and graph model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 112)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0169"');
    expect(html).toContain('data-dedicated-lesson="112"');
    expect(html).toContain("selectable-two-equation-coefficient-system-determinant-solver-native-elimination-drag-generated-symbolic-steps-dynamic-dual-line-intersection-both-equation-verification-ordered-pair-practice-model");
    expect(html).toContain('aria-label="Drag elimination operation Add equations"');
    expect(html).toContain("Graph (Intersection of lines)");
  });

  it("routes lesson 113 to its dedicated three-variable elimination and plane-intersection model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 113)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0170"');
    expect(html).toContain('data-dedicated-lesson="113"');
    expect(html).toContain("editable-three-equation-coefficient-matrix-cramers-rule-solver-native-variable-elimination-drag-generated-row-reduction-threejs-plane-intersection-all-equation-verification-ordered-triple-practice-model");
    expect(html).toContain('aria-label="Drag eliminate y operation"');
    expect(html).toContain("Three planes intersect at one point");
  });

  it("routes lesson 114 to its dedicated factoring, roots, and parabola model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 114)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0171"');
    expect(html).toContain('data-dedicated-lesson="114"');
    expect(html).toContain("editable-quadratic-coefficients-discriminant-factor-pairs-zero-product-rule-pointer-draggable-root-graph-synchronized-verification-graded-practice-model");
    expect(html).toContain('aria-label="Drag root 1"');
    expect(html).toContain("Factor-to-Roots Lab");
  });

  it("routes lesson 115 to its dedicated cubic factor-stack and roots model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 115)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0172"');
    expect(html).toContain('data-dedicated-lesson="115"');
    expect(html).toContain("editable-three-root-cubic-factor-stack-vieta-expansion-pointer-draggable-roots-zero-product-switches-svg-graph-substitution-check-lost-factor-warning-three-root-graded-practice-model");
    expect(html).toContain('aria-label="Drag polynomial root 1"');
    expect(html).toContain("Factor-stack roots lab");
  });

  it("routes lesson 116 to its dedicated rational restriction and clearing model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 116)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0173"');
    expect(html).toContain('data-dedicated-lesson="116"');
    expect(html).toContain("editable-rational-equation-denominator-restriction-pointer-draggable-forbidden-value-native-lcd-drag-clearing-exact-fraction-linear-solve-original-substitution-extraneous-rejection-graded-practice-model");
    expect(html).toContain('aria-label="Drag multiplier x − 2"');
    expect(html).toContain("State denominator restrictions");
  });

  it("routes lesson 117 to its dedicated radical squaring and candidate-check model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 117)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0174"');
    expect(html).toContain('data-dedicated-lesson="117"');
    expect(html).toContain("editable-radical-equation-domain-boundary-pointer-drag-native-square-both-sides-drag-balance-isolation-generated-linear-solve-original-equation-check-extraneous-rejection-graded-practice-model");
    expect(html).toContain('aria-label="Drag square both sides for x + 1"');
    expect(html).toContain("Radical Unwrapper Lab");
  });

  it("routes lesson 118 to its dedicated power-ladder and exponential graph model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 118)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0175"');
    expect(html).toContain('data-dedicated-lesson="118"');
    expect(html).toContain("editable-exponential-base-target-generated-power-ladder-native-matching-rung-drag-pointer-draggable-graph-exponent-common-base-logarithm-fallback-substitution-check-graded-practice-model");
    expect(html).toContain('aria-label="Drag matching power 2 to 5"');
    expect(html).toContain("Power ladder matcher");
  });

  it("routes lesson 119 to its dedicated domain-gated logarithm model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 119)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0176"');
    expect(html).toContain('data-dedicated-lesson="119"');
    expect(html).toContain("editable-logarithm-candidate-native-range-drag-domain-gate-exponential-rewrite-generated-power-ladder-value-substitution-check-invalid-input-rejection-quick-practice-model");
    expect(html).toContain('aria-label="Logarithm candidate slider"');
    expect(html).toContain("Domain-gated solver");
  });

  it("routes lesson 120 to its dedicated linked unit-circle and periodic-wave model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 120)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0177"');
    expect(html).toContain('data-dedicated-lesson="120"');
    expect(html).toContain("editable-trigonometric-equation-preset-pointer-keyboard-draggable-unit-circle-angle-linked-periodic-wave-quadrant-reasoning-general-solution-family-angle-mode-quick-practice-model");
    expect(html).toContain('aria-label="Drag reference angle on unit circle"');
    expect(html).toContain("Solve using the unit circle");
  });

  it("routes lesson 121 to its dedicated draggable absolute-distance branch model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 121)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0178"');
    expect(html).toContain('data-dedicated-lesson="121"');
    expect(html).toContain("editable-absolute-value-center-distance-pointer-keyboard-draggable-number-line-solutions-linked-two-branch-linear-equations-distance-verification-negative-distance-no-solution-practice-model");
    expect(html).toContain('aria-label="Drag absolute value center"');
    expect(html).toContain("Distance solver on the number line");
  });

  it("routes lesson 122 to its dedicated sign-aware draggable inequality model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 122)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0179"');
    expect(html).toContain('data-dedicated-lesson="122"');
    expect(html).toContain("editable-linear-inequality-coefficients-sign-aware-comparator-flip-pointer-keyboard-draggable-boundary-linked-open-closed-number-line-interval-notation-test-points-practice-model");
    expect(html).toContain('aria-label="Drag linear inequality boundary"');
    expect(html).toContain("Solve on the number line");
  });

  it("routes lesson 123 to its dedicated draggable intersection and union model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 123)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0180"');
    expect(html).toContain('data-dedicated-lesson="123"');
    expect(html).toContain("editable-compound-inequality-and-intersection-or-union-two-pointer-keyboard-draggable-boundaries-open-closed-endpoints-linked-number-lines-interval-notation-test-points-empty-set-practice-model");
    expect(html).toContain('aria-label="Drag compound lower boundary"');
    expect(html).toContain("Build the intersection on a number line");
  });

  it("delegates phase 4 algebra lessons 124 through 128 to lesson-specific structure workspaces", () => {
    for (let id = 124; id <= 128; id += 1) {
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <AlgebraCasLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(`${lesson.title} structure lab`);
      expect(html, lesson.title).toContain(`${lesson.title} concept trace`);
      expect(html, lesson.title).toContain("This algebra page uses a lesson-specific symbolic workspace instead of a default line graph.");
      expect(html, lesson.title).not.toContain("balance + CAS");
      expect(html, lesson.title).not.toContain("Graph of y equals");
    }
  });

  it("keeps Algebraic Fractions cancellation, restriction, and substitution rules in its dedicated surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 98)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("Cancel the common factor");
    expect(html).toContain("Keep the restriction");
    expect(html).toContain("Check by substitution");
    expect(html).toContain("Restriction: x ≠ 1");
    expect(html).toContain('aria-label="Drag denominator factor"');
    expect(html).not.toContain("Algebraic Fractions structure lab");
  });
});
