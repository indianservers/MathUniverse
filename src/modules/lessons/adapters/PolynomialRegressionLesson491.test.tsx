import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Polynomial regression dedicated surface", () => { it("routes 491 to degree and residual controls", () => { const lesson = lessonCatalog.find(item => item.id === 491)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0454"'); expect(html).toContain("Polynomial Regression"); expect(html).toContain("Model quality"); expect(html.match(/aria-label="Polynomial x/g)).toHaveLength(7); }); });
