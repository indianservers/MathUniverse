import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Range dedicated surface", () => { it("routes 474 to min/max spread interaction", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 474)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0437"'); expect(html).toContain("Range = max"); expect(html).toContain("Outlier toggle"); expect(html).toContain("Values in between do not affect the range"); expect(html.match(/aria-label="Range data value/g)).toHaveLength(8); expect(html).not.toContain("Shift all data"); }); });
