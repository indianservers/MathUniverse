import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import FractionEquationsTargetLesson109 from "./FractionEquationsTargetLesson109";

describe("FractionEquationsTargetLesson109", () => {
  it("renders the target LCD proof from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <FractionEquationsTargetLesson109
        lesson={{ id: 109 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0166"');
    expect(html).toContain('data-problem="x/3 + 2 = 5"');
    expect(html).toContain('data-lcd="3"');
    expect(html).toContain('data-cleared-constant="6"');
    expect(html).toContain('data-cleared-rhs="15"');
    expect(html).toContain('data-solution="9"');
    expect(html).toContain('data-check-equation="5"');
    expect(html).toContain('aria-label="Fraction term multiplier target"');
    expect(html).toContain('aria-label="Constant term multiplier target"');
    expect(html).toContain('aria-label="Right side multiplier target"');
  });
});
