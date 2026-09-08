import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./BayesTheoremTargetLesson10214";
it("renders a dedicated prior/evidence/posterior pipeline", () => {
  const lesson = { title: "Bayes' Theorem" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0888"');
  expect(html.match(/type="range"/g)).toHaveLength(4);
  expect(html).toContain('aria-label="P(D | M2)"');
  expect(html).toContain("0.032");
  expect(html).toContain("62.5%");
  expect(html).toContain("63.2%");
  expect(html.match(/type="radio"/g)).toHaveLength(4);
  expect(html).toContain("NATURAL FREQUENCY VIEW");
});
