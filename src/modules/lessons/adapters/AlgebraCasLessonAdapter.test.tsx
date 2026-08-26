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

  it("delegates phase 4 algebra lessons 107 through 128 to lesson-specific structure workspaces", () => {
    for (let id = 107; id <= 128; id += 1) {
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
