import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("Multiplication Rule dedicated surface", () => {
  it("routes lesson 505 to its sequential experiment tree", () => {
    const lesson = lessonCatalog.find((item) => item.id === 505)!;
    const html = renderToStaticMarkup(<ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="probability-mockup-0468"');
    expect(html).toContain("Sequential experiment builder");
    expect(html).toContain("Path probability");
    expect(html).toContain("1/12");
  });
});
