import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Box Plot dedicated surface", () => {
  it("routes 480 to five-number summary interaction", () => {
    const html = renderToStaticMarkup(
      <StatisticsLessonAdapter
        lesson={lessonCatalog.find((item) => item.id === 480)!}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="statistics-mockup-0443"');
    expect(html).toContain("Box plot (IQR");
    expect(html).toContain("Outlier fences");
    expect(html).toContain("five-number summary");
    expect(html.match(/aria-label="Box plot data value/g)).toHaveLength(20);
    expect(html).not.toContain("Shift all data");
  });
});
