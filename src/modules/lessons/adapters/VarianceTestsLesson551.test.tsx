import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import VarianceTestsLesson551 from "./VarianceTestsLesson551";
describe("VarianceTestsLesson551", () => {
  it("renders the target two-variance F test", () => {
    const html = renderToStaticMarkup(
      <VarianceTestsLesson551
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 551, title: "Variance Tests" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0514"');
    expect(html).toContain("0.6400");
    expect(html).toContain("0.4078");
    expect(html).toContain("2.3452");
    expect(html).toContain("0.3241");
    expect(html).toContain("Fail to reject H0");
  });
});
