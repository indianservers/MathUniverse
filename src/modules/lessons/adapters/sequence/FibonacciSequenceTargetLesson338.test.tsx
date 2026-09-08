import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import FibonacciSequenceTargetLesson338 from "./FibonacciSequenceTargetLesson338";
describe("FibonacciSequenceTargetLesson338", () => {
  it("renders target terms, ratios, and dynamic spiral geometry", () => {
    const html = renderToStaticMarkup(
      <FibonacciSequenceTargetLesson338
        lesson={{ id: 338, title: "Fibonacci Sequence" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0523"');
    expect(html).toContain('data-terms="1,1,2,3,5,8,13,21,34,55,89,144"');
    expect(html).toContain("F<sub>10</sub> = <b>55</b>");
    expect(html).toContain("For n=10, Binet gives 55");
    expect(html).toContain('data-drag="fibonacci-seed-square"');
    expect(html).toContain('data-language="en"');
  });
});
