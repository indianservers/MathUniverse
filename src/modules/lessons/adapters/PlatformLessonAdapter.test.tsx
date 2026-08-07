import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import PlatformLessonAdapter from "./PlatformLessonAdapter";

describe("PlatformLessonAdapter", () => {
  it("renders lessons 657 through 674 with capability-specific guidance", () => {
    const expected = new Map([
      [657, "Drag and Manipulate"],
      [658, "Zoom and Pan"],
      [659, "Reset View"],
      [660, "Undo and Redo"],
      [661, "Animation Player"],
      [662, "Snap Controls"],
      [663, "Trace and Locus"],
      [664, "Exact and Decimal Output"],
      [665, "Linked Views"],
      [666, "Save, Duplicate and Share"],
      [667, "Export"],
      [668, "Teacher Presentation Mode"],
      [669, "Learner Practice Mode"],
      [670, "Exam Mode"],
      [671, "Keyboard Navigation"],
      [672, "Screen Reader Support"],
      [673, "High Contrast and Large Text"],
      [674, "Multi-Language Terminology"],
    ]);

    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <PlatformLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, String(lessonId)).toContain(lesson.title);
      expect(html, String(lessonId)).toContain(snippet);
      expect(html, String(lessonId)).not.toContain("Platform capability");
    }
  });
});
