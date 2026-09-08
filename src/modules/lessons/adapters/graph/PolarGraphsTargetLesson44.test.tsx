import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PolarGraphsTargetLesson44 from "./PolarGraphsTargetLesson44";

describe("PolarGraphsTargetLesson44", () => {
  it("renders its dedicated mathematically linked polar model", () => {
    const html = renderToStaticMarkup(
      <PolarGraphsTargetLesson44
        lesson={{ id: 44, title: "Polar Graphs" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0136"');
    expect(html).toContain('data-dedicated-lesson="44"');
    expect(html).toContain('data-angle="40"');
    expect(html).toContain('data-petals="3"');
    expect(html).toContain('aria-label="Drag polar angle"');
    expect(html).toContain("3.464");
  });
});
