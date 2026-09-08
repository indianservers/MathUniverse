import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import AnovaLesson552 from "./AnovaLesson552";

describe("AnovaLesson552", () => {
  it("renders the target one-way ANOVA with live calculations", () => {
    const html = renderToStaticMarkup(
      <AnovaLesson552
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 552, title: "ANOVA" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0515"');
    expect(html).toContain("mean = 8.00");
    expect(html).toContain("mean = 12.50");
    expect(html).toContain("mean = 16.50");
    expect(html).toContain("217.00");
    expect(html).toContain("21.00");
    expect(html).toContain("77.50");
    expect(html).toContain("Reject H0");
  });
});
