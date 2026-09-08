import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Variance dedicated surface", () => { it("routes 476 to dispersion calculations", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 476)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0439"'); expect(html).toContain("Dot plot with mean and deviations"); expect(html).toContain("Formula (Sample)"); expect(html).toContain("Formula (Population)"); expect(html.match(/aria-label="Variance data value/g)).toHaveLength(9); }); });
