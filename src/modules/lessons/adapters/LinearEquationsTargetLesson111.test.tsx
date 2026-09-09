import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LinearEquationsTargetLesson111 from "./LinearEquationsTargetLesson111";

describe("LinearEquationsTargetLesson111", () => {
  it("renders the target algebra and graph from calculated state", () => {
    const html = renderToStaticMarkup(
      <LinearEquationsTargetLesson111
        lesson={{ id: 111 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0168"');
    expect(html).toContain('data-problem="4x + 1 = 13"');
    expect(html).toContain('data-intermediate="12"');
    expect(html).toContain('data-solution="3"');
    expect(html).toContain('data-check-value="13"');
    expect(html).toContain('aria-label="Constant operation drop target"');
    expect(html).toContain('aria-label="Coefficient operation drop target"');
    expect(html).toContain(
      'aria-label="Interactive graph of y = 4x + 1 and y = 13"',
    );
  });
});
