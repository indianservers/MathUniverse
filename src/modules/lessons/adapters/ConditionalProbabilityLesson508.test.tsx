import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Conditional Probability dedicated surface", () => {
  it("routes lesson 508 to its restricted dice sample-space lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 508)!;
    const html = renderToStaticMarkup(
      <ProbabilityLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="probability-mockup-0471"');
    expect(html).toContain("Population grid (sample space)");
    expect(html).toContain("Two-way table");
    expect(html).toContain("1/6");
    expect(html).toContain('data-testid="lesson-gateway-508"');
    expect(html).toContain("P(A|B) =");
    expect(html).toContain("Named misconception");
  });
});
