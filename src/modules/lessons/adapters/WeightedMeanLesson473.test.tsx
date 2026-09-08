import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Weighted Mean dedicated surface", () => { it("routes 473 to linked value-weight controls", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 473)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0436"'); expect(html).toContain("Mass blocks"); expect(html).toContain("Weighted Mean (Σwx ÷ Σw)"); expect(html).toContain("Ordinary Mean"); expect(html.match(/aria-label="Weight [0-9]/g)).toHaveLength(4); expect(html.match(/aria-label="Weighted mean practice/g)).toHaveLength(3); expect(html).not.toContain("Shift all data"); }); });
