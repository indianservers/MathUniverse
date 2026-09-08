import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SequenceGeneratorTargetLesson334 from "./SequenceGeneratorTargetLesson334";

describe("SequenceGeneratorTargetLesson334", () => {
  it("renders the target quadratic from the dedicated model", () => {
    const html = renderToStaticMarkup(
      <SequenceGeneratorTargetLesson334
        lesson={{ id: 334, title: "Sequence Generator" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0519"');
    expect(html).toContain('data-terms="6,17,34,57,86,121,162,209,262,321"');
    expect(html).toContain('data-second-difference="6,6,6,6,6,6,6,6"');
    expect(html).toContain('data-classification="Quadratic sequence"');
    expect(html).toContain('data-generated-revision="1"');
  });
});
