import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ConfidenceIntervalMeanLesson539 from "./ConfidenceIntervalMeanLesson539";
describe("ConfidenceIntervalMeanLesson539", () => {
  it("renders the target t interval", () => {
    const html = renderToStaticMarkup(
      <ConfidenceIntervalMeanLesson539
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 539, title: "Confidence Interval for Mean" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0502"');
    expect(html).toContain("Build and explore the confidence interval");
    expect(html).toContain("11.43");
    expect(html).toContain("0.918");
    expect(html).toContain("2.045");
    expect(html).toContain("(11.09, 11.77)");
  });
});
