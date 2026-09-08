import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import WeibullDistributionLesson534 from "./WeibullDistributionLesson534";
describe("WeibullDistributionLesson534", () => {
  it("renders the target reliability workspace", () => {
    const html = renderToStaticMarkup(
      <WeibullDistributionLesson534 resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="probability-mockup-0497"');
    expect(html).toContain("Explore Weibull Behavior");
    expect(html).toContain("90.275");
    expect(html).toContain("78.322");
    expect(html).toContain("R(100) = 0.368");
    expect(html).toContain("h(100) = 0.0150");
  });
});
