import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RadicalEquationsTargetLesson117 from "./RadicalEquationsTargetLesson117";

describe("RadicalEquationsTargetLesson117", () => {
  it("renders the target domain and verified candidate from calculated state", () => {
    const html = renderToStaticMarkup(
      <RadicalEquationsTargetLesson117
        lesson={{ id: 117 } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="algebra-mockup-0174"');
    expect(html).toContain('data-problem="1,4"');
    expect(html).toContain('data-domain="-1"');
    expect(html).toContain('data-solution="15"');
    expect(html).toContain('data-solution-status="valid"');
    expect(html).toContain('data-principal-root="4"');
    expect(html).toContain('data-candidate-valid="true"');
    expect(html).toContain('aria-label="Drag square both sides for x + 1"');
    expect(html).toContain('aria-label="Drag radical domain boundary"');
  });
});
