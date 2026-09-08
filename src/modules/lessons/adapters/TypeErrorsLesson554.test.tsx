import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import TypeErrorsLesson554 from "./TypeErrorsLesson554";
describe("TypeErrorsLesson554", () => {
  it("renders the target error tradeoff with correct calculations", () => {
    const html = renderToStaticMarkup(
      <TypeErrorsLesson554
        resetToken={0}
        onInteraction={vi.fn()}
        lesson={{ id: 554, title: "Type I and Type II Errors" } as never}
      />,
    );
    expect(html).toContain('data-testid="inference-mockup-0517"');
    expect(html).toContain("2.40");
    expect(html).toContain("0.0500");
    expect(html).toContain("0.225");
    expect(html).toContain("0.7749");
  });
});
