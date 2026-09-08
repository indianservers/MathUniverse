import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./ExpectedValueTargetLesson10217";
it("renders a dedicated balancing model and unpopulated actual simulation", () => {
  const lesson = { title: "Expected Value" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0891"');
  expect(html.match(/role="slider"/g)).toHaveLength(3);
  expect(html.match(/type="range"/g)).toHaveLength(6);
  expect(html).toContain("Total Left Moment");
  expect(html).toContain("No trials yet");
  expect(html).toContain("0.3");
  expect(html).toContain("The sums 2 through 12 are not equally likely.");
  expect(html.match(/Show answer/g)).toHaveLength(4);
});
