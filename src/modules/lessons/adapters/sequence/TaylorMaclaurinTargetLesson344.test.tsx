import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import TaylorMaclaurinTargetLesson344 from "./TaylorMaclaurinTargetLesson344";

describe("TaylorMaclaurinTargetLesson344", () => {
  it("renders the target exponential polynomial from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <TaylorMaclaurinTargetLesson344
        lesson={{ id: 344, title: "Taylor and Maclaurin Series" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0529"');
    expect(html).toContain('data-function="e^x"');
    expect(html).toContain('data-coefficients="1,1,0.5,0.1666667,0.0416667"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-language="en"');
    expect(html).toContain("1+x+x^2/2+x^3/6+x^4/24");
  });
});
