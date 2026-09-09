import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SurdsTargetLesson100 from "./SurdsTargetLesson100";

describe("SurdsTargetLesson100", () => {
  it("renders the target square-factor extractor from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <SurdsTargetLesson100
        lesson={{ id: 100, title: "Surds" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0157"');
    expect(html).toContain('data-radicand="50"');
    expect(html).toContain('data-square-factor="25"');
    expect(html).toContain('data-remaining-factor="2"');
    expect(html).toContain('data-result="5√2"');
    expect(html).toContain('data-decimal-match="true"');
    expect(html).toContain('aria-label="Drag radical 50"');
  });
});
