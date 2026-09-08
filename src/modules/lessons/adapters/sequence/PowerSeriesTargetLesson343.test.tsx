import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PowerSeriesTargetLesson343 from "./PowerSeriesTargetLesson343";

describe("PowerSeriesTargetLesson343", () => {
  it("renders the target cosine series from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <PowerSeriesTargetLesson343
        lesson={{ id: 343, title: "Power Series" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0528"');
    expect(html).toContain('data-coefficients="1,0,-0.5,0,0.04166667');
    expect(html).toContain('data-radius="infinity"');
    expect(html).toContain('data-interval="(-∞, ∞)"');
    expect(html).toContain('data-recognized="cos x"');
    expect(html).toContain('data-language="en"');
  });
});
