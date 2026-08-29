import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import VectorLessonAdapter from "./VectorLessonAdapter";

describe("VectorLessonAdapter", () => {
  it("renders vector introduction as its own two-point vector surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 183)!;
    const html = renderToStaticMarkup(
      <VectorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain("vector-mockup-0240");
    expect(html).toContain('data-dedicated-lesson="183"');
    expect(html).toContain('data-testid="vector-point-a"');
    expect(html).toContain('data-testid="vector-point-b"');
    expect(html).toContain('data-testid="vector-practice-tip"');
  });

  it("renders component form as its own signed-projection surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 184)!;
    const html = renderToStaticMarkup(
      <VectorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain("vector-mockup-0241");
    expect(html).toContain('data-dedicated-lesson="184"');
    expect(html).toContain('data-testid="component-vector-tip"');
    expect(html).toContain("Target: w = (-4, 1)");
  });

  it("renders position vectors as its own origin-anchored multi-vector surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 185)!;
    const html = renderToStaticMarkup(
      <VectorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain("vector-mockup-0242");
    expect(html).toContain('data-dedicated-lesson="185"');
    expect(html).toContain('data-testid="position-vector-a"');
    expect(html).toContain('data-testid="position-vector-b"');
    expect(html).toContain('data-testid="position-vector-c"');
    expect(html).toContain('data-testid="position-practice-point"');
  });

  it("renders vector addition as its own resultant-construction surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 186)!;
    const html = renderToStaticMarkup(
      <VectorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain("vector-mockup-0243");
    expect(html).toContain('data-dedicated-lesson="186"');
    expect(html).toContain('data-testid="addition-u-tip"');
    expect(html).toContain('data-testid="addition-v-tip"');
    expect(html).toContain('data-testid="addition-practice-tip"');
  });

  it("renders vector subtraction as its own opposite-vector surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 187)!;
    const html = renderToStaticMarkup(
      <VectorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain("vector-mockup-0244");
    expect(html).toContain('data-dedicated-lesson="187"');
    expect(html).toContain('data-testid="subtraction-a-tip"');
    expect(html).toContain('data-testid="subtraction-b-tip"');
    expect(html).toContain("a - b = a + (-b)");
  });

  it("renders scalar multiplication as its own scale-and-reverse surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 188)!;
    const html = renderToStaticMarkup(
      <VectorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain("vector-mockup-0245");
    expect(html).toContain('data-dedicated-lesson="188"');
    expect(html).toContain('data-testid="scalar-source-tip"');
    expect(html).toContain("v = k u");
  });

  it("renders magnitude and unit vectors as its own normalization surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 189)!;
    const html = renderToStaticMarkup(
      <VectorLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain("vector-mockup-0246");
    expect(html).toContain('data-dedicated-lesson="189"');
    expect(html).toContain('data-testid="magnitude-vector-tip"');
    expect(html).toContain("Pythagorean triangle");
  });

  it("renders vector lessons 190 through 197 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      190: "Dot product",
      191: "Cross product",
      192: "Projection",
      193: "Linear combination",
      194: "Vector line",
      195: "Vector plane",
      196: "Relative motion",
      197: "Force vectors",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <VectorLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain('data-direct-interaction="true"');
      expect(html, lesson.title).toContain("Drag vector tips");
      expect(html, lesson.title).toContain(
        "Drag vector tips directly on the plane",
      );
    }
  });
});
