import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LikeTermsTargetLesson93 from "./LikeTermsTargetLesson93";

describe("LikeTermsTargetLesson93", () => {
  it("renders the target lab from the dedicated term model", () => {
    const html = renderToStaticMarkup(
      <LikeTermsTargetLesson93
        lesson={{ id: 93, title: "Like Terms" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0150"');
    expect(html).toContain('data-expression="7x − 2x + 4"');
    expect(html).toContain('data-simplified="5x + 4"');
    expect(html).toContain('data-original-value="24"');
    expect(html).toContain('aria-label="Positive unit tile 4"');
  });
});
