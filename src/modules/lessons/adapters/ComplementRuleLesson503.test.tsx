import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Complement rule dedicated surface", () => {
  it("routes 503 to linked event and complement controls", () => {
    const lesson = lessonCatalog.find((item) => item.id === 503)!;
    const html = renderToStaticMarkup(
      <ProbabilityLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="probability-mockup-0466"');
    expect(html).toContain("Twelve-sided die");
    expect(html).toContain("Linked probabilities");
    expect(html).toContain("P(Aᶜ)");
  });
});
