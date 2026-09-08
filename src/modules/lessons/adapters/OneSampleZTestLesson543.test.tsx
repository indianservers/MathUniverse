import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import OneSampleZTestLesson543 from "./OneSampleZTestLesson543";

describe("OneSampleZTestLesson543", () => {
  it("renders the live known-sigma test", () => {
    const html = renderToStaticMarkup(
      <OneSampleZTestLesson543
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 543, title: "One-Sample z-Test" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0506"');
    expect(html).toContain("3.00");
    expect(html).toContain("0.0027");
    expect(html).toContain("0.50");
    expect(html).toContain("Reject H0");
  });
});
