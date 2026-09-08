import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./TotalProbabilityTargetLesson10213";
it("renders a dedicated source/defect model with four working control pairs", () => {
  const lesson = { title: "Total Probability Theorem" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0887"');
  expect(html.match(/type="range"/g)).toHaveLength(4);
  expect(html.match(/type="number"/g)).toHaveLength(4);
  expect(html).toContain('aria-label="P(D | M1)"');
  expect(html).toContain("0.032");
  expect(html).toContain("37.5%");
  expect(html).toContain("62.5%");
  expect(html).toContain("Expected counts out of 100 items");
  expect(html.match(/Show answer/g)).toHaveLength(3);
});
