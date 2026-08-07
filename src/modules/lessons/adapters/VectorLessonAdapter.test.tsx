import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import VectorLessonAdapter from "./VectorLessonAdapter";

describe("VectorLessonAdapter", () => {
  it("renders vector lessons 183 through 197 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      183: "A vector has size and direction",
      184: "Component form",
      185: "Position vector",
      186: "Vector addition",
      187: "Vector subtraction",
      188: "Scalar multiplication",
      189: "Magnitude",
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
        <VectorLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
    }
  });
});
