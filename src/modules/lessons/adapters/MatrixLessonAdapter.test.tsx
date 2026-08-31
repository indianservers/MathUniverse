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
      if (lesson.id > 363)
        expect(html, String(lesson.id)).toMatch(
          /matrix and linear-algebra lab|eigendirection lab/,
        );
      if (![352, 356, 361].includes(lesson.id))
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

  it("uses one live equation-system model for lesson 357", () => {
    const lesson = lessonCatalog.find((item) => item.id === 357)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0542"');
    expect(html).toContain("editable-linear-system-derived-coefficient-variable-constant-augmented-matrices");
    expect(html).toContain('data-augmented="[2,1,5,1,-1,1]"');
    expect(html).toContain('data-solution="[2,1]"');
    expect(html).toContain('data-status="one"');
  });

  it("uses a draggable basis transformation model for lesson 358", () => {
    const lesson = lessonCatalog.find((item) => item.id === 358)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0543"');
    expect(html).toContain("editable-two-by-two-linear-transformation-draggable-basis-columns");
    expect(html).toContain('data-det="3"');
    expect(html).toContain('data-points="[[0,0],[2,1],[1,2],[3,3]]"');
  });

  it("uses a derived eigensystem and draggable vector model for lesson 359", () => {
    const lesson = lessonCatalog.find((item) => item.id === 359)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0544"');
    expect(html).toContain("editable-real-two-by-two-eigensystem-characteristic-polynomial-derived-eigenpairs");
    expect(html).toContain('data-roots="[3,1]"');
    expect(html).toContain('data-vectors="[[1,1],[1,-1]]"');
    expect(html).toContain('data-eigen="true"');
  });

  it("uses a determinant-based draggable basis model for lesson 360", () => {
    const lesson = lessonCatalog.find((item) => item.id === 360)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0545"');
    expect(html).toContain("draggable-two-vector-basis-determinant-independence-span-dimension-coordinate-solve");
    expect(html).toContain('data-det="-2"');
    expect(html).toContain('data-coordinates="[3,1]"');
  });

  it("uses a homogeneous-relation independence model for lesson 361", () => {
    const lesson = lessonCatalog.find((item) => item.id === 361)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0546"');
    expect(html).toContain("draggable-editable-vector-pair-determinant-area-rank-independence-homogeneous-relation");
    expect(html).toContain('data-det="5"');
    expect(html).toContain('data-rank="2"');
    expect(html).toContain('data-independent="true"');
  });

  it("uses candidate-specific closure rules for lesson 362", () => {
    const lesson = lessonCatalog.find((item) => item.id === 362)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0547"');
    expect(html).toContain("candidate-set-membership-rule-zero-addition-scalar-closure-editable-linear-combination");
    expect(html).toContain('data-combination="[3,3,0]"');
    expect(html).toContain('data-subspace="true"');
  });

  it("uses the real Gram-Schmidt projection pipeline for lesson 363", () => {
    const lesson = lessonCatalog.find((item) => item.id === 363)!;
    const html = renderToStaticMarkup(<MatrixLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="matrix-mockup-0548"');
    expect(html).toContain("editable-draggable-two-vector-real-gram-schmidt-projection-subtraction-normalization");
    expect(html).toContain('data-projection="[0.5,0.5]"');
    expect(html).toContain('data-u2="[0.5,-0.5]"');
    expect(html).toContain('data-dot="0"');
  });

  it("does not show determinant as the primary result for unrelated concepts", () => {
    for (const lessonId of [364]) {
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
