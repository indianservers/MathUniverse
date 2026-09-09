import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PolynomialOperationsTargetLesson102 from "./PolynomialOperationsTargetLesson102";

describe("PolynomialOperationsTargetLesson102", () => {
  it("renders the target degree-column table from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <PolynomialOperationsTargetLesson102
        lesson={{ id: 102, title: "Polynomial Operations" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0159"');
    expect(html).toContain('data-polynomial-a="x² + 3x + 2"');
    expect(html).toContain('data-polynomial-b="2x + 3"');
    expect(html).toContain('data-result="x² + 5x + 5"');
    expect(html).toContain('data-left-value="11"');
    expect(html).toContain('data-equal="true"');
    expect(html).toContain('aria-label="Drag A degree 2 term"');
  });
});
