import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import CentralLimitTheoremLesson538 from "./CentralLimitTheoremLesson538";
describe("CentralLimitTheoremLesson538", () => {
  it("renders the target CLT experiment", () => {
    const html = renderToStaticMarkup(
      <CentralLimitTheoremLesson538
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 538, title: "Central Limit Theorem" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0501"');
    expect(html).toContain("Central Limit Theorem Lab");
    expect(html).toContain("0.1826");
    expect(html).toContain("10,000");
    expect(html).toContain("Normal overlay check");
  });
});
