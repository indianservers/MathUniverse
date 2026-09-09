import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import DoubleBracketsTargetLesson96 from "./DoubleBracketsTargetLesson96";

describe("DoubleBracketsTargetLesson96", () => {
  it("renders the target area workspace from its dedicated binomial model", () => {
    const html = renderToStaticMarkup(
      <DoubleBracketsTargetLesson96
        lesson={{ id: 96, title: "Double Brackets" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0153"');
    expect(html).toContain('data-expression="(x + 2)(x + 3)"');
    expect(html).toContain('data-uncombined="x² + 3x + 2x + 6"');
    expect(html).toContain('data-expanded="x² + 5x + 6"');
    expect(html).toContain('data-equivalent="true"');
    expect(html).toContain('aria-label="Drag first middle product"');
  });
});
