import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ChiSquareIndependenceLesson550 from "./ChiSquareIndependenceLesson550";
describe("ChiSquareIndependenceLesson550", () => {
  it("renders inference from the visible contingency table", () => {
    const html = renderToStaticMarkup(
      <ChiSquareIndependenceLesson550
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 550, title: "Chi-Square Independence" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0513"');
    expect(html).toContain("260");
    expect(html).toContain("0.832");
    expect(html).toContain("Fail to reject H0");
    expect(html).toContain("Cramér");
  });
});
