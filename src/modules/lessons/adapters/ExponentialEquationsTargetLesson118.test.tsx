import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ExponentialEquationsTargetLesson118 from "./ExponentialEquationsTargetLesson118";

describe("ExponentialEquationsTargetLesson118", () => {
  it("renders the target power ladder, calculated result, and draggable graph point", () => {
    const html = renderToStaticMarkup(
      <ExponentialEquationsTargetLesson118
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0175"');
    expect(html).toContain('data-problem="2,32"');
    expect(html).toContain('data-exponent="5"');
    expect(html).toContain('data-checked-value="32"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-ladder-rungs="5"');
    expect(html).toContain('aria-label="Drag matching power 2 to 5"');
    expect(html).toContain('aria-label="Graph of 2 to the x with target 32"');
    expect(html).toContain('role="slider"');
  });
});
