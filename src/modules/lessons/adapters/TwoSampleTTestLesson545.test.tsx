import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import TwoSampleTTestLesson545 from "./TwoSampleTTestLesson545";

describe("TwoSampleTTestLesson545", () => {
  it("renders the Welch test from both visible samples", () => {
    const html = renderToStaticMarkup(
      <TwoSampleTTestLesson545
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 545, title: "Two-Sample t-Test" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0508"');
    expect(html).toContain("14.30");
    expect(html).toContain("9.75");
    expect(html).toContain("Reject H0");
    expect(html).toContain("Download summary");
  });
});
