import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Mutually Exclusive Events dedicated surface", () => {
  it("routes lesson 507 to its draggable sample-space lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 507)!;
    const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="probability-mockup-0470"');
    expect(html).toContain("Drag event sets");
    expect(html).toContain("Intersection meter");
    expect(html).toContain("P(A ∪ B)");
  });
});
