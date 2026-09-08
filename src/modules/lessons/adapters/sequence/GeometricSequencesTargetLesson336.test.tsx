import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import GeometricSequencesTargetLesson336 from "./GeometricSequencesTargetLesson336";
describe("GeometricSequencesTargetLesson336", () => {
  it("renders every target representation from its model", () => {
    const html = renderToStaticMarkup(
      <GeometricSequencesTargetLesson336
        lesson={{ id: 336, title: "Geometric Sequences" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0521"');
    expect(html).toContain('data-terms="3,6,12,24,48,96,192,384,768,1536"');
    expect(html).toContain('data-behavior="Growth"');
    expect(html).toContain("a7 = 192");
    expect(html).toContain("a₁₀ = 3 · 2⁹ = 1536");
  });
});
