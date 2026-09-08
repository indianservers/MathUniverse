import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import TraceModeTargetLesson48 from "./TraceModeTargetLesson48";

describe("TraceModeTargetLesson48", () => {
  it("renders a dedicated exact trace model", () => {
    const html = renderToStaticMarkup(
      <TraceModeTargetLesson48
        lesson={{ id: 48, title: "Trace Mode" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0140"');
    expect(html).toContain('data-dedicated-lesson="48"');
    expect(html).toContain('data-x="1.8"');
    expect(html).toContain('data-slope="0.072798"');
    expect(html).toContain('aria-label="Drag trace point"');
    expect(html).toContain("Nearby values");
  });
});
