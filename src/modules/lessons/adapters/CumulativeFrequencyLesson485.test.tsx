import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Cumulative frequency dedicated surface", () => { it("routes 485 to the ogive workspace", () => { const lesson = lessonCatalog.find(item => item.id === 485)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0448"'); expect(html).toContain("Cumulative Frequency Curve"); expect(html).toContain("Less-than"); expect(html.match(/aria-label="Cumulative frequency/g)).toHaveLength(8); }); });
