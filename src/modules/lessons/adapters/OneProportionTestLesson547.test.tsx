import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import OneProportionTestLesson547 from "./OneProportionTestLesson547";
describe("OneProportionTestLesson547", () => {
  it("renders a null-standardized test from the visible counts", () => {
    const html = renderToStaticMarkup(
      <OneProportionTestLesson547
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 547, title: "One-Proportion Test" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0510"');
    expect(html).toContain("0.3000");
    expect(html).toContain("0.03240");
    expect(html).toContain("z = 0.00");
    expect(html).toContain("Fail to reject H0");
    expect(html).toContain("Exact binomial test");
  });
});
