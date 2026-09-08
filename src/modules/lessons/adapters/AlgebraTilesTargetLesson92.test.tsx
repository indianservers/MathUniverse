import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import AlgebraTilesTargetLesson92 from "./AlgebraTilesTargetLesson92";

describe("AlgebraTilesTargetLesson92", () => {
  it("renders the target workspace from the dedicated tile model", () => {
    const html = renderToStaticMarkup(
      <AlgebraTilesTargetLesson92
        lesson={{ id: 92, title: "Algebra Tiles" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0149"');
    expect(html).toContain('data-expression="5x − 1"');
    expect(html).toContain('data-evaluation-at-two="9"');
    expect(html).toContain('aria-label="Add x tile"');
    expect(html).toContain("Symbolic equation trace");
  });
});
