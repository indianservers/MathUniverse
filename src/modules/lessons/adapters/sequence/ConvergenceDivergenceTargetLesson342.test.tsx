import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ConvergenceDivergenceTargetLesson342 from "./ConvergenceDivergenceTargetLesson342";

describe("ConvergenceDivergenceTargetLesson342", () => {
  it("renders the target geometric analysis from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <ConvergenceDivergenceTargetLesson342
        lesson={{ id: 342, title: "Convergence and Divergence" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0527"');
    expect(html).toContain('data-terms="4,2,1,0.5,0.25');
    expect(html).toContain('data-partials="4,6,7,7.5,7.75');
    expect(html).toContain('data-converges="true"');
    expect(html).toContain('data-absolute="true"');
    expect(html).toContain('data-sum="8"');
    expect(html).toContain('data-language="en"');
  });
});
