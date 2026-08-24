import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import CasLessonAdapter from "./CasLessonAdapter";

describe("CasLessonAdapter", () => {
  it("renders symbolic lessons 428 through 449 with CAS-specific guidance", () => {
    const expected = new Map([
      [428, "Symbolic Evaluation"],
      [429, "Simplify"],
      [430, "Expand"],
      [431, "Factor"],
      [432, "Substitute"],
      [433, "Solve"],
      [434, "Numerical Solve"],
      [435, "Solve Systems"],
      [436, "Eliminate Variables"],
      [437, "Partial Fractions"],
      [438, "Polynomial Division"],
      [439, "Derivatives"],
      [440, "Integrals"],
      [441, "Limits"],
      [442, "Series Expansions"],
      [443, "Differential Equations"],
      [444, "Matrix Operations"],
      [445, "Complex Calculations"],
      [446, "Assumptions"],
      [447, "Exact / Numeric Toggle"],
      [448, "Step-by-Step Algebra"],
      [449, "CAS-to-Graph Link"],
    ]);

    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <CasLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, String(lessonId)).toContain(lesson.title);
      expect(html, String(lessonId)).toContain(snippet);
      expect(html, String(lessonId)).toContain(
        `symbolic-cas-mockup-${String(lessonId - 94).padStart(4, "0")}`,
      );
      expect(
        html.match(/data-lesson-control=/g)?.length,
        String(lessonId),
      ).toBeGreaterThanOrEqual(8);
      expect(html, String(lessonId)).not.toContain("CAS workspace</p>");
    }
  });
});
