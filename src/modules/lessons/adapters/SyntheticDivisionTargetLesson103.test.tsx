import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SyntheticDivisionTargetLesson103 from "./SyntheticDivisionTargetLesson103";

describe("SyntheticDivisionTargetLesson103", () => {
  it("renders the target Horner table from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <SyntheticDivisionTargetLesson103
        lesson={{ id: 103, title: "Synthetic Division" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0160"');
    expect(html).toContain('data-synthetic-number="-2"');
    expect(html).toContain('data-coefficients="1,5,6"');
    expect(html).toContain('data-quotient="x + 3"');
    expect(html).toContain('data-remainder="0"');
    expect(html).toContain('data-expansion-verified="true"');
  });
});
