import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";
describe("Stem-and-leaf dedicated surface", () => { it("routes 482 to the live plot surface", () => { const lesson = lessonCatalog.find(item => item.id === 482)!; const html = renderToStaticMarkup(<StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="statistics-mockup-0445"'); expect(html).toContain("Build your own stem-and-leaf plot"); expect(html).toContain("Key (live)"); expect(html.match(/aria-label="Stem leaf value/g)).toHaveLength(20); }); });
