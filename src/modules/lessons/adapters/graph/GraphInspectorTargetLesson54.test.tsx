import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import GraphInspectorTargetLesson54 from "./GraphInspectorTargetLesson54";

describe("GraphInspectorTargetLesson54", () => {
  it("renders computed graph facts and a real probe", () => {
    const html = renderToStaticMarkup(
      <GraphInspectorTargetLesson54
        lesson={{ id: 54, title: "Graph Inspector" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0146"');
    expect(html).toContain('data-dedicated-lesson="54"');
    expect(html).toContain('data-y="-1.872"');
    expect(html).toContain('data-slope="1.320"');
    expect(html).toContain('aria-label="Drag graph inspector probe"');
    expect(html).toContain("Selected curve facts");
  });
});
