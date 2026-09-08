import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Logistic regression dedicated surface", () => { it("routes 495 to sigmoid and threshold controls", () => { const lesson = lessonCatalog.find(item => item.id === 495)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0458"'); expect(html).toContain("Logistic Regression"); expect(html).toContain("Decision threshold"); expect(html.match(/aria-label="Logistic x/g)).toHaveLength(10); }); });
