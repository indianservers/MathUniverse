import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LiteralEquationsTargetLesson110 from "./LiteralEquationsTargetLesson110";

describe("LiteralEquationsTargetLesson110", () => {
  it("renders the target rearrangement and calculated verification", () => {
    const html = renderToStaticMarkup(
      <LiteralEquationsTargetLesson110
        lesson={{ id: 110 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0167"');
    expect(html).toContain('data-formula="A = l w"');
    expect(html).toContain('data-subject="w"');
    expect(html).toContain('data-result="w = A / l"');
    expect(html).toContain('data-numeric-result="4"');
    expect(html).toContain('data-check-correct="true"');
    expect(html).toContain('aria-label="Drag inverse operation Divide by l"');
    expect(html).toContain("The rearranged formula works!");
  });
});
