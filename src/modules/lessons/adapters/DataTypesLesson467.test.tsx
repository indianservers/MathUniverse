import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";

describe("Data Types dedicated adapter routing and surface", () => {
  function render() {
    return renderToStaticMarkup(
      <StatisticsLessonAdapter
        lesson={lessonCatalog.find((lesson) => lesson.id === 467)!}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
  }
  it("routes 467 to its own classification surface, not generic statistics controls", () => {
    const html = render();
    expect(html).toContain('data-testid="statistics-mockup-0430"');
    expect(html).toContain(
      "Classify the variables and match to the best graph",
    );
    for (const text of [
      "Shift all data",
      "Add spread",
      "Extreme value",
      "Editable dataset",
      "Current model",
    ])
      expect(html).not.toContain(text);
    expect(html.match(/draggable="true"/g)).toHaveLength(10);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(10);
    expect(html.match(/Assign selected variable to/g)).toHaveLength(6);
  });
  it("renders four graph previews, reference content and eight unfilled practice selects", () => {
    const html = render();
    for (const name of ["Bar chart", "Pie chart", "Dot plot", "Histogram"])
      expect(html).toContain(`aria-label="${name} example"`);
    for (const text of [
      "Definition",
      "Classify correctly",
      "Quick reference",
      "Common mistake",
      "Check my answers",
      "0 / 4 correct (not checked)",
    ])
      expect(html).toContain(text);
    expect(html.match(/<select /g)).toHaveLength(8);
    expect(html.match(/value="" selected=""/g)).toHaveLength(8);
    expect(html).toContain('role="status"');
  });
});
