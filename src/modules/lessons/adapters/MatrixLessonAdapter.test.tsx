import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import MatrixLessonAdapter from "./MatrixLessonAdapter";

describe("MatrixLessonAdapter", () => {
  it("renders all 18 matrix routes through explicit activities", () => {
    const lessons = lessonCatalog.filter((lesson) => lesson.adapter === "matrix");
    expect(lessons).toHaveLength(18);
    for (const lesson of lessons) {
      const html = renderToStaticMarkup(
        <MatrixLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html, String(lesson.id)).toContain(lesson.title);
      if (lesson.id > 350)
        expect(html, String(lesson.id)).toMatch(
          /matrix and linear-algebra lab|eigendirection lab/,
        );
      expect(html, String(lesson.id)).toContain('type="number"');
      expect(html, String(lesson.id)).not.toContain("Legacy");
    }
  });

  it("uses the dedicated interactive matrix builder for lesson 347", () => {
    const lesson = lessonCatalog.find((item) => item.id === 347)!;
    const html = renderToStaticMarkup(
      <MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="matrix-mockup-0532"');
    expect(html).toContain("editable-resizable-matrix-transpose-augmentation-validation-export-cell-drag");
    expect(html).toContain('data-matrix="[[2,-1,3],[4,0,5]]"');
  });

  it("uses a separate element-wise model for lesson 348", () => {
    const lesson = lessonCatalog.find((item) => item.id === 348)!;
    const html = renderToStaticMarkup(
      <MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="matrix-mockup-0533"');
    expect(html).toContain("two-editable-compatible-matrices-elementwise-addition-subtraction");
    expect(html).toContain('data-result="4,3,2,2,1,6"');
  });

  it("uses a dedicated scalar and determinant model for lesson 349", () => {
    const lesson = lessonCatalog.find((item) => item.id === 349)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0534"');
    expect(html).toContain("editable-two-by-two-matrix-scalar-range-cellwise-product");
    expect(html).toContain('data-scaled="5,-2.5,7.5,10"');
    expect(html).toContain('data-expected="68.75"');
  });

  it("uses a compatibility-driven multiplication model for lesson 350", () => {
    const lesson = lessonCatalog.find((item) => item.id === 350)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0535"');
    expect(html).toContain("independently-resizable-editable-matrices-compatibility-row-column-dot-product");
    expect(html).toContain('data-result="[[9,7],[13,8]]"');
  });

  it("does not show determinant as the primary result for unrelated concepts", () => {
    for (const lessonId of [352, 356, 360, 363, 364]) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <MatrixLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html).not.toContain("det A =");
      expect(html).toContain('id="matrix-result"');
    }
  });
});
