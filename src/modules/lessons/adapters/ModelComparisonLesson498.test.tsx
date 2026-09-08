import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Model comparison dedicated surface", () => { it("routes 498 to three-model comparison", () => { const lesson = lessonCatalog.find(item => item.id === 498)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0461"'); expect(html).toContain("Model Comparison"); expect(html).toContain("Evidence-based model selection"); expect(html.match(/aria-label="Comparison y/g)).toHaveLength(10); }); });
