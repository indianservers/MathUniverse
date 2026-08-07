import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ComplexLessonAdapter from "./ComplexLessonAdapter";

describe("ComplexLessonAdapter", () => {
  it("renders complex lessons 365 through 377 with lesson-specific guidance", () => {
    const expected = new Map([
      [365, "Complex plane"],
      [366, "Real and imaginary parts"],
      [367, "Complex addition"],
      [368, "Complex multiplication"],
      [369, "Complex conjugate"],
      [370, "Modulus and argument"],
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
        <ComplexLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, String(lessonId)).toContain(lesson.title);
      expect(html, String(lessonId)).toContain(snippet);
      expect(html, String(lessonId)).not.toContain("Complex numbers");
    }
  });
});
