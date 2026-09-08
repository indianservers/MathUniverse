import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PointPlotterTargetLesson45 from "./PointPlotterTargetLesson45";

describe("PointPlotterTargetLesson45", () => {
  it("renders the dedicated editable point collection", () => {
    const html = renderToStaticMarkup(
      <PointPlotterTargetLesson45
        lesson={{ id: 45, title: "Point Plotter" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0137"');
    expect(html).toContain('data-dedicated-lesson="45"');
    expect(html).toContain('data-selected="C"');
    expect(html).toContain('data-count="5"');
    expect(html).toContain('aria-label="Drag point C"');
    expect(html).toContain("Add point");
  });
});
