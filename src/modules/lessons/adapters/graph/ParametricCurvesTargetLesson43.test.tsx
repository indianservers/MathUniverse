import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ParametricCurvesTargetLesson43 from "./ParametricCurvesTargetLesson43";

describe("ParametricCurvesTargetLesson43", () => {
  it("renders its dedicated live parametric model", () => {
    const html = renderToStaticMarkup(
      <ParametricCurvesTargetLesson43
        lesson={{ id: 43, title: "Parametric Curves" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0135"');
    expect(html).toContain('data-dedicated-lesson="43"');
    expect(html).toContain('data-a="3"');
    expect(html).toContain('aria-label="Drag parametric particle"');
    expect(html).toContain("x = -2.4271");
    expect(html).toContain("Play motion");
  });
});
