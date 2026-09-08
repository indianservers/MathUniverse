import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Time-series dedicated surface", () => { it("routes 488 to the editable time-series workspace", () => { const lesson = lessonCatalog.find(item => item.id === 488)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0451"'); expect(html).toContain("Time-Series Plot"); expect(html).toContain("Moving average window"); expect(html.match(/aria-label="Time series value/g)).toHaveLength(11); }); });
