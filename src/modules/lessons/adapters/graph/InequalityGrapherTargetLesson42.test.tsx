import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import InequalityGrapherTargetLesson42 from "./InequalityGrapherTargetLesson42";

describe("InequalityGrapherTargetLesson42", () => {
  it("renders a dedicated, consistent feasible-region model", () => {
    const html = renderToStaticMarkup(
      <InequalityGrapherTargetLesson42
        lesson={{ id: 42, title: "Inequality Grapher" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0134"');
    expect(html).toContain('data-dedicated-lesson="42"');
    expect(html).toContain('data-point="2,2"');
    expect(html).toContain('data-solution="true"');
    expect(html).toContain('aria-label="Drag inequality test point"');
    expect(html).toContain("Solution (lies in overlap region)");
  });
});
