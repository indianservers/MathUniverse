import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import GridControlsTargetLesson51 from "./GridControlsTargetLesson51";
describe("GridControlsTargetLesson51", () => {
  it("renders a dedicated derived grid model", () => {
    const html = renderToStaticMarkup(
      <GridControlsTargetLesson51
        lesson={{ id: 51, title: "Grid Controls" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0143"');
    expect(html).toContain('data-dedicated-lesson="51"');
    expect(html).toContain('data-minor="0.25"');
    expect(html).toContain('data-selected-y="1.125"');
    expect(html).toContain('aria-label="Drag grid estimate point"');
    expect(html).toContain("Gridlines guide reading");
  });
});
