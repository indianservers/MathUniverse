import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Histogram dedicated surface", () => { it("routes 483 to the live histogram workspace", () => { const lesson = lessonCatalog.find(item => item.id === 483)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0446"'); expect(html).toContain("Build your histogram"); expect(html).toContain("Histogram (continuous)"); expect(html).toContain("Frequency density"); expect(html.match(/aria-label="Histogram value/g)).toHaveLength(28); }); });
