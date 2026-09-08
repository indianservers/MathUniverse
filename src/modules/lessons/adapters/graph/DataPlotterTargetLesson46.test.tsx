import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import DataPlotterTargetLesson46 from "./DataPlotterTargetLesson46";

describe("DataPlotterTargetLesson46", () => {
  it("renders a dedicated dataset with computed fit and outlier", () => {
    const html = renderToStaticMarkup(
      <DataPlotterTargetLesson46
        lesson={{ id: 46, title: "Data Plotter" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0138"');
    expect(html).toContain('data-dedicated-lesson="46"');
    expect(html).toContain('data-outliers="5"');
    expect(html).toContain('data-count="10"');
    expect(html).toContain('aria-label="Drag data row 5"');
    expect(html).toContain("Add row");
  });
});
