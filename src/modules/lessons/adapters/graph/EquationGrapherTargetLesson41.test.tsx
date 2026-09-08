import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import EquationGrapherTargetLesson41 from "./EquationGrapherTargetLesson41";

describe("EquationGrapherTargetLesson41", () => {
  it("renders a dedicated, mathematically truthful solution-set tester", () => {
    const html = renderToStaticMarkup(
      <EquationGrapherTargetLesson41
        lesson={{ id: 41, title: "Equation Grapher" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0133"');
    expect(html).toContain('data-dedicated-lesson="41"');
    expect(html).toContain('data-point="2,1"');
    expect(html).toContain('aria-label="Drag equation test point"');
    expect(html.match(/does not satisfy/g)?.length).toBe(3);
    expect(html).toContain("Intersection finder");
  });
});
