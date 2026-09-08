import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";
describe("Events dedicated surface", () => {
  it("routes 501 to selectable dice events", () => {
    const lesson = lessonCatalog.find((item) => item.id === 501)!;
    const html = renderToStaticMarkup(
      <ProbabilityLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="probability-mockup-0464"');
    expect(html).toContain("Two fair dice");
    expect(html).toContain("Complement");
    expect(html.match(/aria-label="Outcome/g)).toHaveLength(36);
  });
});
