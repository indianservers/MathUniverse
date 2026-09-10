import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ThreeVariableSystemsTargetLesson113 from "./ThreeVariableSystemsTargetLesson113";

describe("ThreeVariableSystemsTargetLesson113", () => {
  it("renders the target elimination and plane model from calculated state", () => {
    const html = renderToStaticMarkup(
      <ThreeVariableSystemsTargetLesson113
        lesson={{ id: 113 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0170"');
    expect(html).toContain('data-determinant="4"');
    expect(html).toContain('data-solution-x="2"');
    expect(html).toContain('data-solution-y="1"');
    expect(html).toContain('data-solution-z="3"');
    expect(html).toContain('data-first-reduction="2x + 2z = 10"');
    expect(html).toContain('data-second-reduction="2z = 6"');
    expect(html).toContain(
      'aria-label="Three variable elimination drop target"',
    );
    expect(html).toContain(
      'aria-label="Interactive three plane intersection scene"',
    );
  });
});
