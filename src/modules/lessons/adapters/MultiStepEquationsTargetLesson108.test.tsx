import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import MultiStepEquationsTargetLesson108 from "./MultiStepEquationsTargetLesson108";

describe("MultiStepEquationsTargetLesson108", () => {
  it("renders the target completed balance sequence from its dedicated model", () => {
    const html = renderToStaticMarkup(
      <MultiStepEquationsTargetLesson108
        lesson={{ id: 108 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0165"');
    expect(html).toContain('data-problem="2x + 3 = 11"');
    expect(html).toContain('data-intermediate="8"');
    expect(html).toContain('data-solution="4"');
    expect(html).toContain('data-check-value="11"');
    expect(html).toContain('data-step="3"');
    expect(html).toContain('data-operation-drops="constant,groups"');
    expect(html).toContain('data-both-operations-dropped="true"');
    expect(html).toContain('data-practice-correct="true"');
    expect(html).toContain('aria-label="Remove constant drop target"');
    expect(html).toContain('aria-label="Equal groups drop target"');
  });
});
