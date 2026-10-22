import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import AbsoluteValueEquationsTargetLesson121 from "./AbsoluteValueEquationsTargetLesson121";

describe("AbsoluteValueEquationsTargetLesson121", () => {
  it("renders the target's calculated number line, branches, and graded practice", () => {
    const html = renderToStaticMarkup(
      <AbsoluteValueEquationsTargetLesson121
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0178"');
    expect(html).toContain('data-problem="3,2"');
    expect(html).toContain('data-solutions="1,5"');
    expect(html).toContain('data-solvable="true"');
    expect(html).toContain(
      'aria-label="Number line centered at 3 with solutions 1 and 5"',
    );
    expect(html).toContain('aria-label="Drag absolute value center"');
    expect(html).toContain('aria-label="Drag left absolute value solution"');
    expect(html).toContain(
      'aria-label="First absolute-value practice solution"',
    );
    expect(html).toContain(
      'aria-label="Second absolute-value practice solution"',
    );
    expect(html).toContain("x = 1 or x = 5");
  });
});
