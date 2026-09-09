import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import IndicesTargetLesson99 from "./IndicesTargetLesson99";

describe("IndicesTargetLesson99", () => {
  it("renders the target repeated-factor lab from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <IndicesTargetLesson99
        lesson={{ id: 99, title: "Indices" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0156"');
    expect(html).toContain('data-first-power="x³"');
    expect(html).toContain('data-second-power="x²"');
    expect(html).toContain('data-result-power="x⁵"');
    expect(html).toContain('data-left-value="1024"');
    expect(html).toContain('data-equal="true"');
    expect(html).toContain('aria-label="Drag first power factor 1"');
  });
});
