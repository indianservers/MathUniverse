import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import FunctionPlotterTargetLesson40 from "./FunctionPlotterTargetLesson40";

describe("FunctionPlotterTargetLesson40", () => {
  it("renders linked live outputs from its dedicated function model", () => {
    const html = renderToStaticMarkup(
      <FunctionPlotterTargetLesson40
        lesson={{ id: 40, title: "Function Plotter" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0132"');
    expect(html).toContain('data-dedicated-lesson="40"');
    expect(html).toContain('data-trace="1.5"');
    expect(html).toContain("f(1.5)");
    expect(html).toContain("0.250");
    expect(html).toContain("Sample values");
  });
});
