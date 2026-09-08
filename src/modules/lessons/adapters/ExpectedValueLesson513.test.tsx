import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Expected Value dedicated surface", () => {
  it("routes lesson 513 to its editable payoff and simulation lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 513)!;
    const html = renderToStaticMarkup(
      <ProbabilityLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="probability-mockup-0476"');
    expect(html).toContain("Probability-Weighted Balance");
    expect(html).toContain("Long-Run Simulation");
    expect(html).toContain("35.00");
  });
});
