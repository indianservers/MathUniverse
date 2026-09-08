import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Quartiles dedicated surface", () => { it("routes 475 to box plot and IQR interaction", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 475)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0438"'); expect(html).toContain("box plot"); expect(html).toContain("Fences (1.5 × IQR rule)"); expect(html).toContain("IQR = Q3"); expect(html.match(/aria-label="Quartile data value/g)).toHaveLength(9); expect(html).not.toContain("Shift all data"); }); });
