import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RecurrenceModellingTargetLesson346 from "./RecurrenceModellingTargetLesson346";

describe("RecurrenceModellingTargetLesson346", () => {
  it("renders the target population model from its dedicated recurrence", () => {
    const html = renderToStaticMarkup(
      <RecurrenceModellingTargetLesson346
        lesson={{ id: 346, title: "Recurrence Modelling" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="sequence-mockup-0531"');
    expect(html).toContain(
      'data-values="50000,55000,60500,66550,73205,80525.5,88578.05,97435.855,107179.4405,117897.38455,129687.123005"',
    );
    expect(html).toContain('data-recursive="129687.123005"');
    expect(html).toContain('data-closed="129687.123005"');
    expect(html).toContain('data-equilibrium="0"');
    expect(html).toContain('data-stable="false"');
    expect(html).toContain('data-language="en"');
  });
});
