import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RationalEquationsTargetLesson116 from "./RationalEquationsTargetLesson116";

describe("RationalEquationsTargetLesson116", () => {
  it("renders the target restriction and exact candidate from calculated state", () => {
    const html = renderToStaticMarkup(
      <RationalEquationsTargetLesson116
        lesson={{ id: 116 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0173"');
    expect(html).toContain('data-problem="1,2,3"');
    expect(html).toContain('data-answer="7/3"');
    expect(html).toContain('data-solution-status="unique"');
    expect(html).toContain('data-restriction-satisfied="true"');
    expect(html).toContain('data-substitution-satisfied="true"');
    expect(html).toContain('aria-label="Drag multiplier x − 2"');
    expect(html).toContain('aria-label="Drag forbidden denominator value"');
  });
});
