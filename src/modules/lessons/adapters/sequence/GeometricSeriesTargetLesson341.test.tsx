import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import GeometricSeriesTargetLesson341 from "./GeometricSeriesTargetLesson341";

describe("GeometricSeriesTargetLesson341", () => {
  it("renders the convergent target scenario from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <GeometricSeriesTargetLesson341
        lesson={{ id: 341, title: "Geometric Series" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0526"');
    expect(html).toContain(
      'data-terms="3,1.5,0.75,0.375,0.1875,0.09375,0.046875,0.023438,0.011719,0.005859"',
    );
    expect(html).toContain('data-finite="5.994141"');
    expect(html).toContain('data-converges="true"');
    expect(html).toContain('data-infinite="6"');
    expect(html).toContain('data-language="en"');
    expect(html).toContain("1.428571");
  });
});
