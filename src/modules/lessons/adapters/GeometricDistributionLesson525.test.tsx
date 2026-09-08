import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Geometric Distribution dedicated surface",()=>{it("routes lesson 525 to its first-success lab",()=>{const lesson=lessonCatalog.find(item=>item.id===525)!;const html=renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()}/>);expect(html).toContain('data-testid="probability-mockup-0488"');expect(html).toContain("Bernoulli Trials Until First Success");expect(html).toContain("0.1029");expect(html).toContain("7.7778");expect(html).toContain("0.6570");});});
