import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Probability scale dedicated surface", () => { it("routes 502 to linked scale and simulation controls", () => { const lesson = lessonCatalog.find(item => item.id === 502)!; const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="probability-mockup-0465"'); expect(html).toContain("Probability Scale"); expect(html).toContain("Experiment &amp; feedback"); expect(html.match(/aria-label="Probability position/g)).toHaveLength(5); }); });
