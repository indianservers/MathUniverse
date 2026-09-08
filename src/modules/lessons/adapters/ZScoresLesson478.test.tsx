import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Z-Scores dedicated surface", () => { it("routes 478 to standardisation interaction", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 478)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0441"'); expect(html).toContain("Normal distribution"); expect(html).toContain("z = (x"); expect(html).toContain("Misconception Guard"); expect(html.match(/aria-label="Z score/g)).toHaveLength(5); expect(html).not.toContain("Current model"); }); });
