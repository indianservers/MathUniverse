import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import TrigonometryLessonAdapter from "./TrigonometryLessonAdapter";

describe("TrigonometryLessonAdapter", () => {
  it("renders trigonometry lessons 257 through 276 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      257: "Angle measurement",
      258: "Unit circle",
      259: "Right-triangle ratios",
      260: "Exact trig values",
      261: "Sine graph",
      262: "Cosine graph",
      263: "Tangent graph",
      264: "Reciprocal trig",
      265: "Inverse trig",
      266: "Trig identities",
      267: "Compound-angle formulae",
      268: "Double and half angle",
      269: "Trig equations",
      270: "Sine rule",
      271: "Cosine rule",
      272: "Triangle area formula",
      273: "Bearings",
      274: "Elevation and depression",
      275: "Harmonic motion",
      276: "Polar trigonometry",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <TrigonometryLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain("data-direct-interaction=\"true\"");
      expect(html, lesson.title).toContain("Drag the point");
      expect(html, lesson.title).toContain("Drag graph marker");
      expect(html, lesson.title).not.toContain("Trig rule");
    }
  });
});
