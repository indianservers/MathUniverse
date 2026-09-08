import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import MultipleGraphicsViewsTargetLesson52 from "./MultipleGraphicsViewsTargetLesson52";
describe("MultipleGraphicsViewsTargetLesson52", () => {
  it("renders four synchronized representations", () => {
    const html = renderToStaticMarkup(
      <MultipleGraphicsViewsTargetLesson52
        lesson={{ id: 52, title: "Multiple Graphics Views" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0144"');
    expect(html).toContain('data-dedicated-lesson="52"');
    expect(html).toContain('data-layout="grid"');
    expect(html).toContain('data-y="1.409297"');
    expect(html).toContain('aria-label="Drag graph cursor"');
    expect(html).toContain("Same object, different views");
  });
});
