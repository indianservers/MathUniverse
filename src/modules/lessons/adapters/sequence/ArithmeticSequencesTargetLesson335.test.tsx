import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ArithmeticSequencesTargetLesson335 from "./ArithmeticSequencesTargetLesson335";
describe("ArithmeticSequencesTargetLesson335", () => {
  it("renders every target representation from the dedicated model", () => {
    const html = renderToStaticMarkup(
      <ArithmeticSequencesTargetLesson335
        lesson={{ id: 335, title: "Arithmetic Sequences" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0520"');
    expect(html).toContain('data-terms="5,8,11,14,17,20,23,26,29,32"');
    expect(html).toContain('data-differences="3,3,3,3,3,3,3,3,3"');
    expect(html).toContain("a₂₅ = 77");
    expect(html).toContain("a₄₀ = 122");
    expect(html).toContain("C   38");
  });
});
