import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RecursiveSequencesTargetLesson337 from "./RecursiveSequencesTargetLesson337";
describe("RecursiveSequencesTargetLesson337", () => {
  it("renders the target recurrence from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <RecursiveSequencesTargetLesson337
        lesson={{ id: 337, title: "Recursive Sequences" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0522"');
    expect(html).toContain('data-rule="0.6aₙ₋₁ + 4"');
    expect(html).toContain(
      'data-terms="2,5.2,7.12,8.272,8.9632,9.37792,9.626752,9.776051,9.865631,9.919378"',
    );
    expect(html).toContain('data-fixed="10"');
    expect(html).toContain('data-behavior="Convergent"');
    expect(html).toContain("9.377920");
  });
});
