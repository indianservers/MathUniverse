import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import FDistributionLesson531 from "./FDistributionLesson531";

describe("FDistributionLesson531", () => {
  it("renders the target F distribution workspace", () => {
    const html = renderToStaticMarkup(<FDistributionLesson531 resetToken={0} onInteraction={vi.fn()}/>);
    expect(html).toContain('data-testid="probability-mockup-0494"');
    expect(html).toContain("Explore the F distribution");
    expect(html).toContain("2.711");
    expect(html).toContain("Fobs = 3.200");
    expect(html).toContain("Decision: Reject H0");
  });
});
