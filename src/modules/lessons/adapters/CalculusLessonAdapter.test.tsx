import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import CalculusLessonAdapter from "./CalculusLessonAdapter";

describe("CalculusLessonAdapter", () => {
  it("renders calculus lessons 277 through 305 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      277: "Informal limits",
      278: "One-sided limits",
      279: "Infinite limits",
      280: "Limits at infinity",
      281: "Continuity at a point",
      282: "Types of discontinuity",
      283: "Epsilon-delta visualiser",
      284: "Average rate of change",
      285: "Instantaneous rate of change",
      286: "First principles",
      287: "Tangent line",
      288: "Normal line",
      289: "Derivative graph",
      290: "Higher derivatives",
      291: "Product rule",
      292: "Quotient rule",
      293: "Chain rule",
      294: "Implicit differentiation",
      295: "Parametric differentiation",
      296: "Critical points",
      297: "Increasing or decreasing",
      298: "Local and global extrema",
      299: "Concavity",
      300: "Inflection points",
      301: "Optimisation",
      302: "Related rates",
      303: "Motion analysis",
      304: "Newton's method",
      305: "Taylor polynomial",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <CalculusLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );
      const visibleText = html.replaceAll("&#x27;", "'");

      expect(visibleText, lesson.title).toContain(lesson.title);
      expect(visibleText, lesson.title).toContain(snippet);
      expect(visibleText, lesson.title).not.toContain("Calculus rule");
    }
  });

  it("renders calculus lessons 306 through 333 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      306: "Area by rectangles",
      307: "Riemann sums",
      308: "Definite integral",
      309: "Indefinite integral",
      310: "Fundamental theorem",
      311: "Area between curves",
      312: "Substitution",
      313: "Integration by parts",
      314: "Partial fractions",
      315: "Improper integrals",
      316: "Numerical integration",
      317: "Volume by slicing",
      318: "Disc and washer methods",
      319: "Shell method",
      320: "Arc length",
      321: "Surface area of revolution",
      322: "Accumulation functions",
      323: "Direction fields",
      324: "Euler's method",
      325: "Separable equations",
      326: "First-order linear equations",
      327: "Logistic growth",
      328: "Second-order equations",
      329: "Phase plane",
      330: "Equilibrium and stability",
      331: "Discrete dynamical systems",
      332: "Cobweb diagrams",
      333: "Chaos and bifurcation",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <CalculusLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );
      const visibleText = html.replaceAll("&#x27;", "'");

      expect(visibleText, lesson.title).toContain(lesson.title);
      expect(visibleText, lesson.title).toContain(snippet);
      expect(visibleText, lesson.title).not.toContain("Calculus rule");
    }
  });
});
