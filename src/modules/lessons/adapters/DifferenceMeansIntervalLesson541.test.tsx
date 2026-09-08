import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import DifferenceMeansIntervalLesson541 from "./DifferenceMeansIntervalLesson541";
describe("DifferenceMeansIntervalLesson541", () => {
  it("renders a real pooled two-sample interval", () => {
    const html = renderToStaticMarkup(
      <DifferenceMeansIntervalLesson541
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 541, title: "Difference of Means Interval" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0504"');
    expect(html).toContain("15.35");
    expect(html).toContain("8.75");
    expect(html).toContain("6.60");
    expect(html).toContain("(5.791, 7.409)");
    expect(html).toContain("5.23");
  });
});
