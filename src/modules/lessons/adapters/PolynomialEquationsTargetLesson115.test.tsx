import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PolynomialEquationsTargetLesson115 from "./PolynomialEquationsTargetLesson115";

describe("PolynomialEquationsTargetLesson115", () => {
  it("renders the target factor stack and cubic graph from calculated roots", () => {
    const html = renderToStaticMarkup(
      <PolynomialEquationsTargetLesson115
        lesson={{ id: 115 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0172"');
    expect(html).toContain('data-roots="1,2,3"');
    expect(html).toContain('data-coefficients="1,-6,11,-6"');
    expect(html).toContain('data-root-checks="0,0,0"');
    expect(html).toContain('data-test-result="0"');
    expect(html).toContain('aria-label="Drag polynomial root 1"');
    expect(html).toContain('aria-label="Cubic graph with roots 1, 2, 3"');
  });
});
