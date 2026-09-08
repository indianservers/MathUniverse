import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Poisson Distribution dedicated surface",()=>{it("routes lesson 524 to its rate-window PMF lab",()=>{const lesson=lessonCatalog.find(item=>item.id===524)!;const html=renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()}/>);expect(html).toContain('data-testid="probability-mockup-0487"');expect(html).toContain("Poisson Lab");expect(html).toContain("0.1251");expect(html).toContain("3.1623");});});
