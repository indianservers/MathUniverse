import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SamplingDistributionsLesson537 from "./SamplingDistributionsLesson537";
describe("SamplingDistributionsLesson537", () => {
  it("renders the target repeated-sampling workspace", () => {
    const html = renderToStaticMarkup(
      <SamplingDistributionsLesson537
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 537, title: "Sampling Distributions" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0500"');
    expect(html).toContain("Build the sampling distribution");
    expect(html).toContain("Standard error");
    expect(html).toContain("2.000");
    expect(html).toContain("20,000 samples");
  });
});
