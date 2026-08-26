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

  it("delegates phase 4 algebra lessons 96 through 128 to lesson-specific structure workspaces", () => {
    for (let id = 96; id <= 128; id += 1) {
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

  it("keeps Algebraic Fractions lesson-specific cancellation rules inside the delegated workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 98)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("Algebraic Fractions structure lab");
    expect(html).toContain("Algebraic Fractions concept trace");
    expect(html).toContain("denominator != 0");
    expect(html).toContain("Keep restriction x != 1");
    expect(html).toContain("Only common multiplied factors can be cancelled");
    expect(html).toContain("This algebra page uses a lesson-specific symbolic workspace instead of a default line graph.");
  });
});
