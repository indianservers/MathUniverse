import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import FinanceLessonAdapter from "./FinanceLessonAdapter";

describe("FinanceLessonAdapter", () => {
  it("renders all 27 finance routes with explicit controls and no legacy fallback", () => {
    const lessons = lessonCatalog.filter((lesson) => lesson.adapter === "finance");
    expect(lessons).toHaveLength(27);
    for (const lesson of lessons) {
      const html = renderToStaticMarkup(
        <FinanceLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html, String(lesson.id)).toContain(lesson.title);
      expect(html, String(lesson.id)).toMatch(
        /finance and modelling lab|simple-interest model/,
      );
      expect(html, String(lesson.id)).not.toContain("Legacy");
      expect(html, String(lesson.id)).toContain('type="range"');
    }
  });

  it("does not substitute an amortisation schedule for unrelated concepts", () => {
    for (const lessonId of [592, 593, 599, 601, 603, 610, 617]) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <FinanceLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html).not.toContain("Annual payment");
      expect(html).not.toContain("Opening");
      expect(html).not.toContain("Closing");
    }
  });
});
