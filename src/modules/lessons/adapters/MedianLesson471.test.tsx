import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Median dedicated surface", () => { it("routes lesson 471 to ordered-data interaction", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 471)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0434"'); expect(html).toContain("Sorted data (auto-arranged)"); expect(html).toContain("Centre Finder (odd n)"); expect(html).toContain("resists outliers"); expect(html.match(/aria-label="Median data value/g)).toHaveLength(7); expect(html.match(/aria-label="Mean practice answer/g) ?? []).toHaveLength(0); expect(html).not.toContain("Shift all data"); }); });
