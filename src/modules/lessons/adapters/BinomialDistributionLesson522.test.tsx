import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Binomial Distribution dedicated surface", () => {
  it("routes lesson 522 to its PMF and simulation lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 522)!;
    const html = renderToStaticMarkup(
      <ProbabilityLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="probability-mockup-0485"');
    expect(html).toContain("Binomial Distribution Lab");
    expect(html).toContain("0.2508");
    expect(html).toContain("0.6177");
  });
});
