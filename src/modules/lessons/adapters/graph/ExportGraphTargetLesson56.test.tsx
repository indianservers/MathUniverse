import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ExportGraphTargetLesson56 from "./ExportGraphTargetLesson56";

describe("ExportGraphTargetLesson56", () => {
  it("renders a real export preview and settings", () => {
    const html = renderToStaticMarkup(
      <ExportGraphTargetLesson56
        lesson={{ id: 56, title: "Export Graph" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0148"');
    expect(html).toContain('data-dedicated-lesson="56"');
    expect(html).toContain('data-selected="(0.0, 0.500)"');
    expect(html).toContain('aria-label="Drag export selected point"');
    expect(html).toContain("Download PNG");
  });
});
