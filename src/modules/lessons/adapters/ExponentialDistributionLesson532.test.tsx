import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ExponentialDistributionLesson532 from "./ExponentialDistributionLesson532";

describe("ExponentialDistributionLesson532", () => {
  it("renders the target waiting-time calculations", () => {
    const html = renderToStaticMarkup(<ExponentialDistributionLesson532 resetToken={0} onInteraction={vi.fn()}/>);
    expect(html).toContain('data-testid="probability-mockup-0495"');
    expect(html).toContain("Waiting times between events");
    expect(html).toContain("0.1205");
    expect(html).toContain("0.3012");
    expect(html).toContain("0.6988");
    expect(html).toContain("6.250");
  });
});
