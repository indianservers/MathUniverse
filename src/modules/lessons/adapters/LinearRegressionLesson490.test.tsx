import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Linear regression dedicated surface", () => { it("routes 490 to fit and prediction controls", () => { const lesson = lessonCatalog.find(item => item.id === 490)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0453"'); expect(html).toContain("Linear Regression"); expect(html).toContain("Best-Fit Challenge"); expect(html.match(/aria-label="Regression x/g)).toHaveLength(9); }); });
