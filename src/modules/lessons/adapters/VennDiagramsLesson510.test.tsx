import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Venn Diagrams dedicated surface", () => {
  it("routes lesson 510 to its draggable outcome classifier", () => {
    const lesson = lessonCatalog.find((item) => item.id === 510)!;
    const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="probability-mockup-0473"');
    expect(html).toContain("Classify outcomes");
    expect(html).toContain("Set notation (live)");
    expect(html).toContain("0.850");
  });
});
