import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Hypergeometric Distribution dedicated surface", () => { it("routes lesson 523 to its without-replacement lab", () => { const lesson = lessonCatalog.find((item) => item.id === 523)!; const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />); expect(html).toContain('data-testid="probability-mockup-0486"'); expect(html).toContain("Sample without replacement"); expect(html).toContain("0.1761"); expect(html).toContain("0.9693"); }); });
