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
  });
});
