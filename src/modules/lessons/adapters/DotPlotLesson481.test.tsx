import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Dot Plot dedicated surface", () => { it("routes 481 to stacked observation interaction", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 481)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0444"'); expect(html).toContain("Build your own dot plot"); expect(html).toContain("Dot Plot (n = 11)"); expect(html).toContain("Common misconception"); expect(html.match(/aria-label="Dot plot value/g)).toHaveLength(11); expect(html).not.toContain("Shift all data"); }); });
