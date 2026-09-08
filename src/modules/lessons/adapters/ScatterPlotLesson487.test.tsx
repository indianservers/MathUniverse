import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Scatter plot dedicated surface", () => { it("routes 487 to paired-data controls", () => { const lesson = lessonCatalog.find(item => item.id === 487)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0450"'); expect(html).toContain("Scatter Plot"); expect(html).toContain("Correlation ≠ Causation"); expect(html.match(/aria-label="Scatter x/g)).toHaveLength(7); }); });
