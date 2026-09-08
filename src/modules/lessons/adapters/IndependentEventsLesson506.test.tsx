import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Independent Events dedicated surface", () => {
  it("routes lesson 506 to its spinner and coin independence lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 506)!;
    const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="probability-mockup-0469"');
    expect(html).toContain("Joint Outcomes (Counts)");
    expect(html).toContain("Conditional Probabilities");
    expect(html).toContain("Likely Independent");
  });
});
