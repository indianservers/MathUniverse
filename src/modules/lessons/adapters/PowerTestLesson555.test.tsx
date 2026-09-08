import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PowerTestLesson555 from "./PowerTestLesson555";
describe("PowerTestLesson555", () => {
  it("renders the target scenario with consistent power", () => {
    const html = renderToStaticMarkup(
      <PowerTestLesson555
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 555, title: "Power of a Test" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0518"');
    expect(html).toContain("0.5000");
    expect(html).toContain("1.2500");
    expect(html).toContain("0.9793");
    expect(html).toContain("n = 32");
  });
});
