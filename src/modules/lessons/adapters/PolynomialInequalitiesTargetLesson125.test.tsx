import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PolynomialInequalitiesTargetLesson125 from "./PolynomialInequalitiesTargetLesson125";

describe("PolynomialInequalitiesTargetLesson125", () => {
  it("renders the dedicated target model, numerical sign chart, and worked examples", () => {
    const html = renderToStaticMarkup(
      <PolynomialInequalitiesTargetLesson125
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0182"');
    expect(html).toContain('data-dedicated-lesson="125"');
    expect(html).toContain('data-roots="-2x1,1x1,3x1"');
    expect(html).toContain('data-relation="1,&gt;="');
    expect(html).toContain('data-solution="[-2, 1] ∪ [3, ∞)"');
    expect(html).toContain('data-evaluations="-24,7.88,-4,18"');
    expect(html).toContain('aria-label="Drag polynomial root 1"');
    expect(html).toContain('aria-label="Polynomial graph linked to roots"');
    expect(html).toContain("Three simple roots");
    expect(html).toContain("One repeated root");
    expect(html).toContain("Negative leading term");
    expect(html).toContain("Test x = -2 → f(x) = -16");
    expect(html).toContain("Solution: (−∞, -1)");
  });
});
