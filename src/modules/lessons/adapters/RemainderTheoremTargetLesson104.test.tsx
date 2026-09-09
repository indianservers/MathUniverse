import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RemainderTheoremTargetLesson104 from "./RemainderTheoremTargetLesson104";

describe("RemainderTheoremTargetLesson104", () => {
  it("renders the target theorem proof from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <RemainderTheoremTargetLesson104
        lesson={{ id: 104 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0161"');
    expect(html).toContain('data-polynomial="x² + 3x + 2"');
    expect(html).toContain('data-divisor-root="1"');
    expect(html).toContain('data-evaluated="6"');
    expect(html).toContain('data-quotient="x + 4"');
    expect(html).toContain('data-remainder="6"');
    expect(html).toContain('data-agree="true"');
    expect(html).toContain('data-identity-verified="true"');
    expect(html).toContain('href="/lessons/algebra/103-synthetic-division"');
    expect(html).toContain('href="/lessons/algebra/105-factor-theorem"');
  });
});
