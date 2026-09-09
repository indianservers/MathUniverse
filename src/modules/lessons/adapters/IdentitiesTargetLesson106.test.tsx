import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import IdentitiesTargetLesson106 from "./IdentitiesTargetLesson106";

describe("IdentitiesTargetLesson106", () => {
  it("renders the target area proof from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <IdentitiesTargetLesson106
        lesson={{ id: 106 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0163"');
    expect(html).toContain('data-side="7"');
    expect(html).toContain('data-area-x2="25"');
    expect(html).toContain('data-area-2x="10"');
    expect(html).toContain('data-area-total="49"');
    expect(html).toContain('data-samples-match="true"');
    expect(html).toContain('data-practice-expected="y² + 6y + 9"');
    expect(html).toContain('aria-label="Drag area tile x2"');
    expect(html).toContain('aria-label="Area parts drop target"');
  });
});
