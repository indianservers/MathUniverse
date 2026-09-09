import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import AlgebraicFractionsTargetLesson98 from "./AlgebraicFractionsTargetLesson98";

describe("AlgebraicFractionsTargetLesson98", () => {
  it("renders the target cancellation workspace from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <AlgebraicFractionsTargetLesson98
        lesson={{ id: 98, title: "Algebraic Fractions" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0155"');
    expect(html).toContain('data-numerator="x² − 1"');
    expect(html).toContain('data-denominator="x − 1"');
    expect(html).toContain('data-simplified="x + 1"');
    expect(html).toContain('data-restriction="1"');
    expect(html).toContain('data-equivalent="true"');
  });
});
