import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import ProbabilityLessonAdapter from "./ProbabilityLessonAdapter";

describe("ProbabilityLessonAdapter", () => {
  it("renders probability lessons 500 through 536 with lesson-specific guidance", () => {
    const expected = new Map([
      [500, "Sample Spaces"],
      [501, "Events"],
      [502, "Probability Scale"],
      [503, "Complement Rule"],
      [504, "Addition Rule"],
      [505, "Multiplication Rule"],
      [506, "Independent Events"],
      [507, "Mutually Exclusive Events"],
      [508, "Conditional Probability"],
      [509, "Tree Diagrams"],
      [510, "Venn Diagrams"],
      [511, "Two-Way Tables"],
      [512, "Bayes&#x27; Theorem"],
      [513, "Expected Value"],
      [514, "Simulation"],
      [515, "Law of Large Numbers"],
      [516, "Distribution Calculator"],
      [517, "Probability Plot"],
      [518, "Cumulative Distribution"],
      [519, "Interval / Tail Probability"],
      [520, "Inverse Probability"],
      [521, "Bernoulli Distribution"],
      [522, "Binomial Distribution"],
      [523, "Hypergeometric Distribution"],
      [524, "Poisson Distribution"],
      [525, "Geometric Distribution"],
      [526, "Negative Binomial Distribution"],
      [527, "Uniform Distribution"],
      [528, "Normal Distribution"],
      [529, "Student t Distribution"],
      [530, "Chi-Square Distribution"],
      [531, "F Distribution"],
      [532, "Exponential Distribution"],
      [533, "Gamma Distribution"],
      [534, "Weibull Distribution"],
      [535, "Standardisation"],
      [536, "Distribution Simulation"],
    ]);

    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <ProbabilityLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, String(lessonId)).toContain(lesson.title.replace("'", "&#x27;"));
      expect(html, String(lessonId)).toContain(snippet);
      expect(html, String(lessonId)).not.toContain("Repeated samples converge toward the theoretical model.</p></div><div");
    }
  });
});
