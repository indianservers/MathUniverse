import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Logarithmic regression dedicated surface", () => { it("routes 493 to positive-domain log controls", () => { const lesson = lessonCatalog.find(item => item.id === 493)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0456"'); expect(html).toContain("Logarithmic Regression"); expect(html).toContain("x &gt; 0"); expect(html.match(/aria-label="Logarithmic x/g)).toHaveLength(6); }); });
