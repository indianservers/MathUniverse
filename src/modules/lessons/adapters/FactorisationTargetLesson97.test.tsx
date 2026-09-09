import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import FactorisationTargetLesson97 from "./FactorisationTargetLesson97";

describe("FactorisationTargetLesson97", () => {
  it("renders the target reverse-area workspace from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <FactorisationTargetLesson97
        lesson={{ id: 97, title: "Factorisation" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0154"');
    expect(html).toContain('data-expression="x² + 5x + 6"');
    expect(html).toContain('data-split="x² + 2x + 3x + 6"');
    expect(html).toContain('data-factors="(x + 2)(x + 3)"');
    expect(html).toContain('data-equivalent="true"');
    expect(html).toContain('aria-label="Drag first split term"');
  });
});
