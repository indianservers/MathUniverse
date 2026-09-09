import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RationalisationTargetLesson101 from "./RationalisationTargetLesson101";

describe("RationalisationTargetLesson101", () => {
  it("renders the target denominator-cleaning workspace from its model", () => {
    const html = renderToStaticMarkup(
      <RationalisationTargetLesson101
        lesson={{ id: 101, title: "Rationalisation" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0158"');
    expect(html).toContain('data-denominator="√2"');
    expect(html).toContain('data-multiplier-label="√2"');
    expect(html).toContain('data-denominator-result="2"');
    expect(html).toContain('data-result="√2/2"');
    expect(html).toContain('data-decimal-match="true"');
    expect(html).toContain('aria-label="Multiplier drop target"');
  });
});
