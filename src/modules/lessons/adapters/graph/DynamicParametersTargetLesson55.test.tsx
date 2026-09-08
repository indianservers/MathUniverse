import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import DynamicParametersTargetLesson55 from "./DynamicParametersTargetLesson55";

describe("DynamicParametersTargetLesson55", () => {
  it("renders the target family with real controls and derived period", () => {
    const html = renderToStaticMarkup(
      <DynamicParametersTargetLesson55
        lesson={{ id: 55, title: "Dynamic Parameters" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0147"');
    expect(html).toContain('data-dedicated-lesson="55"');
    expect(html).toContain('data-a="2.00"');
    expect(html).toContain('data-period="4.188790"');
    expect(html).toContain('aria-label="Amplitude parameter"');
    expect(html).toContain("Animate parameter sweep");
  });
});
