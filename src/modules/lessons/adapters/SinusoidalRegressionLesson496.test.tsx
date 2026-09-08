import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Sinusoidal regression dedicated surface", () => { it("routes 496 to periodic model controls", () => { const lesson = lessonCatalog.find(item => item.id === 496)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0459"'); expect(html).toContain("Sinusoidal Regression"); expect(html).toContain("Period T"); expect(html.match(/aria-label="Sinusoidal y/g)).toHaveLength(12); }); });
