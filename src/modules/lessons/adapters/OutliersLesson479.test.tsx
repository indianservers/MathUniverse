import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Outliers dedicated surface", () => { it("routes 479 to fence and outlier interaction", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 479)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0442"'); expect(html).toContain("Dot plot (edit points horizontally)"); expect(html).toContain("1.5×IQR rule"); expect(html).toContain("Outliers removed (resistant)"); expect(html.match(/aria-label="Outlier data value/g)).toHaveLength(14); expect(html).not.toContain("Shift all data"); }); });
