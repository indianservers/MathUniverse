import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ChiSquareGoodnessOfFitLesson549 from "./ChiSquareGoodnessOfFitLesson549";
describe("ChiSquareGoodnessOfFitLesson549", () => {
  it("renders the target five-category test", () => {
    const html = renderToStaticMarkup(
      <ChiSquareGoodnessOfFitLesson549
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 549, title: "Chi-Square Goodness-of-Fit" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0512"');
    expect(html).toContain("χ²=1.500");
    expect(html).toContain("0.8266");
    expect(html).toContain("Fail to reject H0");
    expect(html).toContain("25.000");
  });
});
