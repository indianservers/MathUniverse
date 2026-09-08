import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Interpolation dedicated surface", () => { it("routes 499 to prediction reliability controls", () => { const lesson = lessonCatalog.find(item => item.id === 499)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0462"'); expect(html).toContain("Interpolation and Extrapolation"); expect(html).toContain("Output &amp; Reliability"); expect(html.match(/aria-label="Interpolation y/g)).toHaveLength(9); }); });
