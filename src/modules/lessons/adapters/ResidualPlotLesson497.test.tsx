import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Residual plot dedicated surface", () => { it("routes 497 to residual diagnostics", () => { const lesson = lessonCatalog.find(item => item.id === 497)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0460"'); expect(html).toContain("Residual Plot"); expect(html).toContain("Show vertical residuals"); expect(html.match(/aria-label="Residual observed/g)).toHaveLength(10); }); });
