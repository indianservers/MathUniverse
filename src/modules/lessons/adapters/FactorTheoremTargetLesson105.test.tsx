import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import FactorTheoremTargetLesson105 from "./FactorTheoremTargetLesson105";

describe("FactorTheoremTargetLesson105", () => {
  it("renders the target factor test from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <FactorTheoremTargetLesson105
        lesson={{ id: 105 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0162"');
    expect(html).toContain('data-polynomial="x² − 3x + 2"');
    expect(html).toContain('data-factor-root="1"');
    expect(html).toContain('data-evaluated="0"');
    expect(html).toContain('data-quotient="x − 2"');
    expect(html).toContain('data-remainder="0"');
    expect(html).toContain('data-is-factor="true"');
    expect(html).toContain('data-other-root="2"');
    expect(html).toContain('aria-label="Drag candidate factor"');
    expect(html).toContain('aria-label="Drag extracted a"');
  });
});
