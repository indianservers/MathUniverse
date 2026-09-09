import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import OneStepEquationsTargetLesson107 from "./OneStepEquationsTargetLesson107";

describe("OneStepEquationsTargetLesson107", () => {
  it("renders the target balance proof from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <OneStepEquationsTargetLesson107
        lesson={{ id: 107 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0164"');
    expect(html).toContain('data-equation="x + 5 = 12"');
    expect(html).toContain('data-inverse="Subtract 5"');
    expect(html).toContain('data-solution="7"');
    expect(html).toContain('data-check-left="12"');
    expect(html).toContain('data-check-correct="true"');
    expect(html).toContain('aria-label="Apply inverse operation to left side"');
    expect(html).toContain(
      'aria-label="Apply inverse operation to right side"',
    );
    expect(html).toContain('href="/lessons/algebra/106-identities"');
    expect(html).toContain('href="/lessons/algebra/108-multi-step-equations"');
  });
});
