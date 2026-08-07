import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import AlgebraCasLessonAdapter from "./AlgebraCasLessonAdapter";

describe("AlgebraCasLessonAdapter", () => {
  it("renders the next 30 pending algebra lessons through lesson-specific CAS models", () => {
    const expectedSnippets: Record<number, string> = {
      92: "Build x tiles and unit tiles",
      93: "Group x terms with x terms",
      94: "Replace x with 3",
      95: "Multiply 5 by x",
      96: "x times x gives x^2",
      97: "multiply to 9 and add to 6",
      99: "copies of x times 2",
      100: "Write 72 = 36 x 2",
      101: "Multiply by sqrt",
      102: "Keep the x^2 term",
      103: "Use a = -2",
      104: "Here a = 2",
      105: "Test a = 1",
      106: "Use (a+b)^2",
      107: "from both sides",
      108: "from both sides",
      109: "Subtract 1 from both sides",
      110: "Divide both sides by l",
      111: "Subtract 2 from both sides",
      112: "Add equations to remove y",
      113: "Use z = 2",
      114: "Factor as",
      115: "Use the zero product rule",
      116: "x cannot equal 2",
      117: "Square both sides",
      118: "The bases are both 2",
      119: "means x=2^",
      120: "Reference angle is 30 degrees",
      121: "or x-",
      122: "Subtract 2 from both sides",
      123: "Mark x greater",
      124: "Find critical points",
      125: "Mark all roots",
      126: "Draw the boundary line",
      127: "Shade each inequality",
      128: "Find a sign change",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <AlgebraCasLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
    }
  });

  it("renders Algebraic Fractions with cancellation rules and restrictions", () => {
    const lesson = lessonCatalog.find((item) => item.id === 98)!;
    const html = renderToStaticMarkup(
      <AlgebraCasLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("(x^2-4)/(x-2)");
    expect(html).toContain("x+2, x!=2");
    expect(html).toContain("Excluded value");
    expect(html).toContain("x != 2");
    expect(html).toContain("Common factor");
    expect(html).toContain("x-2");
    expect(html).toContain("factor only");
    expect(html).toContain("Algebraic fractions must keep original denominator restrictions");
  });
});
