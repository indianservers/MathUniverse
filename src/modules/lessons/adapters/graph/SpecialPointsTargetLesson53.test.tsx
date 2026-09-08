import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SpecialPointsTargetLesson53 from "./SpecialPointsTargetLesson53";

describe("SpecialPointsTargetLesson53", () => {
  it("renders the target structure with computed default features", () => {
    const html = renderToStaticMarkup(
      <SpecialPointsTargetLesson53
        lesson={{ id: 53, title: "Special Points" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="2d-graphing-mockup-0145"');
    expect(html).toContain('data-dedicated-lesson="53"');
    expect(html).toContain('data-roots="(-1, 0);(3, 0)"');
    expect(html).toContain("selectable-quadratic-and-line-generated-curves");
    expect(html).toContain('aria-label="Show Intersections"');
    expect(html).toContain("Why these points are special");
  });
});
