import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import BinomialSeriesTargetLesson345 from "./BinomialSeriesTargetLesson345";

describe("BinomialSeriesTargetLesson345", () => {
  it("renders the target scenario from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <BinomialSeriesTargetLesson345
        lesson={{ id: 345, title: "Binomial Series" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0530"');
    expect(html).toContain(
      'data-coefficients="1,0.75,-0.09375,0.0390625,-0.021972656,0.014282226"',
    );
    expect(html).toContain('data-target="1.287051801"');
    expect(html).toContain('data-partial="1.28708375"');
    expect(html).toContain('data-language="en"');
    expect(html).toContain("0.5x - 0.125x^2 + 0.0625x^3");
  });
});
