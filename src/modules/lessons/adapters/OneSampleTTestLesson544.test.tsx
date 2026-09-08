import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import OneSampleTTestLesson544 from "./OneSampleTTestLesson544";

describe("OneSampleTTestLesson544", () => {
  it("renders the test from the visible observations", () => {
    const html = renderToStaticMarkup(
      <OneSampleTTestLesson544
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 544, title: "One-Sample t-Test" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0507"');
    expect(html).toContain("71.70");
    expect(html).toContain("2.751");
    expect(html).toContain("1.954");
    expect(html).toContain("Fail to reject H0");
  });
});
