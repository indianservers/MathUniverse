import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import SequenceLessonAdapter from "./SequenceLessonAdapter";

describe("SequenceLessonAdapter", () => {
  it("renders all 13 sequence routes with explicit controls and linked representations", () => {
    const lessons = lessonCatalog.filter((lesson) => lesson.adapter === "sequence");
    expect(lessons).toHaveLength(13);
    for (const lesson of lessons) {
      const html = renderToStaticMarkup(
        <SequenceLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html, String(lesson.id)).toContain(lesson.title);
      expect(html, String(lesson.id)).toContain("sequence and series lab");
      expect(html, String(lesson.id)).toContain('id="sequence-result"');
      expect(html.match(/type="range"/g), String(lesson.id)).toHaveLength(3);
      expect(html, String(lesson.id)).toContain("<table");
    }
  });

  it("renders concept language for advanced series rather than a generic S-n panel", () => {
    const expected = new Map([
      [339, "Σ(k="],
      [343, "Pₙ(x)"],
      [344, "Taylor approximation"],
      [345, "Binomial-series approximation"],
      [346, "growth·Pₙ"],
    ]);
    for (const [lessonId, text] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <SequenceLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html, String(lessonId)).toContain(text);
    }
  });

  it("renders strengthened sequence lessons 334 and 335 with their own presets", () => {
    const expected = new Map([
      [334, "Sequence Generator"],
      [335, "Arithmetic Sequences"],
    ]);

    for (const [lessonId, title] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <SequenceLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      ).replaceAll("Â·", "-");

      expect(html, String(lessonId)).toContain(title);
      expect(html, String(lessonId)).toContain("sequence and series lab");
      expect(html, String(lessonId)).toContain('id="sequence-result"');
    }
  });
});
