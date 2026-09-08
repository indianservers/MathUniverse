import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ZoomPanTargetLesson49 from "./ZoomPanTargetLesson49";
describe("ZoomPanTargetLesson49", () => {
  it("renders a dedicated synchronized viewport model", () => {
    const html = renderToStaticMarkup(
      <ZoomPanTargetLesson49
        lesson={{ id: 49, title: "Zoom and Pan" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0141"');
    expect(html).toContain('data-dedicated-lesson="49"');
    expect(html).toContain('data-width="4"');
    expect(html).toContain('aria-label="Drag viewport"');
    expect(html).toContain("Same equation, different view");
  });
});
