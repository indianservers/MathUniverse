import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ChiSquareDistributionLesson530 from "./ChiSquareDistributionLesson530";

describe("ChiSquareDistributionLesson530", () => {
  it("renders the target distribution and goodness-of-fit values", () => {
    const html = renderToStaticMarkup(
      <ChiSquareDistributionLesson530 resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain('data-testid="probability-mockup-0493"');
    expect(html).toContain("Explore the Chi-Square Distribution");
    expect(html).toContain("12.592");
    expect(html).toContain("3.700");
    expect(html).toContain("0.593");
  });
});
