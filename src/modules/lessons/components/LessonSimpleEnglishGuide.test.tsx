import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { strengthenedFoundationLessonIds } from "../strengthening/foundationNumberContent";
import DedicatedLessonTabHost from "./DedicatedLessonTabHost";
import LessonSimpleEnglishGuide from "./LessonSimpleEnglishGuide";
import { getLessonSimpleEnglish } from "./lessonSimpleEnglish";

describe("simple English lesson guides", () => {
  it("writes three plain paragraphs and an example for every strengthened lesson", () => {
    expect(strengthenedFoundationLessonIds.length).toBeGreaterThan(100);
    const openings = new Set<string>();
    for (const id of strengthenedFoundationLessonIds) {
      const guide = getLessonSimpleEnglish(id);
      expect(guide, `guide ${id}`).not.toBeNull();
      expect(guide!.paragraphs).toHaveLength(3);
      for (const paragraph of guide!.paragraphs) {
        expect(paragraph.length, `paragraph ${id}`).toBeGreaterThanOrEqual(80);
      }
      expect(guide!.examplePrompt.length).toBeGreaterThan(8);
      expect(guide!.exampleAnswer.length).toBeGreaterThan(0);
      openings.add(guide!.paragraphs[0]);
    }
    expect(openings.size).toBeGreaterThan(strengthenedFoundationLessonIds.length * 0.6);
  });

  it("explains zeros and coefficients with a concrete example", () => {
    const guide = getLessonSimpleEnglish(10050);
    expect(guide?.title).toMatch(/zeros|coefficients/i);
    expect(guide?.paragraphs.join(" ")).toMatch(/sum|product|zero/i);
    expect(guide?.examplePrompt).toMatch(/x\^2|sum/i);
    const html = renderToStaticMarkup(
      <LessonSimpleEnglishGuide lessonId={10050} />,
    );
    expect(html).toContain('data-testid="lesson-simple-english"');
    expect(html).toContain("In simple English");
    expect(html).toContain("Try this example");
  });

  it("renders on dedicated school routes", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-polynomials-relationship-between-zeros-and-coefficients",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={
              <DedicatedLessonTabHost>
                <div>lab</div>
              </DedicatedLessonTabHost>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("Understand Relationship Between Zeros and Coefficients");
    expect(html).toContain("For x^2 - 5x + 6");
  });
});
