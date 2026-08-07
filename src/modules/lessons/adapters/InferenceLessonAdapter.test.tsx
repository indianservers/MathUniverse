import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import InferenceLessonAdapter from "./InferenceLessonAdapter";

describe("InferenceLessonAdapter", () => {
  it("renders inference lessons 537 through 552 with lesson-specific guidance", () => {
    const expected = new Map([
      [537, "Sampling Distributions"],
      [538, "Central Limit Theorem"],
      [539, "Confidence Interval for Mean"],
      [540, "Confidence Interval for Proportion"],
      [541, "Difference of Means Interval"],
      [542, "Difference of Proportions Interval"],
      [543, "One-Sample z-Test"],
      [544, "One-Sample t-Test"],
      [545, "Two-Sample t-Test"],
      [546, "Paired t-Test"],
      [547, "One-Proportion Test"],
      [548, "Two-Proportion Test"],
      [549, "Chi-Square Goodness-of-Fit"],
      [550, "Chi-Square Independence"],
      [551, "Variance Tests"],
      [552, "ANOVA"],
      [553, "p-Value Visualiser"],
      [554, "Type I and Type II Errors"],
      [555, "Power of a Test"],
    ]);

    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <InferenceLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, String(lessonId)).toContain(lesson.title);
      expect(html, String(lessonId)).toContain(snippet);
      expect(html, String(lessonId)).not.toContain("Check assumptions, compute the statistic, and interpret in context.");
    }
  });
});
