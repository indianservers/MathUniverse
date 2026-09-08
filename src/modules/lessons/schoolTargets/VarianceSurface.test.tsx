import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./VarianceTargetLesson10218";
it("renders dedicated squared areas, spread controls and checked practice", () => {
  const lesson = { title: "Variance" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0892"');
  expect(html).toContain('aria-label="Spread control"');
  expect(html).toContain('aria-label="Probability model"');
  expect(html.match(/role="slider"/g)).toHaveLength(2);
  expect(html.match(/type="number"/g)).toHaveLength(3);
  expect(html).toContain("0.7071");
  expect(html).toContain("Why squaring matters");
  expect(html).toContain("Check answers");
});
