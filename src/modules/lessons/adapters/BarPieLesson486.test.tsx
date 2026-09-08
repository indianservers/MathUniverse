import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Bar and pie dedicated surface", () => {
  it("routes 486 to linked chart controls", () => {
    const lesson = lessonCatalog.find((item) => item.id === 486)!;
    const html = renderToStaticMarkup(
      <StatisticsLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="statistics-mockup-0449"');
    expect(html).toContain("Bar and Pie Charts");
    expect(html).toContain("Pie Chart");
    expect(html.match(/aria-label="Bar pie frequency/g)).toHaveLength(5);
  });
});
