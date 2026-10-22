import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import StandardisationLesson535 from "./StandardisationLesson535";
describe("StandardisationLesson535", () => {
  it("renders the target reversible mapping", () => {
    const html = renderToStaticMarkup(
      <StandardisationLesson535 resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="probability-mockup-0498"');
    expect(html).toContain("Map raw observations");
    expect(html).toContain("z = 1.50");
    expect(html).toContain("0.93319");
    expect(html).toContain("65.00");
  });
});
