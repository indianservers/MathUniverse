import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import StatisticsLessonAdapter from "./StatisticsLessonAdapter";

describe("StatisticsLessonAdapter", () => {
  it("renders statistics lessons 467 through 492 with lesson-specific guidance", () => {
    const expected = new Map([
      [467, "Data Types"],
      [468, "Frequency Tables"],
      [469, "Grouped Frequency Tables"],
      [470, "Mean"],
      [471, "Median"],
      [472, "Mode"],
      [473, "Weighted Mean"],
      [474, "Range"],
      [475, "Quartiles and IQR"],
      [476, "Variance and Standard Deviation"],
      [477, "Percentiles"],
      [478, "Z-Scores"],
      [479, "Outliers"],
      [481, "Dot Plot"],
      [482, "Stem-and-Leaf Plot"],
      [483, "Histogram"],
      [484, "Frequency Polygon"],
      [485, "Cumulative Frequency Curve"],
      [486, "Bar and Pie Charts"],
      [487, "Scatter Plot"],
      [488, "Time-Series Plot"],
      [489, "Correlation Coefficient"],
      [490, "Linear Regression"],
      [491, "Polynomial Regression"],
      [492, "Exponential Regression"],
      [493, "Logarithmic Regression"],
      [494, "Power Regression"],
      [495, "Logistic Regression"],
      [496, "Sinusoidal Regression"],
      [497, "Residual Plot"],
      [498, "Model Comparison"],
      [499, "Interpolation and Extrapolation"],
    ]);

    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <StatisticsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, String(lessonId)).toContain(lesson.title);
      expect(html, String(lessonId)).toContain(snippet);
      expect(html, String(lessonId)).not.toContain("Read the data, choose the matching summary, and check context.");
    }
  });
});
