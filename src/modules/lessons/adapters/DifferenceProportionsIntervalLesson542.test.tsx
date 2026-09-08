import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import DifferenceProportionsIntervalLesson542 from "./DifferenceProportionsIntervalLesson542";

describe("DifferenceProportionsIntervalLesson542", () => {
  it("renders the real unpooled two-proportion interval", () => {
    const html = renderToStaticMarkup(
      <DifferenceProportionsIntervalLesson542
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={
          { id: 542, title: "Difference of Proportions Interval" } as never
        }
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0505"');
    expect(html).toContain("0.290");
    expect(html).toContain("0.200");
    expect(html).toContain("0.090");
    expect(html).toContain("(0.006, 0.174)");
    expect(html).toContain("0.04277");
  });
});
