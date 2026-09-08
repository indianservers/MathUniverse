import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Tree Diagrams dedicated surface", () => {
  it("routes lesson 509 to its editable probability tree", () => {
    const lesson = lessonCatalog.find((item) => item.id === 509)!;
    const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="probability-mockup-0472"');
    expect(html).toContain("Build the tree");
    expect(html).toContain("Sample space (terminal outcomes)");
    expect(html).toContain("0.50");
  });
});
