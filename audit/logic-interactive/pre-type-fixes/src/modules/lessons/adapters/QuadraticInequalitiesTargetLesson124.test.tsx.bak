import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import QuadraticInequalitiesTargetLesson124 from "./QuadraticInequalitiesTargetLesson124";

describe("QuadraticInequalitiesTargetLesson124", () => {
  it("renders the target factorization, roots, sign intervals, and solution", () => {
    const html = renderToStaticMarkup(
      <QuadraticInequalitiesTargetLesson124
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0181"');
    expect(html).toContain('data-roots="2,3"');
    expect(html).toContain('data-relation="1,&gt;"');
    expect(html).toContain('data-solution="(−∞, 2) ∪ (3, ∞)"');
    expect(html).toContain('aria-label="Drag quadratic first root"');
    expect(html).toContain('aria-label="Drag quadratic second root"');
    expect(html).toContain(
      'aria-label="Quadratic inequality parabola with roots"',
    );
    expect(html).toContain("x &lt; 2 or x &gt; 3");
    expect(html).toContain("x² − 5x + 6");
  });
});
