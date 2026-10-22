import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import DistributionSimulationLesson536 from "./DistributionSimulationLesson536";
describe("DistributionSimulationLesson536", () => {
  it("renders a reproducible empirical comparison", () => {
    const html = renderToStaticMarkup(
      <DistributionSimulationLesson536
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="probability-mockup-0499"');
    expect(html).toContain("Distribution Simulation Lab");
    expect(html).toContain("Theoretical: 3.000");
    expect(html).toContain("Theoretical: 2.100");
    expect(html).toContain("0.3504");
  });
});
