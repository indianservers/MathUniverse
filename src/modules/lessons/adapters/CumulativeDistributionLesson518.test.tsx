import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Cumulative Distribution dedicated surface", () => {
  it("routes lesson 518 to its linked PDF and CDF lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 518)!;
    const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="probability-mockup-0481"');
    expect(html).toContain("Probability Density Function f(x)");
    expect(html).toContain("Cumulative Distribution Function F(x)");
    expect(html).toContain("0.4900");
  });
});
