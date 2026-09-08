import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import TwoProportionTestLesson548 from "./TwoProportionTestLesson548";
describe("TwoProportionTestLesson548", () => {
  it("renders a real pooled test and unpooled interval", () => {
    const html = renderToStaticMarkup(
      <TwoProportionTestLesson548
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 548, title: "Two-Proportion Test" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0511"');
    expect(html).toContain("0.2900");
    expect(html).toContain("0.1900");
    expect(html).toContain("0.2400");
    expect(html).toContain("2.341");
    expect(html).toContain("0.0192");
    expect(html).toContain("Reject H0");
  });
});
