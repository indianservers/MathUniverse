import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import AuthoringLessonAdapter from "./AuthoringLessonAdapter";

describe("AuthoringLessonAdapter", () => {
  it("renders lessons 618 through 656 with lesson-specific authoring guidance", () => {
    const expected = new Map([
      [618, "Slider Component"],
      [619, "Checkbox"],
      [620, "Button"],
      [621, "Input Box"],
      [622, "Drop-Down List"],
      [623, "Dynamic Text"],
      [624, "Formula Display"],
      [625, "Image Object"],
      [626, "Audio and Video"],
      [627, "Pen and Highlighter"],
      [628, "Tables"],
      [629, "Multiple Pages"],
      [630, "Reset Construction"],
      [631, "Undo and Redo"],
      [632, "Object Locking"],
      [633, "Conditional Feedback"],
      [634, "Custom Tool Builder"],
      [635, "Command Library"],
      [636, "Object Scripting"],
      [637, "Randomisation"],
      [638, "Automatic Checking"],
      [639, "Import and Export"],
      [640, "Concept Introduction"],
      [641, "Visualise"],
      [642, "Manipulative Laboratory"],
      [643, "Guided Exploration"],
      [644, "Predict-Test-Explain"],
      [645, "Worked Example"],
      [646, "Step-by-Step Practice"],
      [647, "Construction Challenge"],
      [648, "Graph Matching"],
      [649, "Error Diagnosis"],
      [650, "Multiple Representations"],
      [651, "Real-World Application"],
      [652, "Open Investigation"],
      [653, "Dynamic Question Generator"],
      [654, "Mastery Challenge"],
      [655, "Exit Ticket"],
      [656, "Revision Summary"],
    ]);

    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <AuthoringLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, String(lessonId)).toContain(lesson.title);
      expect(html, String(lessonId)).toContain(snippet);
      expect(html, String(lessonId)).not.toContain("Match the tool to one learning job.");
    }
  });
});
