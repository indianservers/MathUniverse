import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import AlgebraLessonAdapter from "./AlgebraLessonAdapter";

describe("AlgebraLessonAdapter", () => {
  it("renders algebra workspace lessons 19 through 30 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      19: "Workspace rule",
      20: "Variable rule",
      21: "Numeric slider",
      22: "Integer slider",
      23: "Angle slider",
      24: "Animation rule",
      25: "Dependency rule",
      26: "Visibility rule",
      27: "Dynamic label",
      28: "Input syntax",
      29: "Redefinition rule",
      30: "Equation input",
      31: "Inequality input",
      32: "List rule",
      33: "Matrix size",
      34: "Sequence rule",
      35: "Piecewise rule",
      36: "Boolean rule",
      37: "Dynamic text",
      38: "LaTeX display",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Algebra rule");
    }
  });
});
