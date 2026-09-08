import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Exponential regression dedicated surface", () => {
  it("routes 492 to growth model controls", () => {
    const lesson = lessonCatalog.find((item) => item.id === 492)!;
    const html = renderToStaticMarkup(
      <StatisticsLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="statistics-mockup-0455"');
    expect(html).toContain("Exponential Regression");
    expect(html).toContain("growth factor");
    expect(html.match(/aria-label="Exponential x/g)).toHaveLength(10);
  });
});
