import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./ConditionalProbabilityTargetLesson10210";
it("renders 40 editable students, conditioning and real formula choices", () => {
  const lesson = { title: "Conditional Probability" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0884"');
  expect(html.match(/aria-label="Student /g)).toHaveLength(40);
  expect(html).toContain('aria-label="Numerator event count"');
  expect(html).toContain('aria-label="Denominator sample count"');
  expect(html).toContain("8/16 = 1/2 = 0.5 = 50%");
  expect(html).toContain("Given B occurred");
  expect(html).toContain("Reverse: Given A occurred");
  expect(html.match(/type="radio"/g)).toHaveLength(3);
  expect(html).not.toContain("Correct: restrict");
});
