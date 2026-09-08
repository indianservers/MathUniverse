import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PairedTTestLesson546 from "./PairedTTestLesson546";

describe("PairedTTestLesson546", () => {
  it("renders the test from real within-pair differences", () => {
    const html = renderToStaticMarkup(
      <PairedTTestLesson546
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 546, title: "Paired t-Test" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0509"');
    expect(html).toContain("69.6");
    expect(html).toContain("75.8");
    expect(html).toContain("6.20");
    expect(html).toContain("Reject H0");
  });
});
