import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ConfidenceIntervalProportionLesson540 from "./ConfidenceIntervalProportionLesson540";
describe("ConfidenceIntervalProportionLesson540", () => {
  it("renders the target Wilson interval", () => {
    const html = renderToStaticMarkup(
      <ConfidenceIntervalProportionLesson540
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={
          { id: 540, title: "Confidence Interval for Proportion" } as never
        }
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0503"');
    expect(html).toContain("0.7200");
    expect(html).toContain("[0.661, 0.772]");
    expect(html).toContain("0.0553");
    expect(html).toContain("Wilson (score)");
  });
});
