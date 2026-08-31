import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ComplexLessonAdapter from "./ComplexLessonAdapter";

describe("ComplexLessonAdapter", () => {
  it("renders complex lessons 365 through 377 with lesson-specific guidance", () => {
    const expected = new Map([
      [365, "Complex plane"],
      [366, "Real and Imaginary Parts"],
      [367, "Complex Addition"],
      [368, "Complex Multiplication"],
      [369, "Complex Conjugate"],
      [370, "Modulus and Argument"],
      [371, "Polar form"],
      [372, "Euler form"],
      [373, "Complex powers"],
      [374, "Complex roots"],
      [375, "Polynomial roots"],
      [376, "Mobius transformations"],
      [377, "Complex functions"],
    ]);

    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <ComplexLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, String(lessonId)).toContain(lesson.title);
      expect(html, String(lessonId)).toContain(snippet);
      expect(html, String(lessonId)).not.toContain("Complex numbers");
    }
  });

  it("uses a dedicated draggable Argand and rotation model for lesson 365", () => {
    const lesson = lessonCatalog.find((item) => item.id === 365)!;
    const html = renderToStaticMarkup(
      <ComplexLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="complex-mockup-0550"');
    expect(html).toContain(
      "draggable-argand-point-real-imaginary-components-live-euler-rotation",
    );
    expect(html).toContain('data-z="[2,1]"');
    expect(html).toContain('data-rotated="[0.7071,2.1213]"');
    expect(html).toContain('data-modulus="2.2361"');
    expect(html).toContain('data-argument="26.5651"');
  });

  it("uses a dedicated component inspector for lesson 366", () => {
    const lesson = lessonCatalog.find((item) => item.id === 366)!;
    const html = renderToStaticMarkup(
      <ComplexLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="complex-mockup-0551"');
    expect(html).toContain(
      "draggable-complex-point-synchronized-real-imaginary-steppers-sliders-projections",
    );
    expect(html).toContain('data-z="[2,1]"');
    expect(html).toContain('data-quadrant="Quadrant I"');
    expect(html).toContain("Re(z) = 2");
    expect(html).toContain("Im(z) = 1");
  });

  it("uses a dedicated two-vector addition model for lesson 367", () => {
    const lesson = lessonCatalog.find((item) => item.id === 367)!;
    const html = renderToStaticMarkup(
      <ComplexLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="complex-mockup-0552"');
    expect(html).toContain(
      "two-independent-draggable-complex-addends-tip-to-tail-parallelogram",
    );
    expect(html).toContain('data-z="[2,1]"');
    expect(html).toContain('data-w="[-1,3]"');
    expect(html).toContain('data-sum="[1,4]"');
  });

  it("uses a dedicated algebraic and polar multiplication model for lesson 368", () => {
    const lesson = lessonCatalog.find((item) => item.id === 368)!;
    const html = renderToStaticMarkup(
      <ComplexLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="complex-mockup-0553"');
    expect(html).toContain(
      "two-draggable-complex-factors-rectangular-expansion-modulus-product-argument-sum",
    );
    expect(html).toContain('data-z="[2,1]"');
    expect(html).toContain('data-w="[1,1]"');
    expect(html).toContain('data-product="[1,3]"');
    expect(html).toContain('data-scale="1.4142"');
    expect(html).toContain('data-rotation="45"');
  });

  it("uses a dedicated real-axis conjugate reflection model for lesson 369", () => {
    const lesson = lessonCatalog.find((item) => item.id === 369)!;
    const html = renderToStaticMarkup(
      <ComplexLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="complex-mockup-0554"');
    expect(html).toContain(
      "draggable-complex-point-real-axis-reflection-conjugate-equal-modulus",
    );
    expect(html).toContain('data-z="[2,1]"');
    expect(html).toContain('data-conjugate="[2,-1]"');
    expect(html).toContain('data-product="5"');
  });

  it("uses a dedicated polar measurement model for lesson 370", () => {
    const lesson = lessonCatalog.find((item) => item.id === 370)!;
    const html = renderToStaticMarkup(
      <ComplexLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="complex-mockup-0555"');
    expect(html).toContain(
      "draggable-complex-point-live-modulus-principal-argument-quadrant-radius-ring",
    );
    expect(html).toContain('data-z="[3,4]"');
    expect(html).toContain('data-modulus="5"');
    expect(html).toContain('data-argument="53.13"');
    expect(html).toContain('data-quadrant="Quadrant I"');
  });
});
