import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import CompoundInequalitiesTargetLesson123 from "./CompoundInequalitiesTargetLesson123";

describe("CompoundInequalitiesTargetLesson123", () => {
  it("renders the target intersection, endpoints, interval, and evaluated tests", () => {
    const html = renderToStaticMarkup(
      <CompoundInequalitiesTargetLesson123
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0180"');
    expect(html).toContain('data-problem="AND,2,6,false,true"');
    expect(html).toContain('data-interval="(2, 6]"');
    expect(html).toContain('data-empty="false"');
    expect(html).toContain('aria-label="Drag compound lower boundary"');
    expect(html).toContain('aria-label="Drag compound upper boundary"');
    expect(html).toContain("x = 4");
    expect(html).toContain("Passes both");
    expect(html).toContain("Interval notation: (2, 6]");
  });
});
