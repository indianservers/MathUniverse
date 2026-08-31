import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import SequenceLessonAdapter from "./SequenceLessonAdapter";

describe("SequenceLessonAdapter", () => {
  it("renders all 13 sequence routes with explicit controls and linked representations", () => {
    const lessons = lessonCatalog.filter(
      (lesson) => lesson.adapter === "sequence",
    );
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
      if (lesson.id >= 334 && lesson.id <= 341) {
        expect(html, String(lesson.id)).toContain(
          `data-testid="sequence-mockup-0${lesson.id + 185}"`,
        );
        expect(html, String(lesson.id)).toContain("data-object-model=");
        expect(html, String(lesson.id)).toContain("<table");
        continue;
      }
      expect(html, String(lesson.id)).toContain("sequence and series lab");
      expect(html, String(lesson.id)).toContain('id="sequence-result"');
      expect(html.match(/type="range"/g), String(lesson.id)).toHaveLength(3);
      expect(html, String(lesson.id)).toContain("<table");
    }
  });

  it("renders concept language for advanced series rather than a generic S-n panel", () => {
    const expected = new Map([
      [339, "Σ"],
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

  it("renders strengthened sequence lessons 334 through 341 with dedicated models", () => {
    const expected = new Map([
      [334, ["Sequence Generator", "sequence-mockup-0519"]],
      [335, ["Arithmetic Sequences", "sequence-mockup-0520"]],
      [336, ["Geometric Sequences", "sequence-mockup-0521"]],
      [337, ["Recursive Sequences", "sequence-mockup-0522"]],
      [338, ["Fibonacci Sequence", "sequence-mockup-0523"]],
      [339, ["Sigma Notation", "sequence-mockup-0524"]],
      [340, ["Arithmetic Series", "sequence-mockup-0525"]],
      [341, ["Geometric Series", "sequence-mockup-0526"]],
    ]);

    for (const [lessonId, [title, testId]] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <SequenceLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      ).replaceAll("Â·", "-");

      expect(html, String(lessonId)).toContain(title);
      expect(html, String(lessonId)).toContain(`data-testid="${testId}"`);
      expect(html, String(lessonId)).toContain("data-object-model=");
    }
  });
});
