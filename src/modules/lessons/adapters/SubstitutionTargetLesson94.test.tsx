import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SubstitutionTargetLesson94 from "./SubstitutionTargetLesson94";

describe("SubstitutionTargetLesson94", () => {
  it("renders the target machine from the dedicated evaluation model", () => {
    const html = renderToStaticMarkup(
      <SubstitutionTargetLesson94
        lesson={{ id: 94, title: "Substitution" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0151"');
    expect(html).toContain('data-result="17"');
    expect(html).toContain('data-correct-result="17"');
    expect(html).toContain('data-preserves-meaning="true"');
    expect(html).toContain('aria-label="Drag chosen value"');
  });
});
