import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Two-Way Tables dedicated surface",()=>{it("routes lesson 511 to its editable contingency table",()=>{const lesson=lessonCatalog.find(item=>item.id===511)!;const html=renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()}/>);expect(html).toContain('data-testid="probability-mockup-0474"');expect(html).toContain("Build and explore your two-way table");expect(html).toContain("Conditional probabilities");expect(html).toContain("0.50");});});
