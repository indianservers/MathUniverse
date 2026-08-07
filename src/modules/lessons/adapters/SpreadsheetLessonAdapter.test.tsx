import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import SpreadsheetLessonAdapter from "./SpreadsheetLessonAdapter";

describe("SpreadsheetLessonAdapter", () => {
  it("renders spreadsheet lessons 450 through 466 with lesson-specific guidance", () => {
    const expected = new Map([
      [450, "Data Entry Grid"],
      [451, "Cell Formulas"],
      [452, "Fill and Copy"],
      [453, "Relative References"],
      [454, "Absolute References"],
      [455, "Sorting"],
      [456, "Filtering"],
      [457, "Lists from Cells"],
      [458, "Points from Columns"],
      [459, "Matrices from Cells"],
      [460, "Frequency Tables"],
      [461, "Summary Statistics"],
      [462, "Spreadsheet Charts"],
      [463, "Regression from Data"],
      [464, "Dynamic Cell Links"],
      [465, "Import CSV"],
      [466, "Export Data"],
    ]);

    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <SpreadsheetLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, String(lessonId)).toContain(lesson.title);
      expect(html, String(lessonId)).toContain(snippet);
      expect(html, String(lessonId)).not.toContain("Keep cells labelled and formulas checked.");
    }
  });
});
