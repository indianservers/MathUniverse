import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Addition Rule dedicated surface", () => {
  it("routes lesson 504 to its two-dice inclusion-exclusion lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 504)!;
    const html = renderToStaticMarkup(
      <ProbabilityLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="probability-mockup-0467"');
    expect(html).toContain("Sample space (36 outcomes)");
    expect(html).toContain("Double-count warning");
    expect(html).toContain("11/36");
  });
});
