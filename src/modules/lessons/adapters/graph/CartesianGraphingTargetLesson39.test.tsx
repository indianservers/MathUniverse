import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import CartesianGraphingTargetLesson39 from "./CartesianGraphingTargetLesson39";

describe("CartesianGraphingTargetLesson39", () => {
  it("renders the target ordered-pair state from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <CartesianGraphingTargetLesson39
        lesson={{ id: 39, title: "Cartesian Graphing" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0131"');
    expect(html).toContain('data-dedicated-lesson="39"');
    expect(html).toContain('data-point="(2, 3)"');
    expect(html).toContain('data-quadrant="Quadrant I"');
    expect(html).toContain('data-language="en"');
    expect(html).toContain('aria-label="Drag point P"');
    expect(html).toContain("Ordered pair confirmed");
  });
});
