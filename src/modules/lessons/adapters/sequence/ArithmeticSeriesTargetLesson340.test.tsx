import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ArithmeticSeriesTargetLesson340 from "./ArithmeticSeriesTargetLesson340";

describe("ArithmeticSeriesTargetLesson340", () => {
  it("renders the target scenario from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <ArithmeticSeriesTargetLesson340
        lesson={{ id: 340, title: "Arithmetic Series" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0525"');
    expect(html).toContain('data-terms="2,5,8,11,14,17,20,23,26,29"');
    expect(html).toContain('data-partials="2,7,15,26,40,57,77,100,126,155"');
    expect(html).toContain('data-pair-sum="31"');
    expect(html).toContain('data-total="155"');
    expect(html).toContain('data-language="en"');
    expect(html).toContain("348");
  });
});
