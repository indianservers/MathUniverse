import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SimultaneousLinearEquationsTargetLesson112 from "./SimultaneousLinearEquationsTargetLesson112";

describe("SimultaneousLinearEquationsTargetLesson112", () => {
  it("renders the target elimination and graph from calculated state", () => {
    const html = renderToStaticMarkup(
      <SimultaneousLinearEquationsTargetLesson112
        lesson={{ id: 112 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0169"');
    expect(html).toContain('data-equation-one="x + y = 7"');
    expect(html).toContain('data-equation-two="x − y = 1"');
    expect(html).toContain('data-combined-a="2"');
    expect(html).toContain('data-combined-b="0"');
    expect(html).toContain('data-solution-x="4"');
    expect(html).toContain('data-solution-y="3"');
    expect(html).toContain('aria-label="Elimination combination drop target"');
    expect(html).toContain('aria-label="Graph of x + y = 7 and x − y = 1"');
  });
});
