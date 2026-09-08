import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Grouped Frequency Tables dedicated surface", () => { it("routes 469 to real boundary controls, table and practice", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 469)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0432"'); expect(html).toContain("Interactive histogram"); expect(html).toContain("No gaps between classes"); expect(html).toContain("Quick self-check"); expect(html.match(/aria-label="Class boundary/g)).toHaveLength(5); expect(html.match(/aria-label="Self-check frequency/g)).toHaveLength(4); expect(html).not.toContain("Shift all data"); }); });
