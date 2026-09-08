import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Correlation dedicated surface", () => { it("routes 489 to Pearson correlation controls", () => { const lesson = lessonCatalog.find(item => item.id === 489)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0452"'); expect(html).toContain("Correlation Coefficient"); expect(html).toContain("Pearson correlation"); expect(html.match(/aria-label="Correlation x/g)).toHaveLength(9); }); });
