import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Bernoulli Distribution dedicated surface", () => {
  it("routes lesson 521 to its trial and PMF lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 521)!;
    const html = renderToStaticMarkup(
      <ProbabilityLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="probability-mockup-0484"');
    expect(html).toContain("Interactive Lab: One Bernoulli Trial");
    expect(html).toContain("0.2275");
  });
});
