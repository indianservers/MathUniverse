import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import QuadraticEquationsTargetLesson114 from "./QuadraticEquationsTargetLesson114";

describe("QuadraticEquationsTargetLesson114", () => {
  it("renders the target factor and parabola from calculated state", () => {
    const html = renderToStaticMarkup(
      <QuadraticEquationsTargetLesson114
        lesson={{ id: 114 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0171"');
    expect(html).toContain('data-equation="1,-5,6"');
    expect(html).toContain('data-roots="2,3"');
    expect(html).toContain('data-discriminant="1"');
    expect(html).toContain('data-vertex="2.5,-0.25"');
    expect(html).toContain('data-method="Factoring"');
    expect(html).toContain('aria-label="Drag root 1"');
    expect(html).toContain('aria-label="Graph of y equals x² − 5x + 6"');
  });
});
