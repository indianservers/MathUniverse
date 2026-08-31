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
      if (lesson.id > 356)
        expect(html, String(lesson.id)).toMatch(
          /matrix and linear-algebra lab|eigendirection lab/,
        );
      if (![352, 356].includes(lesson.id))
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

  it("uses a left-and-right identity model for lesson 351", () => {
    const lesson = lessonCatalog.find((item) => item.id === 351)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0536"');
    expect(html).toContain("editable-two-by-two-matrix-left-right-identity-products-expanded-row-column-proof");
    expect(html).toContain('data-right="2,1,1,2"');
    expect(html).toContain('data-unchanged="true"');
  });

  it("uses a selectable symbolic and numeric transpose model for lesson 352", () => {
    const lesson = lessonCatalog.find((item) => item.id === 352)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0537"');
    expect(html).toContain("symbolic-numeric-two-by-three-matrix-derived-transpose-selectable-entry");
    expect(html).toContain('data-transposed="1,4,2,5,3,6"');
  });

  it("uses a draggable signed-area determinant model for lesson 353", () => {
    const lesson = lessonCatalog.find((item) => item.id === 353)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0538"');
    expect(html).toContain("editable-two-by-two-matrix-determinant-products-draggable-column-vectors-signed-area");
    expect(html).toContain('data-det="10"');
    expect(html).toContain('data-singular="false"');
  });

  it("uses a determinant-gated inverse and Gauss-Jordan model for lesson 354", () => {
    const lesson = lessonCatalog.find((item) => item.id === 354)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0539"');
    expect(html).toContain("editable-two-by-two-matrix-determinant-invertibility-gated-formula-inverse-real-gauss-jordan-states");
    expect(html).toContain('data-inverse="1,-1,-1,2"');
    expect(html).toContain('data-expected="1,1"');
  });

  it("uses a reversible row-operation state machine for lesson 355", () => {
    const lesson = lessonCatalog.find((item) => item.id === 355)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0540"');
    expect(html).toContain("augmented-three-by-four-matrix-swap-nonzero-scale-row-replacement-preview-commit-draggable-row-reorder");
    expect(html).toContain('data-preview="[[1,2,-2,0],[2,-1,3,4],[-1,1,1,5]]"');
  });

  it("uses a real Gauss-Jordan RREF and pivot model for lesson 356", () => {
    const lesson = lessonCatalog.find((item) => item.id === 356)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0541"');
    expect(html).toContain("real-gauss-jordan-rref-operation-state-sequence-clickable-steps-pivot-detection-rank-nullity");
    expect(html).toContain('data-rref="[[1,0,0,1.5],[0,1,0,1],[0,0,1,0.5]]"');
    expect(html).toContain('data-rank="3"');
  });

  it("does not show determinant as the primary result for unrelated concepts", () => {
    for (const lessonId of [360, 363, 364]) {
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
