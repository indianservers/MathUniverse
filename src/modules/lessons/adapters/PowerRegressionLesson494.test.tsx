import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Power regression dedicated surface", () => { it("routes 494 to log-log power controls", () => { const lesson = lessonCatalog.find(item => item.id === 494)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0457"'); expect(html).toContain("Power Regression"); expect(html).toContain("Log-log transform"); expect(html.match(/aria-label="Power x/g)).toHaveLength(9); }); });
