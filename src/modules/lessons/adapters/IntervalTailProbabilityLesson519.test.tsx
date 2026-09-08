import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Interval and Tail Probability dedicated surface", () => {
  it("routes lesson 519 to its normal interval calculator", () => {
    const lesson = lessonCatalog.find((item) => item.id === 519)!;
    const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="probability-mockup-0482"');
    expect(html).toContain("Explore the Normal Distribution");
    expect(html).toContain("0.77454");
  });
});
