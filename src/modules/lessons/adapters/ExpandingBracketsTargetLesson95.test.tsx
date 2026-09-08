import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ExpandingBracketsTargetLesson95 from "./ExpandingBracketsTargetLesson95";

describe("ExpandingBracketsTargetLesson95", () => {
  it("renders the target area model from a dedicated distributive model", () => {
    const html = renderToStaticMarkup(
      <ExpandingBracketsTargetLesson95
        lesson={{ id: 95, title: "Expanding Brackets" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0152"');
    expect(html).toContain('data-expression="4(x + 3)"');
    expect(html).toContain('data-expanded="4x + 12"');
    expect(html).toContain('data-unit-cells="12"');
    expect(html).toContain('aria-label="Drag outside factor"');
  });
});
