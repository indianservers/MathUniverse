import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PValueVisualiserLesson553 from "./PValueVisualiserLesson553";
describe("PValueVisualiserLesson553", () => {
  it("renders the target two-tail scenario", () => {
    const html = renderToStaticMarkup(
      <PValueVisualiserLesson553
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 553, title: "p-Value Visualiser" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0516"');
    expect(html).toContain("0.0930");
    expect(html).toContain("-1.960");
    expect(html).toContain("1.960");
    expect(html).toContain("Fail to reject H0");
    const tails = [...html.matchAll(/class="shade" points="([^"]+)"/g)].map(match =>
      match[1].split(" ").map(point => Number(point.split(",")[0])),
    );
    expect(tails).toHaveLength(2);
    expect(tails.every(points => points.length > 10)).toBe(true);
    expect(Math.max(...tails[0])).toBeLessThan(Math.min(...tails[1]));
  });
});
