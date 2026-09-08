import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import AxisControlsTargetLesson50 from "./AxisControlsTargetLesson50";
describe("AxisControlsTargetLesson50", () => {
  it("renders a dedicated real axis configuration model", () => {
    const html = renderToStaticMarkup(
      <AxisControlsTargetLesson50
        lesson={{ id: 50, title: "Axis Controls" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0142"');
    expect(html).toContain('data-dedicated-lesson="50"');
    expect(html).toContain('data-x-range="[-4, 4]"');
    expect(html).toContain('data-y-range="[0, 18]"');
    expect(html).toContain('aria-label="Drag axis origin"');
    expect(html).toContain("Bad axis limits can hide important behavior");
  });
});
