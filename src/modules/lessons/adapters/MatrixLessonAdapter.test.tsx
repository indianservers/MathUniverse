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
      expect(html, String(lesson.id)).toMatch(
        /matrix and linear-algebra lab|eigendirection lab/,
      );
      expect(html, String(lesson.id)).toContain('type="number"');
      expect(html, String(lesson.id)).not.toContain("Legacy");
    }
  });

  it("does not show determinant as the primary result for unrelated concepts", () => {
    for (const lessonId of [348, 350, 352, 356, 360, 363, 364]) {
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
