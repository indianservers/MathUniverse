import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Frequency Tables dedicated surface", () => {
  it("routes 468 to the linked raw-data activity", () => {
    const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 468)!} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="statistics-mockup-0431"'); expect(html).toContain("Your data, your counts"); expect(html).toContain("Frequency (bar chart)");
    expect(html).toContain("Clear data"); expect(html).toContain("Challenge: Spot and repair the miscount"); expect(html).toContain("Relative frequency is not the same as frequency.");
    expect(html.match(/aria-label="Data value/g)).toHaveLength(20); expect(html.match(/role="img" aria-label="Frequency bar chart"/g)).toHaveLength(1);
    expect(html).not.toContain("Shift all data"); expect(html).not.toContain("Current model");
  });
});
