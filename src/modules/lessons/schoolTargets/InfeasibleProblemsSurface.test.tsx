import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./InfeasibleProblemsTargetLesson10206";

it("renders the dedicated bound lab, comparison and unanswered practice", () => {
  const lesson = { title: "Infeasible Problems" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0880"');
  expect(html).toContain("Algebraic certificate");
  expect(html).toContain("the system has no solution");
  expect(html.match(/role="slider"/g)).toHaveLength(2);
  expect(html.match(/type="range"/g)).toHaveLength(2);
  expect(html.match(/type="radio"/g)).toHaveLength(4);
  expect(html).toContain("Explore Touching (single point)");
  expect(html).toContain("PARALLEL, NON-OVERLAPPING HALF-PLANES");
  expect(html).toContain("Check answer");
  expect(html).not.toContain("Correct. Option C");
  expect(html).toContain("Next: Diet Problem");
});
