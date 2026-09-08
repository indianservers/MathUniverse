import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SigmaNotationTargetLesson339 from "./SigmaNotationTargetLesson339";
describe("SigmaNotationTargetLesson339", () => {
  it("renders the target sum from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <SigmaNotationTargetLesson339
        lesson={{ id: 339, title: "Sigma Notation" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0524"');
    expect(html).toContain('data-terms="2,5,10,17,26,37,50,65"');
    expect(html).toContain('data-partials="2,7,17,34,60,97,147,212"');
    expect(html).toContain('data-total="212"');
    expect(html).toContain("Growth: Quadratic");
    expect(html).toContain('data-language="en"');
  });
});
