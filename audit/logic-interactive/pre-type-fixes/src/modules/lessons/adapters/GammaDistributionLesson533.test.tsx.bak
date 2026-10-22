import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import GammaDistributionLesson533 from "./GammaDistributionLesson533";
describe("GammaDistributionLesson533", () => {
  it("renders target gamma calculations", () => {
    const html = renderToStaticMarkup(
      <GammaDistributionLesson533 resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="probability-mockup-0496"');
    expect(html).toContain("Gamma Distribution");
    expect(html).toContain("6.000");
    expect(html).toContain("12.000");
    expect(html).toContain("0.7619");
    expect(html).toContain("0.2381");
  });
});
