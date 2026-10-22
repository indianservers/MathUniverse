import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LinearInequalitiesTargetLesson122 from "./LinearInequalitiesTargetLesson122";

describe("LinearInequalitiesTargetLesson122", () => {
  it("renders the target's calculated boundary, interval, test points, and graph", () => {
    const html = renderToStaticMarkup(
      <LinearInequalitiesTargetLesson122
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0179"');
    expect(html).toContain('data-problem="2,3,&gt;,9"');
    expect(html).toContain('data-boundary="3"');
    expect(html).toContain('data-solved-relation="&gt;"');
    expect(html).toContain('data-flipped="false"');
    expect(html).toContain('data-interval="(3, ∞)"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('aria-label="Drag linear inequality boundary"');
    expect(html).toContain("Test point: x = 4");
    expect(html).toContain("Interval notation: (3, ∞)");
  });
});
