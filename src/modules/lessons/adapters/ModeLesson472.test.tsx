import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Mode dedicated surface", () => { it("routes lesson 472 to frequency-stack interaction", () => { const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lessonCatalog.find(item => item.id === 472)!} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0435"'); expect(html).toContain("See how frequency stacks form"); expect(html).toContain("Try a preset"); expect(html).toContain("Mode vs Largest Value"); expect(html.match(/aria-label="Mode data value/g)).toHaveLength(15); expect(html.match(/type="radio"/g)).toHaveLength(6); expect(html).not.toContain("Shift all data"); }); });
