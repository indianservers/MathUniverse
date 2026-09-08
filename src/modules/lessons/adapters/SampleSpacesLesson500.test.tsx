import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Sample spaces dedicated surface", () => { it("routes 500 to compound experiment controls", () => { const lesson = lessonCatalog.find(item => item.id === 500)!; const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="probability-mockup-0463"'); expect(html).toContain("Build your experiment"); expect(html).toContain("Total outcomes"); expect(html.match(/class="ss500-grid"/)).toHaveLength(1); expect(html).toContain("(H, 1, A)"); }); });
