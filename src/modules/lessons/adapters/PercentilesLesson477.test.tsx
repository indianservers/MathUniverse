import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Percentiles dedicated surface", () => { it("routes 477 to percentile locator interaction", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 477)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0440"'); expect(html).toContain("Set percentile"); expect(html).toContain("Rank calculation"); expect(html).toContain("Inverse lookup: value"); expect(html.match(/aria-label="Percentile data value/g)).toHaveLength(9); expect(html).not.toContain("Shift all data"); }); });
