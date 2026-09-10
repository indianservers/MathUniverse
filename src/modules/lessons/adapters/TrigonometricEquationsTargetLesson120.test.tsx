import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import TrigonometricEquationsTargetLesson120 from "./TrigonometricEquationsTargetLesson120";

describe("TrigonometricEquationsTargetLesson120", () => {
  it("renders the target's linked unit-circle, wave, and periodic solutions", () => {
    const html = renderToStaticMarkup(
      <TrigonometricEquationsTargetLesson120
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0177"');
    expect(html).toContain('data-problem="sin,30,1/2"');
    expect(html).toContain('data-solutions="30,150"');
    expect(html).toContain('data-angle-mode="degrees"');
    expect(html).toContain('aria-label="Drag reference angle on unit circle"');
    expect(html).toContain('aria-label="sin wave with two solution crossings"');
    expect(html).toContain('aria-label="First trigonometric practice angle"');
    expect(html).toContain('aria-label="Second trigonometric practice angle"');
    expect(html).toContain("θ = 30°, 150°");
  });
});
