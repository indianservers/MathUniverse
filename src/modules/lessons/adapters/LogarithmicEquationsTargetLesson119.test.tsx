import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LogarithmicEquationsTargetLesson119 from "./LogarithmicEquationsTargetLesson119";

describe("LogarithmicEquationsTargetLesson119", () => {
  it("renders the target domain gate, calculated ladder, and candidate controls", () => {
    const html = renderToStaticMarkup(
      <LogarithmicEquationsTargetLesson119
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0176"');
    expect(html).toContain('data-problem="2,5,32"');
    expect(html).toContain('data-domain-pass="true"');
    expect(html).toContain('data-log-value="5"');
    expect(html).toContain('data-verified="true"');
    expect(html).toContain('data-ladder-match="5"');
    expect(html).toContain('data-ladder-rungs="5"');
    expect(html).toContain('aria-label="Logarithm candidate slider"');
    expect(html).toContain('aria-label="Set logarithm candidate to 2 to 5"');
    expect(html).toContain('aria-label="Logarithmic practice answer"');
  });
});
