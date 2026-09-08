import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Inverse Probability dedicated surface", () => {
  it("routes lesson 520 to its quantile finder", () => {
    const lesson = lessonCatalog.find((item) => item.id === 520)!;
    const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="probability-mockup-0483"');
    expect(html).toContain("Find the quantile (inverse probability)");
    expect(html).toContain("x = 1.6449");
  });
});
