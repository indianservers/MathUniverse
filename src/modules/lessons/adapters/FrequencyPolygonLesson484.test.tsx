import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Frequency polygon dedicated surface", () => { it("routes 484 to the midpoint polygon workspace", () => { const lesson = lessonCatalog.find(item => item.id === 484)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0447"'); expect(html).toContain("Frequency Polygon"); expect(html).toContain("Class intervals"); expect(html.match(/aria-label="Frequency polygon frequency/g)).toHaveLength(7); }); });
